/**
 * Table Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

import CellField from 'uxcore-cell-field';
import Pagination from 'uxcore-pagination';
import Const from 'uxcore-const';
import assign from 'object-assign';
import deepcopy from 'lodash/cloneDeep';
import upperFirst from 'lodash/upperFirst';
import deepEqual from 'lodash/isEqual';
import classnames from 'classnames';
import NattyFetch from 'natty-fetch/dist/natty-fetch.pc';
import Promise from 'lie';
import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'uxcore-animate';
import { addClass, removeClass } from 'rc-util/lib/Dom/class';
import { get } from 'rc-util/lib/Dom/css';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

import Mask from './Mask';
import util from './util';
import Header from './Header';
import Tbody from './Tbody';
import ActionBar from './ActionBar';
import methods from './methods';
import innerMethods from './innerMethods';

const { createCellField } = CellField;
const getStyle = get;

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.bindInnerMethods();
    this.uid = 0;
    this.fields = {};
    this.copyData = deepcopy(this.props.jsxdata);
    this.hasFixed = util.hasFixColumn(props);
    this.data = this.addValuesInData(deepcopy(this.props.jsxdata));
    this.state = {
      data: this.data, // checkbox 内部交互
      columns: this.processColumn(), // column 内部交互
      showMask: props.showMask, // fetchData 时的内部状态改变
      pageSize: props.pageSize, // pagination 相关
      currentPage: props.currentPage, // pagination 相关
      activeColumn: null,
      searchTxt: '',
      expandedKeys: [],
    };
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
    this.handleHeaderScroll = this.handleHeaderScroll.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.attachCellField = this.attachCellField.bind(this);
    this.detachCellField = this.detachCellField.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.handleOrderColumnCB = this.handleOrderColumnCB.bind(this);
    this.handleColumnPickerChange = this.handleColumnPickerChange.bind(this);
    this.handleActionBarSearch = this.handleActionBarSearch.bind(this);
  }

  componentDidMount() {
    const me = this;
    if (!!me.state.data && !!me.state.data.datas) {
      console.warn('Table: "content.data" rather than "content.datas" is recommended, '
        + 'the support for "content.datas" will be end from ver. 1.5.0');
    }
    if (me.props.subComp) {
      console.warn('Table: subComp is deprecated, use renderSubComp instead.');
    }
    if (me.props.renderSubComp && this.hasFixed) {
      console.warn('Table: subComp cannot be rendered if fixed column exists, remove fixed column or props.renderSubComp');
    }
    if (this.props.fetchDataOnMount) {
      this.fetchData();
    }
    this.bindMethods();
    this.resizeListener = this.listenWindowResize();
    if (this.root) {
      this.rootWidth = this.root.clientWidth;
    }
    if (this.hasPercentWidth) {
      setTimeout(() => {
        this.setState({
          columns: this.processColumn(),
        }, () => {
          this.checkRightFixed(true);
        });
      }, 200);
    }
  }

  componentWillReceiveProps(nextProps) {
    const me = this;
    const newData = {};
    if (nextProps.jsxdata
      && !deepEqual(nextProps.jsxdata, this.copyData)) {
      // Data has changed, so uid which is used to mark the data should be reset.
      me.uid = 0;
      me.fetchData('dataChange', nextProps);
      // TODO: need reduce times
      this.forceToCheckRight = true;
    }
    if (nextProps.pageSize !== me.props.pageSize) {
      newData.pageSize = nextProps.pageSize;
    }
    if (nextProps.currentPage !== me.props.currentPage) {
      newData.currentPage = nextProps.currentPage;
    }
    if (!!nextProps.jsxcolumns
      && !deepEqual(nextProps.jsxcolumns, me.props.jsxcolumns)) {
      newData.columns = me.processColumn(nextProps);
      this.hasFixed = util.hasFixColumn(nextProps);
    }
    if (nextProps.showMask !== me.props.showMask) {
      newData.showMask = nextProps.showMask;
    }
    if (nextProps.fetchUrl !== me.props.fetchUrl
      || !deepEqual(nextProps.fetchParams, me.props.fetchParams)) {
      me.fetchData('propsChange', nextProps);
    }
    me.setState(newData);
  }

  componentDidUpdate() {
    // TODO: performance need to be cared
    this.checkBodyVScroll();
    this.checkBodyHScroll();
    this.checkRightFixed(this.forceToCheckRight);
    this.forceToCheckRight = false;
  }

  componentWillUnmount() {
    if (this.resizeListener) {
      this.resizeListener.remove();
    }
  }

  /**
   * register CellField to Table for the global validation
   * @param field {element} the cell field to be registered
   */

  attachCellField(validate, name) {
    const me = this;
    if (!name) {
      console.error('Table: dataKey can not be undefined, check the column config');
    } else {
      me.fields[name] = validate;
    }
  }

  bindInnerMethods() {
    const me = this;
    Object.keys(innerMethods).forEach((key) => {
      me[key] = innerMethods[key].bind(me);
    });
  }

  bindMethods() {
    const me = this;
    Object.keys(methods).forEach((key) => {
      me[key] = methods[key].bind(me);
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
        const selectedRows = data.filter(item => item[me.checkboxColumnKey] === true);
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
        treeMap[i][currentLevel[i]].data.every(item => item[me.checkboxColumnKey] === true);
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

  /**
   * check if right fixed table is needed.
   * if table is wide enough, hide the right fixed.
   * @param force force to check
   */
  checkRightFixed(force) {
    if (this.rightFixedTable) {
      const headerScroll = this.headerScroll;
      const headerScrollDom = headerScroll.getDom();
      if (force !== true && this.cachedHeaderScrollWidth === headerScrollDom.clientWidth) {
        return;
      }
      const headerScrollInner = headerScroll.getScroller();
      this.cachedHeaderScrollWidth = headerScrollDom.clientWidth;
      if (headerScrollInner.clientWidth === headerScrollDom.clientWidth
        && getStyle(this.rightFixedTable, 'display') === 'block') {
        this.rightFixedTable.style.display = 'none';
      } else if (headerScrollInner.clientWidth > headerScrollDom.clientWidth
        && getStyle(this.rightFixedTable, 'display') === 'none') {
        this.rightFixedTable.style.display = 'block';
      }
    }
  }

  checkBodyVScroll() {
    if (this.bodyScroll && this.headerScroll) {
      const { prefixCls } = this.props;
      const node = this.bodyScroll.getDom();
      // body does not exist if no data
      if (node.children[0]) {
        const wrapperHeight = node.clientHeight;
        const bodyHeight = node.children[0].clientHeight;
        const headerDom = this.headerScroll.getDom();
        const noVScroll = bodyHeight <= wrapperHeight;
        if (this.noVScroll === undefined || this.noVScroll !== noVScroll) {
          if (noVScroll) {
            addClass(node, `${prefixCls}-no-v-scroll`);
            addClass(headerDom, `${prefixCls}-no-v-scroll`);
          } else {
            removeClass(node, `${prefixCls}-no-v-scroll`);
            removeClass(headerDom, `${prefixCls}-no-v-scroll`);
          }
          this.noVScroll = noVScroll;
        }
      }
    }
  }

  checkBodyHScroll(scrollLeft) {
    if (!this.hasFixed) {
      return false;
    }
    const node = this.bodyScroll.getDom();
    const wrapperScrollLeft = scrollLeft || node.scrollLeft;
    if (this.hasFixed.hasLeft && this.fixedTable) {
      if (wrapperScrollLeft > 0) {
        addClass(this.fixedTable, 'has-scroll');
      } else {
        removeClass(this.fixedTable, 'has-scroll');
      }
    }
    if (this.hasFixed.hasRight) {
      const wrapperWidth = node.clientWidth;
      if (node.children[0]) {
        const bodyWidth = node.children[0].clientWidth;
        if (this.rightFixedTable) {
          if (wrapperScrollLeft + wrapperWidth + 3 < bodyWidth) {
            addClass(this.rightFixedTable, 'end-of-scroll');
          } else {
            removeClass(this.rightFixedTable, 'end-of-scroll');
          }
        }
      }
    }
    return false;
  }


  /**
   * cancel the CellField when it is unmounted.
   * @param field {element} the cell field to be canceled.
   */

  detachCellField(name) {
    delete this.fields[name];
  }


  /**
   * fetch Data via Ajax
   * @param from {string} tell fetchData where it is invoked, the param will be
   * passed to props.beforeFetch in order to help the user.
   */

  fetchData(from, nextProps, cb) {
    const me = this;
    const props = nextProps || this.props;
    // reset uid cause table data has changed
    me.uid = 0;

    // fetchUrl has the top priority.
    if (props.fetchUrl) {
      me.fetchRemoteData(from, props, cb);
    } else if (props.passedData) {
      me.fetchPassedData(props, cb);
    } else if (props.jsxdata) {
      me.fetchLocalData(from, props, cb);
    } else {
      // default will create one row
      const data = {
        data: [{
          jsxid: me.uid,
          __mode__: Const.MODE.EDIT,
        }],
        currentPage: 1,
        totalCount: 0,
      };
      me.uid += 1;
      me.data = data;
      me.setState({
        data,
      });
    }
  }

  fetchRemoteData(from, props, cb = () => {}) {
    const me = this;
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
      method: props.fetchMethod,
      url: props.fetchUrl,
      data: me.getQueryObj(from, props),
      fit: props.fitResponse,
      withCredentials: props.fetchWithCredentials,
      jsonp: isJsonp,
      Promise,
    });

    me.request().then((content) => {
      const processedData = me.addValuesInData(props.processData(deepcopy(content))) || {};
      const updateObj = {
        data: processedData,
        showMask: false,
      };
      const resetExpandedKeys = props.shouldResetExpandedKeys(from) !== false;
      if (resetExpandedKeys) {
        updateObj.expandedKeys = util.getDefaultExpandedKeys(processedData.data, props.levels);
      }
      if (processedData.currentPage !== undefined) {
        updateObj.currentPage = processedData.currentPage;
      }
      me.data = deepcopy(processedData);
      me.setState(updateObj, () => { cb(); });
    }).catch((err) => {
      props.onFetchError(err);
      me.setState({
        data: {
          data: [],
        },
        showMask: false,
      });
    });
  }

  fetchPassedData(props, cb = () => {}) {
    console.warn('props subComp is deprecated, use renderSubComp instead.');
    const me = this;
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
      me.data = deepcopy(processedData);
      me.setState({
        data: processedData,
      }, () => {
        cb();
      });
    }
  }

  fetchLocalData(from, props, cb = () => {}) {
    const me = this;
    if (['pagination', 'order', 'search'].indexOf(from) !== -1) {
      if (from === 'pagination' && props.onPagerChange) {
        props.onPagerChange(me.state.currentPage, me.state.pageSize);
      }

      if (from === 'order' && props.onOrder) {
        props.onOrder(me.state.activeColumn, me.state.orderType);
      }

      if (from === 'search' && props.onSearch) {
        props.onSearch(me.state.searchTxt);
      }
    } else {
      this.copyData = deepcopy(props.jsxdata);
      const data = this.addValuesInData(deepcopy(props.jsxdata));
      const currentPage = (data && data.currentPage) || this.state.currentPage;
      this.data = deepcopy(data);
      const updateObj = {
        data,
        currentPage,
      };
      const resetExpandedKeys = props.shouldResetExpandedKeys(from) !== false;
      if (resetExpandedKeys) {
        updateObj.expandedKeys = util.getDefaultExpandedKeys(data.data, props.levels);
      }
      this.setState(updateObj, () => {
        cb();
      });
    }
  }

  /**
   * get Query Object by combining data from searchBar, column order, pagination
   * and fetchParams.
   * @param from {string} used in props.beforeFetch
   */

  getQueryObj(from, props) {
    const me = this;
    let queryObj = {};
    if (props.passedData) {
      const queryKeys = props.queryKeys;
      if (!queryKeys) {
        queryObj = props.passedData;
      } else {
        queryKeys.forEach((key) => {
          if (props.passedData[key] !== undefined) {
            queryObj[key] = props.passedData[key];
          }
        });
      }
    }

    // pagination
    queryObj = assign({}, queryObj, {
      pageSize: me.state.pageSize,
      currentPage: me.state.currentPage,
    });

    // column order
    const activeColumn = me.state.activeColumn;
    const orderType = me.state.orderType;
    if (activeColumn) {
      queryObj = assign({}, queryObj, {
        orderColumn: activeColumn.dataKey,
      });
      if (orderType && orderType !== 'none') {
        queryObj.orderType = orderType;
      }
    }

    // search query
    const searchTxt = me.state.searchTxt;
    if (searchTxt) {
      queryObj = assign({}, queryObj, {
        searchTxt,
      });
    }

    // fetchParams has the top priority
    if (props.fetchParams) {
      queryObj = assign({}, queryObj, props.fetchParams);
    }

    return props.beforeFetch(deepcopy(queryObj), from);
  }

  getCheckStatus(data) {
    const me = this;
    const { rowSelection } = me.props;
    const column = me.checkboxColumn;
    if (!column || data.length === 0) {
      return false;
    }
    const checkboxColumnKey = me.checkboxColumnKey;
    let isAllDisabled = true;
    let isHalfChecked = false;
    let checkedColumn = 0;
    let enabledColumn = 0;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!column.disable && !(column.isDisable && column.isDisable(item))
        && !(typeof rowSelection === 'object' && rowSelection.isDisabled && rowSelection.isDisabled(item))) {
        isAllDisabled = false;
        enabledColumn += 1;
        if (item[checkboxColumnKey]) {
          isHalfChecked = true;
          checkedColumn += 1;
        }
      }
    }
    const isAllChecked = enabledColumn ? checkedColumn === enabledColumn : false;
    return { isAllChecked, isAllDisabled, isHalfChecked: isAllChecked ? false : isHalfChecked };
  }

  getDom() {
    return this.root;
  }

  getMainBody() {
    return this.bodyScroll;
  }

  getPager() {
    return this.pager;
  }

  handleRowHover(index, isEnter) {
    if (!isEnter) {
      this.rowHoverTimer = setTimeout(() => {
        this.setState({
          currentHoverRow: -1,
        });
      }, 100);
    } else {
      if (this.rowHoverTimer) {
        clearTimeout(this.rowHoverTimer);
        this.rowHoverTimer = null;
      }
      this.setState({
        currentHoverRow: index,
      });
    }
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

  handleColumnPickerChange(checkedKeys, groupName) {
    const columns = deepcopy(this.state.columns);
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    notRenderColumns.push(this.checkboxColumnKey);
    const commonGroupName = util.getConsts().commonGroup;
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
      // current column is a group and groupName is right
      if (isGroup && item.group === groupName) {
        for (let j = 0; j < item.columns.length; j++) {
          const ele = item.columns[j];
          if (checkedKeys.indexOf(ele.dataKey) !== -1) {
            ele.hidden = false;
          } else {
            ele.hidden = true;
          }
        }
        break;
      } else if (groupName === commonGroupName && item.group === undefined) {
        // current column is common group
        if (checkedKeys.indexOf(item.dataKey) !== -1
          || notRenderColumns.indexOf(item.dataKey) !== -1) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      }
    }

    const selectedKeys = util.getSelectedKeys(columns);

    if (selectedKeys.length === 0) {
      return;
    }

    this.setState({
      columns,
    }, () => {
      if (typeof this.props.onColumnPick === 'function') {
        this.props.onColumnPick(deepcopy(columns));
      }
      this.checkRightFixed(true);
    });
  }

  handleBodyScroll(scrollLeft, scrollTop, column) {
    this.bodyIsScorlling = true;
    if (this.headerIsScrolling) {
      this.headerIsScrolling = false;
      return;
    }
    const me = this;
    const headerNode = me.headerScroll;
    if (scrollLeft !== undefined && column === 'scroll') {
      headerNode.getDom().scrollLeft = scrollLeft;
    }
    if (scrollTop !== undefined && this.hasFixed) {
      const columnType = ['fixed', 'rightFixed', 'scroll'];
      const columnToScroll = columnType.filter(item => item !== column);
      columnToScroll.forEach((item) => {
        const instance = me[`body${upperFirst(item)}`];
        if (instance) {
          instance.getDom().scrollTop = scrollTop;
        }
      });
    }
    me.checkBodyHScroll(scrollLeft);
  }

  handleHeaderScroll(scrollLeft) {
    this.headerIsScrolling = true;
    if (this.bodyIsScorlling) {
      this.bodyIsScorlling = false;
      return;
    }
    const me = this;
    const bodyNode = me.bodyScroll;
    if (scrollLeft !== undefined) {
      bodyNode.getDom().scrollLeft = scrollLeft;
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


  /**
   * For inline edit
   * receive changes from cell field and change state.data
   * inform users of the change with dataKey & pass
   */

  handleDataChange(obj) {
    const me = this;
    const { jsxid, column, value, text, pass } = obj;
    const dataKey = column.dataKey;
    const editKey = column.editKey || dataKey;
    const data = deepcopy(me.state.data);
    let changedData = {};
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].jsxid === jsxid) {
        data.data[i][dataKey] = text;
        data.data[i][editKey] = value;
        changedData = data.data[i];
      }
    }

    me.setState({
      data,
    }, () => {
      me.props.onChange({
        data: me.state.data,
        editKey,
        dataKey,
        changedData,
        pass,
      });
    });
  }

  listenWindowResize() {
    return addEventListener(window, 'resize', () => {
      this.checkRightFixed();
      this.resizeColumns();
      clearTimeout(this.adjustFixedTimer);
      this.adjustFixedTimer = setTimeout(() => {
        if (this.bodyFixed) {
          this.bodyFixed.adjustMultilineFixedRowHeight();
        }
        if (this.bodyRightFixed) {
          this.bodyRightFixed.adjustMultilineFixedRowHeight();
        }
      }, 200);
    });
  }

  onPageChange(current) {
    const me = this;
    me.setState({
      currentPage: current,
    }, () => {
      me.fetchData('pagination');
    });
  }


  processColumn(props) {
    const actualProps = props || this.props;

    const me = this;
    let columns = deepcopy(actualProps.jsxcolumns);
    let hasCheckboxColumn = false;
    this.hasPercentWidth = false;
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      // only one rowSelector can be rendered in Table.
      if (item.type === 'checkbox'
        || item.type === 'radioSelector'
        || item.type === 'checkboxSelector') {
        if (item.type === 'checkbox') {
          console.warn("rowSelector using 'type: checkbox' is deprecated,"
            + " use 'type: checkboxSelector' instead.");
        }
        hasCheckboxColumn = true;
        me.checkboxColumn = item;
        me.checkboxColumnKey = item.dataKey;
        item.width = item.width
          || (/kuma-uxtable-border-line/.test(actualProps.className) ? '40px' : '32px');
        item.align = item.align || 'left';
      }
      if (/\d+%/.test(`${item.width}`)) {
        this.hasPercentWidth = true;
        if (this.root) {
          const scrollBarWidth = util.measureScrollbar();
          const tableWidth = this.root.clientWidth - scrollBarWidth;
          item.width = (parseFloat(item.width) * tableWidth) / 100;
        }
      }
    }
    // filter the column which has a dataKey 'jsxchecked' & 'jsxtreeIcon'
    // filter the column whose dataKey is rowGroupKey

    columns = columns.filter(item =>
      item.dataKey === undefined ||
      (item.dataKey !== 'jsxchecked' && item.dataKey !== 'jsxtreeIcon' && item.dataKey !== actualProps.rowGroupKey),
    );

    if (!!actualProps.rowSelection && !hasCheckboxColumn) {
      me.checkboxColumn = {
        dataKey: 'jsxchecked',
        width: (/kuma-uxtable-border-line/.test(actualProps.className) ? '40px' : '32px'),
        type: actualProps.rowSelector,
        align: 'right',
      };
      me.checkboxColumnKey = 'jsxchecked';
      columns = [me.checkboxColumn].concat(columns);
    } else if (actualProps.parentHasCheckbox) {
      // no rowSelection but has parentHasCheckbox, render placeholder
      columns = [{
        dataKey: 'jsxwhite',
        width: (/kuma-uxtable-border-line/.test(actualProps.className) ? '40px' : '32px'),
        type: 'empty',
      }].concat(columns);
    }
    if ((actualProps.subComp || actualProps.renderSubComp)
      && actualProps.renderModel !== 'tree' && !this.hasFixed) {
      columns = [{
        dataKey: 'jsxtreeIcon',
        width: '36px',
        type: 'treeIcon',
      }].concat(columns);
    } else if (actualProps.passedData) {
      // no subComp but has passedData, means sub mode, parent should has tree icon,
      // render tree icon placeholder
      columns = [{
        dataKey: 'jsxwhite',
        width: '34px',
        type: 'empty',
      }].concat(columns);
    }
    return columns;
  }

  resizeColumns() {
    if (this.hasPercentWidth && this.root && this.root.clientWidth !== this.rootWidth) {
      this.rootWidth = this.root.clientWidth;
      this.setState({
        columns: this.processColumn(),
      });
    }
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
      if ((!('isDisable' in column) || !column.isDisable(item)) && !column.disable
      && !(typeof rowSelection === 'object' && rowSelection.isDisabled && rowSelection.isDisabled(item))) {
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


  renderTbody(renderBodyProps, bodyHeight, fixedColumn) {
    const isFixedTable = ['fixed', 'rightFixed'].indexOf(fixedColumn) !== -1;
    const scrollBarWidth = util.measureScrollbar();
    return (
      <div
        className={classnames('kuma-uxtable-body-wrapper', {
          'kuma-uxtable-fixed-body-wrapper': isFixedTable,
        })}
        style={{
          height: (!isNaN(bodyHeight) && isFixedTable) ? (bodyHeight - scrollBarWidth) : bodyHeight,
        }}
      >
        <Tbody
          {...renderBodyProps}
          fixedColumn={fixedColumn}
          onScroll={this.handleBodyScroll}
          ref={util.saveRef(`body${upperFirst(fixedColumn)}`, this)}
        />
        {!isFixedTable ? <Animate showProp="visible" transitionName="tableMaskFade">
          <Mask visible={this.state.showMask} text={this.props.loadingText} />
        </Animate> : null}
      </div>
    );
  }

  renderHeader(renderHeaderProps, fixedColumn) {
    if (!this.props.showHeader) {
      return null;
    }
    return (
      <div className="kuma-uxtable-header-wrapper">
        <Header
          {...renderHeaderProps}
          fixedColumn={fixedColumn}
          ref={util.saveRef(`header${upperFirst(fixedColumn)}`, this)}
          onScroll={this.handleHeaderScroll}
        />
      </div>
    );
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
      showPagerQuickJumper,
      showUnknownTotalPager,
    } = me.props;

    if (showPager && data) {
      const pagersProps = {
        className: classnames({
          mini: isMiniPager,
        }),
        ref: util.saveRef('pager', me),
        locale,
        showSizeChanger: showPagerSizeChanger,
        showQuickJumper: showPagerQuickJumper,
        showTotal: showPagerTotal,
        total: data.totalCount,
        onShowSizeChange: me.handleShowSizeChange.bind(me),
        onChange: me.onPageChange.bind(me),
        current: currentPage,
        pageSize,
        sizeOptions: pagerSizeOptions,
      };
      const pager = (
        <div className="kuma-uxtable-page">
          <Pagination {...pagersProps} />
        </div>
      );
      if (data.totalCount) {
        if (parseInt(data.totalCount, 10) <= parseInt(pageSize, 10) && !showPagerSizeChanger) {
          return null;
        }
        return pager;
      } else if (showUnknownTotalPager) {
        return pager;
      }
    }
    return null;
  }

  renderMainTable(renderHeaderProps, renderBodyProps, bodyHeight) {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-main-table`} ref={util.saveRef('mainTable', this)}>
        {this.renderHeader(renderHeaderProps, 'scroll')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'scroll')}
      </div>
    );
  }

  renderLeftFixedTable(renderHeaderProps, renderBodyProps, bodyHeight) {
    if (!this.hasFixed || !this.hasFixed.hasLeft
      || !renderBodyProps.data || !renderBodyProps.data.length) {
      return null;
    }
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-left-fixed-table`} ref={util.saveRef('fixedTable', this)}>
        {this.renderHeader(renderHeaderProps, 'fixed')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'fixed')}
      </div>
    );
  }

  renderRightFixedTable(renderHeaderProps, renderBodyProps, bodyHeight) {
    if (!this.hasFixed || !this.hasFixed.hasRight
      || !renderBodyProps.data || !renderBodyProps.data.length) {
      return null;
    }
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-right-fixed-table`} ref={util.saveRef('rightFixedTable', this)}>
        {this.renderHeader(renderHeaderProps, 'rightFixed')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'rightFixed')}
      </div>
    );
  }

  render() {
    const me = this;
    const { props, state } = this;
    let bodyHeight;
    // if table is in sub mode, people always want to align the parent
    // and the sub table, so width should not be cared.
    const { headerHeight } = props;

    const data = state.data ? (state.data.datas || state.data.data) : [];
    const checkStatus = me.getCheckStatus(data);

    const style = {
      width: props.passedData ? 'auto' : props.width,
      height: props.height,
    };
    const actionBarHeight = (props.actionBar || props.showSearch) ? props.actionBarHeight : 0;
    const pagerHeight = (props.showPager && this.state.data && this.state.data.totalCount) ? 67 : 0;

    // decide whether the table has column groups
    let hasGroup = false;
    for (let i = 0; i < this.state.columns.length; i++) {
      if ('group' in this.state.columns[i]) {
        hasGroup = true;
        break;
      }
    }
    if (props.height === 'auto' || props.height === '100%') {
      bodyHeight = props.height;
    } else {
      bodyHeight = parseInt(props.height, 10) - (headerHeight || (hasGroup ? 100 : 50))
          - actionBarHeight - pagerHeight;
    }
    const renderBodyProps = {
      columns: state.columns,
      mask: state.showMask,
      expandedKeys: state.expandedKeys,
      currentHoverRow: state.currentHoverRow,
      rowGroupActiveKey: state.rowGroupActiveKey,
      onCollapseChange: (activeKey) => { this.setState({ rowGroupActiveKey: activeKey }); },
      data,
      bodyHeight,
      rowSelection: props.rowSelection,
      addRowClassName: props.addRowClassName,
      locale: props.locale,
      emptyText: props.emptyText,
      renderSubComp: this.hasFixed ? null : props.renderSubComp,
      rowHeight: props.rowHeight,
      loadingText: props.loadingText,
      checkboxColumnKey: me.checkboxColumnKey,
      height: bodyHeight,
      width: props.width,
      mode: props.mode,
      levels: props.levels,
      renderModel: props.renderModel,
      rowGroupKey: props.rowGroupKey,
      root: this,
      changeSelected: this.changeSelected,
      handleDataChange: this.handleDataChange,
      attachCellField: this.attachCellField,
      detachCellField: this.detachCellField,
      key: 'grid-body',
    };
    const renderHeaderProps = {
      columns: state.columns,
      activeColumn: state.activeColumn,
      orderType: state.orderType,
      checkboxColumnKey: me.checkboxColumnKey,
      showHeaderBorder: props.showHeaderBorder,
      headerHeight: props.headerHeight,
      renderModel: props.renderModel,
      width: props.width,
      mode: props.mode,
      checkStatus,
      selectAll: this.selectAll,
      orderColumnCB: this.handleOrderColumnCB,
      key: 'grid-header',
    };

    let actionBar;


    if (props.actionBar || props.linkBar || props.showSearch || props.showColumnPicker) {
      const renderActionProps = {
        actionBarConfig: this.props.actionBar,
        showColumnPicker: this.props.showColumnPicker,
        locale: this.props.locale,
        linkBar: this.props.linkBar,
        checkboxColumnKey: me.checkboxColumnKey,
        showSearch: this.props.showSearch,
        searchBarPlaceholder: this.props.searchBarPlaceholder,
        columns: state.columns,
        width: props.width,
        onSearch: this.handleActionBarSearch,
        handleColumnPickerChange: this.handleColumnPickerChange,
        key: 'grid-actionbar',
      };
      actionBar = <ActionBar {...renderActionProps} />;
    }
    return (
      <div
        className={classnames({
          [props.className]: !!props.className,
          [props.prefixCls]: true,
          [`${props.prefixCls}-${props.size}-size`]: true,
          'kuma-subgrid-mode': !!props.passedData,
          [`${props.prefixCls}-tree-mode`]: props.renderModel === 'tree',
          [`${props.prefixCls}-row-group-mode`]: !!props.rowGroupKey,
          [`${props.prefixCls}__no-data`]: data.length === 0,
        })}
        style={style}
        ref={util.saveRef('root', this)}
      >
        {actionBar}
        <div
          className="kuma-uxtable-content"
          style={{
            width: props.passedData ? 'auto' : props.width,
          }}
        >
          {this.renderMainTable(renderHeaderProps, renderBodyProps, bodyHeight)}
          {this.renderLeftFixedTable(renderHeaderProps, renderBodyProps, bodyHeight)}
          {this.renderRightFixedTable(renderHeaderProps, renderBodyProps, bodyHeight)}
        </div>
        {this.renderPager()}
      </div>
    );
  }
}

Table.defaultProps = {
  prefixCls: 'kuma-uxtable',
  jsxcolumns: [],
  locale: 'zh-cn',
  size: 'middle',
  showHeader: true,
  width: 'auto',
  height: 'auto',
  mode: Const.MODE.EDIT,
  renderModel: '',
  levels: 0,
  actionBarHeight: 54,
  fetchDataOnMount: true,
  doubleClickToEdit: true,
  rowSelector: 'checkboxSelector',
  showPager: true,
  isMiniPager: false,
  showPagerSizeChanger: true,
  showPagerQuickJumper: true,
  showColumnPicker: false,
  showHeaderBorder: false,
  showPagerTotal: true,
  showMask: false,
  showSearch: false,
  getSavedData: true,
  pageSize: 10,
  pagerSizeOptions: [10, 20, 30, 40],
  rowHeight: 76,
  fetchParams: {},
  currentPage: 1,
  searchBarPlaceholder: '搜索表格内容',
  loadingText: 'loading',
  fitResponse: response =>
    ({
      content: response.content,
      success: response.success === undefined ? !response.hasError : response.success,
      error: {
        message: response.content || response.errors,
      },
    }),
  processData: data => data,
  beforeFetch: obj => obj,
  onFetchError: (err) => {
    if (err && err.stack) {
      console.error(err.stack);
    }
  },
  addRowClassName: () => { },
  onChange: () => { },
  onSave: () => {},
  shouldResetExpandedKeys: () => {},
};

// http://facebook.github.io/react/docs/reusable-components.html
Table.propTypes = {
  prefixCls: PropTypes.string,
  locale: PropTypes.string,
  size: PropTypes.oneOf(['small', 'middle']),
  jsxcolumns: PropTypes.arrayOf(PropTypes.object),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  headerHeight: PropTypes.number,
  pageSize: PropTypes.number,
  queryKeys: PropTypes.array,
  fetchDataOnMount: PropTypes.bool,
  doubleClickToEdit: PropTypes.bool,
  showColumnPicker: PropTypes.bool,
  showPager: PropTypes.bool,
  isMiniPager: PropTypes.bool,
  showPagerTotal: PropTypes.bool,
  showPagerQuickJumper: PropTypes.bool,
  pagerSizeOptions: PropTypes.array,
  showHeader: PropTypes.bool,
  showMask: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchBarPlaceholder: PropTypes.string,
  loadingText: PropTypes.string,
  subComp: PropTypes.element,
  emptyText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.object,
  ]),
  jsxdata: PropTypes.object,
  fetchUrl: PropTypes.string,
  fetchParams: PropTypes.object,
  currentPage: PropTypes.number,
  rowSelector: PropTypes.string,
  actionBar: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  linkBar: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  fitResponse: PropTypes.func,
  processData: PropTypes.func,
  beforeFetch: PropTypes.func,
  onFetchError: PropTypes.func,
  onColumnPick: PropTypes.func,
  addRowClassName: PropTypes.func,
  shouldResetExpandedKeys: PropTypes.func,
  passedData: PropTypes.object,
  getSavedData: PropTypes.bool,
  onChange: PropTypes.func,
  renderModel: PropTypes.string,
  levels: PropTypes.number,
};

Table.displayName = 'Table';
Table.CellField = CellField;
Table.Constants = Const;
Table.createCellField = createCellField;

export default Table;
