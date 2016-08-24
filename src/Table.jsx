/**
 * Table Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

/* eslint "no-underscore-dangle": "off" */

const Header = require('./Header');
const Tbody = require('./Tbody');
const ActionBar = require('./ActionBar');
const CellField = require('./Cell/CellField');
const Pagination = require('uxcore-pagination');
const Const = require('uxcore-const');
const assign = require('object-assign');
const deepcopy = require('deepcopy');
const deepEqual = require('deep-equal');
const classnames = require('classnames');
const util = require('./util');
const NattyFetch = require('natty-fetch/dist/natty-fetch.pc');
const Promise = require('lie');

const React = require('react');
const ReactDOM = require('react-dom');
const Mask = require('./Mask');

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.uid = 0;
    this.fields = {};
    this.state = {
      data: this.addValuesInData(deepcopy(this.props.jsxdata)), // checkbox 内部交互
      columns: this.processColumn(), // column 内部交互
      showMask: props.showMask, // fetchData 时的内部状态改变
      pageSize: props.pageSize, // pagination 相关
      currentPage: props.currentPage, // pagination 相关
      activeColumn: null,
      scrollLeft: 0,
      scrollTop: 0,
      searchTxt: '',
      expandedKeys: [],
    };
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
    this.hasFixed = this.hasFixColumn(props);
  }

  componentWillMount() {
    if (this.props.fetchDataOnMount) {
      this.fetchData();
    }
  }

  componentDidMount() {
    let me = this;
    me.el = ReactDOM.findDOMNode(me);
    if (!!me.state.data && !!me.state.data.datas) {
      console.warn("Table: 'content.data' rather than 'content.datas' is recommended, the support for 'content.datas' will be end from ver. 1.5.0")
    }
    if (me.props.subComp) {
      console.warn("Table: subComp is deprecated, use renderSubComp instead.")
    }
  }

  componentWillReceiveProps(nextProps) {
    const me = this;
    const newData = {};
    if (nextProps.jsxdata
        && me.props.jsxdata
        && !me._isEqual(nextProps.jsxdata, me.props.jsxdata)) {
      // Data has changed, so uid which is used to mark the data should be reset.
      me.uid = 0;
      me.fetchData('dataChange', nextProps);
    }
    if (nextProps.pageSize !== me.props.pageSize) {
      newData['pageSize'] = nextProps.pageSize;
    }
    if (nextProps.currentPage !== me.props.currentPage) {
      newData['currentPage'] = nextProps.currentPage;
    }
    if (!!nextProps.jsxcolumns && !!me.props.jsxcolumns && !me._isEqual(nextProps.jsxcolumns, me.props.jsxcolumns)) {
      newData['columns'] = me.processColumn(nextProps);
      this.hasFixed = this.hasFixColumn(nextProps);
    }
    if (nextProps.showMask !== me.props.showMask) {
      newData['showMask'] = nextProps.showMask;
    }
    if (nextProps.fetchUrl !== me.props.fetchUrl) {
      me.fetchData('urlChange', nextProps);
    }
    me.setState(newData);
  }

  /**
   * For inline edit
   * receive changes from cell field and change state.data
   * inform users of the change with dataKey & pass
   */

  handleDataChange(obj) {
    let me = this;
    let {jsxid, column, value, text, pass} = obj;
    let dataKey = column.dataKey;
    let editKey = column.editKey || dataKey;
    let data = deepcopy(me.state.data);
    let changedData = {};
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].jsxid == jsxid) {
        data.data[i][dataKey] = text;
        data.data[i][editKey] = value;
        changedData = data.data[i];
      }
    }

    me.setState({
      data: data
    }, () => {
      me.props.onChange({
        data: me.state.data,
        editKey: editKey,
        dataKey: dataKey,
        changedData: changedData,
        pass: pass
      });
    })
  }

  /**
   * register CellField to Table for the global validation
   * @param field {element} the cell field to be registered
   */

  attachCellField(validate, name) {
    let me = this;
    if (!name) {
      console.error("Table: dataKey can not be undefined, check the column config");
    } else {
      me.fields[name] = validate;
    }
  }

  /**
   * cancel the CellField when it is unmounted.
   * @param field {element} the cell field to be canceled.
   */

  detachCellField(name) {
    delete this.fields[name];
  }


  /**
   * simple method to compare two datas, 
   * only support the data which JSON can parse.
   */

  _isEqual(a, b) {
    return deepEqual(a, b);
  }


  /**
   * get Query Object by combining data from searchBar, column order, pagination
   * and fetchParams.
   * @param from {string} used in props.beforeFetch
   */

  getQueryObj(from) {

    let me = this,
      queryObj = {};
    if (me.props.passedData) {
      let queryKeys = me.props.queryKeys;
      if (!queryKeys) {
        queryObj = me.props.passedData;
      } else {
        queryKeys.forEach(function(key) {
          if (me.props.passedData[key] !== undefined) {
            queryObj[key] = me.props.passedData[key];
          }
        })
      }
    }

    // pagination
    queryObj = assign({}, queryObj, {
      pageSize: me.state.pageSize,
      currentPage: me.state.currentPage
    });

    // column order
    let activeColumn = me.state.activeColumn;
    let orderType = me.state.orderType;
    if (!!activeColumn) {
      queryObj = assign({}, queryObj, {
        orderColumn: activeColumn.dataKey
      });
      if (!!orderType && orderType != 'none') {
        queryObj.orderType = orderType;
      }
    }

    // search query
    let searchTxt = me.state.searchTxt
    if (!!searchTxt) {
      queryObj = assign({}, queryObj, {
        searchTxt: searchTxt
      })
    }

    // fetchParams has the top priority 
    if (!!me.props.fetchParams) {
      queryObj = assign({}, queryObj, me.props.fetchParams);
    }

    return me.props.beforeFetch(queryObj, from);
  }

  /**
   * fetch Data via Ajax
   * @param from {string} tell fetchData where it is invoked, the param will be 
   * passed to props.beforeFetch in order to help the user.
   */

  fetchData(from, nextProps) {

    const me = this;
    const props = nextProps || this.props;
    // reset uid cause table data has changed
    me.uid = 0;

    // fetchUrl has the top priority.
    if (props.fetchUrl) {
      if (me.request) {
        me.request.abort();
      }
      if (!me.state.showMask) {
        me.setState({
          showMask: true,
        });
      }
      const isJsonp = props.isJsonp === undefined
        ? /\.jsonp/.test(props.fetchUrl)
        : props.isJsonp;
      me.request = NattyFetch.create({
        url: props.fetchUrl,
        data: me.getQueryObj(from),
        fit: props.fitResponse,
        jsonp: isJsonp,
        Promise,
      });

      me.request().then((content) => {
        const processedData = me.addValuesInData(props.processData(deepcopy(content)));
        const updateObj = {
          data: processedData,
          showMask: false,
        };
        if (processedData.currentPage !== undefined) {
          updateObj.currentPage = processedData.currentPage;
        }
        me.data = deepcopy(processedData);
        me.setState(updateObj);
      }).catch((err) => {
        props.onFetchError(err);
      });
    } else if (props.passedData) {
      if (!props.queryKeys) {
        const data = me.addValuesInData(props.processData(deepcopy(props.passedData)));
        me.setState({
          data,
        });
        me.data = deepcopy(data);
      } else {
        const data = {};
        props.queryKeys.forEach((key) => {
          if (props.passedData[key] !== undefined) {
            data[key] = props.passedData[key];
          }
        });
        const processedData = me.addValuesInData(props.processData(deepcopy(data)));
        me.setState({
          data: processedData,
        });
        me.data = deepcopy(processedData);
      }
    } else if (props.jsxdata) {
      if (['pagination', 'order', 'search'].indexOf(from) !== -1) {
        switch (from) {
          case 'pagination':
            if (props.onPagerChange) {
              props.onPagerChange(me.state.currentPage, me.state.pageSize);
            }
            break;
          case 'order':
            if (props.onOrder) {
              props.onOrder(me.state.activeColumn, me.state.orderType);
            }
            break;
          case 'search':
            if (props.onSearch) {
              props.onSearch(me.state.searchTxt);
            }
            break;
        }
      } else {
        const data = this.addValuesInData(deepcopy(props.jsxdata));
        const currentPage = (data && data.currentPage) || this.state.currentPage;
        me.setState({
          data,
          currentPage,
        });
        me.data = deepcopy(data);
      }
    } else {
      // default will create one row
      const data = {
        data: [{
          jsxid: me.uid++,
          __mode__: Const.MODE.EDIT,
        }],
        currentPage: 1,
        totalCount: 0,
      };
      me.data = data;
      me.setState({
        data,
      });
    }
  }


  processColumn(props) {

    props = props || this.props;

    let me = this,
      columns = deepcopy(props.jsxcolumns),
      hasCheckboxColumn = false;

    columns.forEach((item, i) => {
      // only one rowSelector can be rendered in Table.
      if (item.type === 'checkbox' || item.type === 'radioSelector' || item.type === 'checkboxSelector') {
        if (item.type === 'checkbox') {
          console.warn("rowSelector using 'type: checkbox' is deprecated, use 'type: checkboxSelector' instead.");
        }
        hasCheckboxColumn = true;
        me.checkboxColumn = item;
        me.checkboxColumnKey = item.dataKey;
        item.width = item.width || (/kuma-uxtable-border-line/.test(props.className) ? 40 : 32);
        item.align = item.align || 'left';
      }
    });


    // filter the column which has a dataKey 'jsxchecked' & 'jsxtreeIcon'

    columns = columns.filter((item) =>
      item.dataKey !== 'jsxchecked' && item.dataKey !== 'jsxtreeIcon'
    );

    if (!!props.rowSelection & !hasCheckboxColumn) {
      me.checkboxColumn = {
        dataKey: 'jsxchecked',
        width: 46,
        type: props.rowSelector,
        align: 'right',
      };
      me.checkboxColumnKey = 'jsxchecked';
      columns = [me.checkboxColumn].concat(columns);
    } else if (props.parentHasCheckbox) {
      // no rowSelection but has parentHasCheckbox, render placeholder
      columns = [{
        dataKey: 'jsxwhite',
        width: 46,
        type: 'empty',
      }].concat(columns);
    }
    if ((!!props.subComp || !!props.renderSubComp) && props.renderModel !== 'tree') {
      columns = [{
        dataKey: 'jsxtreeIcon',
        width: 34,
        type: 'treeIcon',
      }].concat(columns);
    } else if (props.passedData) {
      // no subComp but has passedData, means sub mode, parent should has tree icon,
      // render tree icon placeholder
      columns = [{
        dataKey: 'jsxwhite',
        width: 34,
        type: 'empty',
      }].concat(columns);
    }
    return columns;
  }

  handleColumnPickerChange(checkedKeys) {
    if (checkedKeys.length === 0) {
      return;
    }
    const columns = deepcopy(this.state.columns);
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];

    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      if ('group' in item) {
        for (let j = 0; j < item.columns.length; j++) {
          const ele = item.columns[j];
          if (checkedKeys.indexOf(ele.dataKey) !== -1) {
            ele.hidden = false;
          } else {
            ele.hidden = true;
          }
        }
      } else if (checkedKeys.indexOf(item.dataKey) !== -1
          || notRenderColumns.indexOf(item.dataKey) !== -1) {
        item.hidden = false;
      } else {
        item.hidden = true;
      }
    }

    this.setState({
      columns,
    });
  }

  /**
   * change SelectedRows data via checkbox, this function will pass to the Cell
   * @param checked {boolean} the checkbox status
   * @param rowIndex {number} the row Index
   * @param fromMount {boolean} onSelect is called from cell Mount is not expected.
   */

  changeSelected(checked, rowIndex, fromMount) {
    const me = this;
    const content = deepcopy(this.state.data);
    const _data = content.datas || content.data;

    if (me.checkboxColumn.type === 'radioSelector') {
      for (let i = 0; i < _data.length; i++) {
        const item = _data[i];
        if (item.jsxid === rowIndex) {
          item[me.checkboxColumnKey] = checked;
        } else if (item[me.checkboxColumnKey]) {
          item[me.checkboxColumnKey] = false;
        }
      }
    } else {
      for (let i = 0; i < _data.length; i++) {
        const item = _data[i];
        if (item.jsxid === rowIndex) {
          item[me.checkboxColumnKey] = checked;
          break;
        }
      }
    }

    me.setState({
      data: content,
    }, () => {
      if (!fromMount) {
        const data = me.state.data.datas || me.state.data.data;
        const selectedRows = data.filter((item) => item[me.checkboxColumnKey] === true);
        if (me.props.rowSelection && me.props.rowSelection.onSelect) {
          me.props.rowSelection.onSelect(checked, data[rowIndex], selectedRows);
        }
      }
    });
  }

  /**
   * change the checkboxColumnKey of data, passed to the Row
   * @param checked {boolean} tree checkbox status
   * @param dataIndex {string} like `1-2-3` means the position of the Row in data
   */
  changeTreeSelected(checked, dataIndex) {
    const me = this;
    const currentLevel = dataIndex.toString().split('-');
    const levelDepth = currentLevel.length;
    const data = deepcopy(me.state.data);
    let current = data.data;
    // record each tree node for reverse recursion.
    const treeMap = [];
    for (let i = 0; i < levelDepth - 1; i++) {
      treeMap[i] = current;
      current = current[currentLevel[i]].data;
    }
    // check/uncheck current row and all its children
    current = current[currentLevel[levelDepth - 1]];
    current[me.checkboxColumnKey] = checked;
    util.changeValueR(current, me.checkboxColumnKey, checked);

    // reverse recursion, check/uncheck parents by its children.
    for (let i = treeMap.length - 1; i >= 0; i--) {
      treeMap[i][currentLevel[i]][me.checkboxColumnKey] =
        treeMap[i][currentLevel[i]].data.every((item) => item[me.checkboxColumnKey] === true);
    }

    me.setState({
      data,
    }, () => {
      const selectedRows = util.getAllSelectedRows(deepcopy(data), me.checkboxColumnKey);
      if (me.props.rowSelection && me.props.rowSelection.onSelect) {
        me.props.rowSelection.onSelect(checked, current, selectedRows);
      }
    });
  }

  selectAll(checked) {
    const me = this;
    const content = deepcopy(me.state.data);
    const data = content.datas || content.data;
    const rowSelection = me.props.rowSelection;

    const selectedRows = [];
    for (let i = 0; i < data.length; i++) {
      const column = me.checkboxColumn;
      const key = me.checkboxColumnKey;
      const item = data[i];
      if ((!('isDisable' in column) || !column.isDisable(item)) && !column.disable) {
        item[key] = checked;
        selectedRows.push(item);
      }
    }

    if (!!rowSelection && !!rowSelection.onSelectAll) {
      rowSelection.onSelectAll.apply(null, [checked, checked ? selectedRows : []]);
    }
    me.setState({
      data: content,
    });
  }

  onPageChange(current) {
    const me = this;
    me.setState({
      currentPage: current,
    }, () => {
      me.fetchData('pagination')
    });
  }

  handleShowSizeChange(current, pageSize) {
    const me = this;
    me.setState({
      currentPage: current,
      pageSize,
    }, () => {
      me.fetchData('pagination');
    });
  }

  getDomNode() {
    return this.refs.root;
  }

  renderPager() {
    const me = this;
    const { data, currentPage, pageSize } = me.state;
    const {
      showPagerTotal,
      showPager,
      locale,
      pagerSizeOptions,
      isMiniPager,
      showPagerSizeChanger,
    } = me.props;
    if (showPager && data && data.totalCount) {
      return (
        <div className="kuma-uxtable-page">
          <Pagination
            className={classnames({
              mini: isMiniPager,
            })}
            locale={locale}
            showSizeChanger={showPagerSizeChanger}
            showTotal={showPagerTotal}
            total={data.totalCount}
            onShowSizeChange={me.handleShowSizeChange.bind(me)}
            onChange={me.onPageChange.bind(me)}
            current={currentPage}
            pageSize={pageSize}
            sizeOptions={pagerSizeOptions}
          />
        </div>
      );
    }
    return null;
  }

  handleBodyScroll(scrollLeft, scrollTop) {
    const me = this;
    const headerNode = me.hasFixed ? me.refs.headerScroll : me.refs.headerNo;
    const bodyNode = me.refs.bodyFixed;
    if (scrollLeft !== undefined) {
      headerNode.getDomNode().scrollLeft = scrollLeft;
    }
    if (scrollTop !== undefined && this.hasFixed) {
      bodyNode.getDomNode().scrollTop = scrollTop;
    }
  }

  handleOrderColumnCB(type, column) {
    const me = this;
    me.setState({
      activeColumn: column,
      orderType: type,
    }, () => {
      me.fetchData('order');
    });
  }

  handleActionBarSearch(value) {
    const me = this;
    this.setState({
      searchTxt: value,
    }, () => {
      me.fetchData('search');
    });
  }

  getData(validate) {
    const me = this;
    let pass = true;
    if (validate !== false) {
      const fieldKeys = Object.keys(me.fields);
      fieldKeys.forEach((name) => {
        const fieldPass = me.fields[name]();
        // if one field fails to pass, the table fails to pass
        if (pass) {
          pass = fieldPass;
        }
      });
    }
    if (me.props.getSavedData) {
      // 滤除可能为空的元素
      const data = deepcopy(me.data);
      data.data = data.data.filter((item) => item !== undefined);
      return {
        data,
        pass,
      };
    }
    return {
      data: me.state.data,
      pass,
    };
  }

  hasFixColumn(props) {
    const columns = props.jsxcolumns.filter((item) => {
      if (item.fixed) {
        return true;
      }
      return false;
    });
    if (columns.length > 0) {
      return true;
    }
    return false;
  }

  renderHeader(renderHeaderProps) {
    if (!this.props.showHeader) {
      return null;
    }

    if (this.hasFixed) {
      return (
        <div className="kuma-uxtable-header-wrapper">
          <Header {...renderHeaderProps} fixedColumn="fixed" key="grid-header-fixed" />
          <Header {...renderHeaderProps} fixedColumn="scroll" key="grid-header-scroll" ref="headerScroll" />
        </div>
      );
    }
    return (
      <div className="kuma-uxtable-header-wrapper">
        <Header {...renderHeaderProps} fixedColumn="no" ref="headerNo" />
      </div>
    );
  }

  renderTbody(renderBodyProps, bodyHeight) {
    if (this.hasFixed) {
      const fixedBodyProps = assign({}, renderBodyProps, {
        subComp: null,
      });
      return (
        <div
          className="kuma-uxtable-body-wrapper"
          style={{
            height: bodyHeight,
          }}
        >
          <Tbody {...fixedBodyProps} fixedColumn="fixed" key="grid-body-fixed" ref="bodyFixed" />
          <Tbody {...renderBodyProps} fixedColumn="scroll" key="grid-body-scroll" onScroll={this.handleBodyScroll} />
          <Mask visible={this.state.showMask} text={this.props.loadingText} />
        </div>
      );
    }
    return (
      <div
        className="kuma-uxtable-body-wrapper"
        style={{
          height: bodyHeight,
        }}
      >
        <Tbody {...renderBodyProps} fixedColumn="no" onScroll={this.handleBodyScroll} />
        <Mask visible={this.state.showMask} text={this.props.loadingText} />
      </div>
    );
  }

  getIsSelectAll(data) {
    const me = this;
    const column = me.checkboxColumn;
    if (!column || data.length === 0) {
      return false;
    }
    const key = me.checkboxColumnKey;
    let isSelectAll = true;
    for (let i = 0; i < data.length; i++) {
      if ((('isDisable' in column) && column.isDisable(data[i])) || column.disable) {
        isSelectAll = true;
      } else {
        isSelectAll = data[i][key];
        if (!isSelectAll) {
          break;
        }
      }
    }
    return isSelectAll;
  }


  render() {
    const me = this;
    const { props, state } = this;
    let bodyHeight;
    // if table is in sub mode, people always want to align the parent
    // and the sub table, so width should not be cared.
    const { headerHeight } = props;

    const data = state.data ? (state.data.datas || state.data.data) : [];
    const isSelectAll = me.getIsSelectAll(data);

    let style = {
      width: props.passedData ? 'auto' : props.width,
      height: props.height,
    };
    const actionBarHeight = props.actionBar ? props.actionBarHeight : 0;
    const pagerHeight = (props.showPager && this.state.data && this.state.data.totalCount) ? 50 : 0;

    // decide whether the table has column groups
    let hasGroup = false;
    for (let i = 0; i < this.state.columns.length; i++) {
      if ('group' in this.state.columns[i]) {
        hasGroup = true;
        break;
      }
    }
    if (props.height === 'auto') {
      bodyHeight = 'auto';
    } else {
      bodyHeight = props.height === '100%'
        ? props.height
        : (props.height - (headerHeight || (hasGroup ? 80 : 40)) - actionBarHeight - pagerHeight);
    }
    const renderBodyProps = {
      columns: state.columns,
      mask: state.showMask,
      expandedKeys: state.expandedKeys,
      data,
      rowSelection: props.rowSelection,
      addRowClassName: props.addRowClassName,
      subComp: props.subComp,
      renderSubComp: props.renderSubComp,
      rowHeight: props.rowHeight,
      loadingText: props.loadingText,
      checkboxColumnKey: me.checkboxColumnKey,
      height: bodyHeight,
      width: props.width,
      mode: props.mode,
      levels: props.levels,
      root: this,
      renderModel: props.renderModel,
      changeSelected: this.changeSelected.bind(this),
      handleDataChange: this.handleDataChange.bind(this),
      attachCellField: this.attachCellField.bind(this),
      detachCellField: this.detachCellField.bind(this),
      key: 'grid-body',
    };
    const renderHeaderProps = {
      columns: state.columns,
      activeColumn: state.activeColumn,
      orderType: state.orderType,
      showColumnPicker: props.showColumnPicker,
      checkboxColumnKey: me.checkboxColumnKey,
      showHeaderBorder: props.showHeaderBorder,
      headerHeight: props.headerHeight,
      renderModel: props.renderModel,
      width: props.width,
      mode: props.mode,
      isSelectAll,
      selectAll: this.selectAll.bind(this),
      orderColumnCB: this.handleOrderColumnCB.bind(this),
      handleColumnPickerChange: this.handleColumnPickerChange.bind(this),
      key: 'grid-header',
    };

    let actionBar;


    if (props.actionBar || props.showSearch) {
      const renderActionProps = {
        onSearch: this.handleActionBarSearch.bind(this),
        actionBarConfig: this.props.actionBar,
        showSearch: this.props.showSearch,
        searchBarPlaceholder: this.props.searchBarPlaceholder,
        key: 'grid-actionbar',
      };
      actionBar = <ActionBar {...renderActionProps}/>;
    }

    return (
      <div
        className={classnames({
          [props.className]: !!props.className,
          [props.prefixCls]: true,
          'kuma-subgrid-mode': !!props.passedData,
          [`${props.prefixCls}-tree-mode`]: props.renderModel === 'tree',
        })}
        style={style}
        ref="root"
      >
        {actionBar}
        <div
          className="kuma-uxtable-content"
          style={{
            width: props.passedData ? 'auto' : props.width,
          }}
        >
          {this.renderHeader(renderHeaderProps)}
          {this.renderTbody(renderBodyProps, bodyHeight)}
        </div>
        {this.renderPager()}
      </div>
    );
  }

  // Util Method

  /**
   * add some specific value for each row data which will be used in manipulating data & rendering.
   * used in record API.
   */

  addJSXIdsForRecord(obj) {
    const me = this;
    let objAux = deepcopy(obj);
    if (objAux instanceof Array) {
      objAux = objAux.map((item) => {
        const newItem = deepcopy(item);
        if (newItem.jsxid === undefined || newItem.jsxid == null) {
          newItem.jsxid = me.uid++;
        }
        if (!newItem.__mode__) {
          newItem.__mode__ = Const.MODE.EDIT;
        }
        return newItem;
      });
    } else {
      objAux.jsxid = me.uid++;
    }
    return objAux;
  }

  /**
   * add some specific value for each row data which will be used in manipulating data & rendering.
   * used in method fetchData
   */

  addValuesInData(objAux) {
    if (!objAux || (!objAux.datas && !objAux.data)) return null;
    const me = this;
    const data = objAux.datas || objAux.data;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      node.jsxid = me.uid++;
      node.__mode__ = node.__mode__ || Const.MODE.VIEW;
      me.addValuesInData(node);
    }
    return objAux;
  }

  /**
   * merge data
   */

  mergeData(data, obj) {
    const newData = deepcopy(data);
    // code compatible
    if (newData.datas) {
      newData.datas = newData.datas.concat(obj);
    } else if (newData.data) {
      newData.data = newData.data.concat(obj);
    }
    newData.totalCount++;
    return newData;
  }


  /**
   * insert some data into this.state.data
   * @param objAux {Array or Object} datum or data need to be inserted
   */

  insertRecords(obj) {
    if (typeof obj !== 'object') return;
    const me = this;
    let objAux = deepcopy(obj);
    if (!(objAux instanceof Array)) {
      objAux = [objAux];
    }
    objAux = me.addJSXIdsForRecord(objAux);
    me.setState({
      data: me.mergeData(me.state.data, objAux),
    });
  }

  /**
   * update this.state.data using objAux by jsxid
   * @param {object/array} obj
   */
  updateRecord(obj, cb) {
    const stateData = deepcopy(this.state.data);

    if (!stateData) {
      return;
    }

    let objAux = deepcopy(obj);
    if (!(objAux instanceof Array)) {
      objAux = [objAux];
    }

    if (stateData.data || stateData.datas) {
      const data = stateData.data || stateData.datas;
      objAux.forEach((item) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].jsxid === item.jsxid) {
            data[i] = item;
            break;
          }
        }
      });
      if (stateData.data) {
        stateData.data = data;
      } else if (stateData.datas) {
        stateData.datas = data;
      }
    }
    this.setState({
      data: stateData,
    }, () => {
      if (cb) {
        cb();
      }
    });
  }

  /**
   * update this.state.data & this.data using objAux by jsxid
   * @param {objtct/array} objAux
   */

  syncRecord(objAux) {
    const me = this;
    const data = me.data.data || me.data.datas;

    me.updateRecord(objAux, () => {
      const stateData = deepcopy(me.state.data.data || me.state.data.datas);
      objAux.forEach((item) => {
        for (let i = 0; i < stateData.length; i++) {
          const element = stateData[i];
          if (element.jsxid === item.jsxid) {
            data[i] = element;
            break;
          }
        }
      });
    });
  }

  /**
   * remove some items from this.state.data & this.data
   * @param {object/array} obj items to be removed
   */
  removeRecords(obj) {
    const me = this;
    const content = deepcopy(me.state.data);
    const data = content.data || content.datas;
    let objAux = deepcopy(obj);
    if (Object.prototype.toString.call(objAux) !== '[object Array]') {
      objAux = [objAux];
    }
    objAux.forEach((item) => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.jsxid === item.jsxid) {
          data.splice(i, 1);
          break;
        }
      }
    });
    me.data = content;
    this.setState({
      data: content,
    });
  }

  // CURD for Table

  addEmptyRow() {
    this.insertRecords({});
  }

  addRow(rowData) {
    this.insertRecords(rowData);
  }

  resetRow(rowData) {
    const me = this;
    let updateData = {};
    const data = me.data.datas || me.data.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].jsxid === rowData.jsxid) {
        updateData = deepcopy(data[i]);
        break;
      }
    }
    updateData.__mode__ = Const.MODE.EDIT;
    this.updateRecord(updateData);
  }

  delRow(rowData) {
    this.removeRecords(rowData);
  }

  editRow(rowData) {
    const newRowData = deepcopy(rowData);
    newRowData.__mode__ = Const.MODE.EDIT;
    this.updateRecord(newRowData);
  }

  viewRow(rowData) {
    const newRowData = deepcopy(rowData);
    newRowData.__mode__ = Const.MODE.VIEW;
    this.updateRecord(newRowData);
  }

  saveRow(rowData) {
    const newRowData = deepcopy(rowData);
    newRowData.__mode__ = Const.MODE.VIEW;
    newRowData.__edited__ = true;
    this.syncRecord(newRowData);
  }

  saveAllRow() {
    const me = this;
    const data = deepcopy(me.state.data.data || me.state.data.datas);
    data.forEach((item) => {
      me.saveRow(item);
    });
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      item.__mode__ = Const.MODE.VIEW;
      item.__edited__ = true;
    }
    this.syncRecord(data);
  }

  editAllRow() {
    const me = this;
    const data = deepcopy(me.data.data || me.data.datas);
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      item.__mode__ = Const.MODE.EDIT;
    }
    this.updateRecord(data);
  }

  toggleSubComp(rowData) {
    const content = deepcopy(this.state.data);
    let data = content.data || content.datas;

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.jsxid === rowData.jsxid) {
          item.showSubComp = !item.showSubComp;
          break;
        }
      }
      this.setState({
        data: content,
      });
    }
  }

  toggleTreeExpanded(rowData) {
    const expandedKeys = deepcopy(this.state.expandedKeys);
    util.toggleItemInArr(rowData.jsxid, expandedKeys);
    this.setState({
      expandedKeys,
    });
  }

}

Table.defaultProps = {
  prefixCls: 'kuma-uxtable',
  locale: 'zh-cn',
  showHeader: true,
  width: 'auto',
  height: 'auto',
  mode: Const.MODE.EDIT,
  renderModel: '',
  levels: 1,
  actionBarHeight: 40,
  fetchDataOnMount: true,
  doubleClickToEdit: true,
  rowSelector: 'checkboxSelector',
  showPager: true,
  isMiniPager: true,
  showPagerSizeChanger: true,
  showColumnPicker: true,
  showHeaderBorder: false,
  showPagerTotal: false,
  showMask: false,
  showSearch: false,
  getSavedData: true,
  pageSize: 10,
  pagerSizeOptions: [10, 20, 30, 40],
  rowHeight: 76,
  fetchParams: {},
  currentPage: 1,
  queryKeys: [],
  emptyText: '暂无数据',
  searchBarPlaceholder: '搜索表格内容',
  loadingText: 'loading',
  fitResponse: (content) => content,
  processData: (data) => data,
  beforeFetch: (obj) => obj,
  onFetchError: (err) => {
    console.error(err.stack);
  },
  addRowClassName: () => {},
  onChange: () => {},
};

// http://facebook.github.io/react/docs/reusable-components.html
Table.propTypes = {
  /**
   * @title 国际化
   */
  locale: React.PropTypes.string,
  /**
   * @title 列配置
   */
  jsxcolumns: React.PropTypes.arrayOf(React.PropTypes.object),
  /**
   * @title 表格宽度
   */
  width: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  /**
   * @title 表格高度
   */
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  /**
   * @title 表头高度
   */
  headerHeight: React.PropTypes.number,
  /**
   * @title 每页显示条数
   */
  pageSize: React.PropTypes.number,
  /**
   * @title 哪些参数传递给 subComp (即将废除)
   */
  queryKeys: React.PropTypes.array,
  /**
   * @title 是否在初始化时请求数据
   */
  fetchDataOnMount: React.PropTypes.bool,
  /**
   * @title 是否双击进入编辑模式
   */
  doubleClickToEdit: React.PropTypes.bool,
  /**
   * @title 是否显示列选择器
   */
  showColumnPicker: React.PropTypes.bool,
  /**
   * @title 是否显示分页
   */
  showPager: React.PropTypes.bool,
  /**
   * @title 分页中是否显示总条数
   */
  showPagerTotal: React.PropTypes.bool,
  /**
   * @title  显示的可选 pageSize
   */
  pagerSizeOptions: React.PropTypes.array,
  /**
   * @title 是否显示表格头
   */
  showHeader: React.PropTypes.bool,
  /**
   * @title 是否显示遮罩
   */
  showMask: React.PropTypes.bool,
  /**
   * @title 是否显示搜索框
   */
  showSearch: React.PropTypes.bool,
  /**
   * @title 搜索框占位符
   */
  searchBarPlaceholder: React.PropTypes.string,
  /**
   * @title 加载中文案
   */
  loadingText: React.PropTypes.string,
  /**
   * @title 子组件(即将废除)
   */
  subComp: React.PropTypes.element,
  /**
   * @title 无数据时的文案
   */
  emptyText: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]),
  /**
   * @title 数据源（手动）
   */
  jsxdata: React.PropTypes.object,
  /**
   * @title 数据源（url）
   */
  fetchUrl: React.PropTypes.string,
  /**
   * @title 请求携带的参数
   */
  fetchParams: React.PropTypes.object,
  /**
   * @title 当前页数
   */
  currentPage: React.PropTypes.number,
  /**
   * @title 列选择器的类型
   */
  rowSelector: React.PropTypes.string,
  /**
   * @title 操作栏配置
   */
  actionBar: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
  fitResponse: React.PropTypes.func,
  /**
   * @title 处理数据的回调
   */
  processData: React.PropTypes.func,
  /**
   * @title 发起请求前的回调
   */
  beforeFetch: React.PropTypes.func,
  /**
   * @title 请求出错时的回调
   */
  onFetchError: React.PropTypes.func,
  /**
   * @title 渲染每一行前用于添加特殊类名的回调
   */
  addRowClassName: React.PropTypes.func,
  /**
   */
  passedData: React.PropTypes.object,
  /**
   * @title getData 获取的是否是保存之后的数据
   */
  getSavedData: React.PropTypes.bool,
  /**
   * @title 行内编辑时触发的回调
   */
  onChange: React.PropTypes.func,
  /**
   * @title 是否是树模式
   */
  renderModel: React.PropTypes.string,
  /**
   * @title 树的层级
   */
  levels: React.PropTypes.number,
};

Table.displayName = 'Table';
Table.CellField = CellField;
Table.Constants = Const;

module.exports = Table;
