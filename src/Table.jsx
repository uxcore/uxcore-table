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
import NattyFetch from 'natty-fetch';
import Promise from 'lie';
import React from 'react';
import Animate from 'uxcore-animate';
import { addClass, removeClass } from 'rc-util/lib/Dom/class';
import { get } from 'rc-util/lib/Dom/css';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { polyfill } from 'react-lifecycles-compat';

import Mask from './Mask';
import util from './util';
import Header from './Header';
import Footer from './Footer';
import Tbody from './Tbody';
import ActionBar from './ActionBar';
import methods from './methods';
import innerMethods from './innerMethods';
import { propTypes, defaultProps } from './prop';
import TableContext from './context';

const { createCellField } = CellField;
const getStyle = get;

class Table extends React.Component {
  static processColumn = (props, state = {}, extra = {}) => {
    const actualProps = props;
    let columns = deepcopy(actualProps.jsxcolumns);
    let hasCheckboxColumn = false;
    let hasPercentWidth = false;
    let checkboxColumn;
    let checkboxColumnKey;
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
        checkboxColumn = item;
        checkboxColumnKey = item.dataKey;
        item.width = item.width
          || (new RegExp(`${props.prefixCls}-border-line`).test(actualProps.className) ? '40px' : '32px');
        item.align = item.align || 'left';
      }
      if (item.type === 'money') {
        item.align = item.align || 'right';
        item.delimiter = item.delimiter || ',';
      }
      if (/\d+%/.test(`${item.width}`)) {
        hasPercentWidth = true;
        const tableWidth = extra.tableWidth || state.tableWidth;
        if (tableWidth) {
          const scrollBarWidth = util.measureScrollbar();
          const trueTableWidth = tableWidth - scrollBarWidth;
          item.width = (parseFloat(item.width) * trueTableWidth) / 100;
        }
      }
    }
    // filter the column which has a dataKey 'jsxchecked' & 'jsxtreeIcon'
    // filter the column whose dataKey is rowGroupKey

    let rowGroupColumn;

    columns = columns.filter((item) => {
      if (item.dataKey === undefined) {
        return true;
      }
      if (item.dataKey === actualProps.rowGroupKey) {
        rowGroupColumn = item;
        return false;
      }
      if (item.dataKey === 'jsxchecked' || item.dataKey === 'jsxtreeIcon') {
        return false;
      }
      return true;
    });

    if (!!actualProps.rowSelection && !hasCheckboxColumn) {
      checkboxColumn = {
        dataKey: 'jsxchecked',
        width: (new RegExp(`${props.prefixCls}-border-line`).test(actualProps.className) ? '40px' : '32px'),
        type: actualProps.rowSelector,
        align: 'right',
      };
      checkboxColumnKey = 'jsxchecked';
      columns = [checkboxColumn].concat(columns);
    } else if (actualProps.parentHasCheckbox) {
      // no rowSelection but has parentHasCheckbox, render placeholder
      columns = [{
        dataKey: 'jsxwhite',
        width: (new RegExp(`${props.prefixCls}-border-line`).test(actualProps.className) ? '40px' : '32px'),
        type: 'empty',
      }].concat(columns);
    }
    if ((actualProps.subComp || actualProps.renderSubComp)
      && actualProps.renderModel !== 'tree' && !state.hasFixed) {
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
    return {
      columns, checkboxColumn, checkboxColumnKey, hasPercentWidth, rowGroupColumn,
    };
  }

  static isColumnsEqual = (newColumns, oldColumns) => {
    // drop the key whose type is function from columns first
    // func key is always not equal in columns cause anonymous function is widely used,
    // so comparing columns with func key is unnecessary.
    const newToCompare = util.dropFunc(newColumns);
    const oldToCompare = util.dropFunc(oldColumns);
    return deepEqual(newToCompare, oldToCompare);
  }

  constructor(props) {
    super(props);
    this.bindInnerMethods();
    this.uid = 0;
    this.fields = {};
    this.copyData = deepcopy(props.jsxdata);
    this.data = this.addValuesInData(deepcopy(props.jsxdata));
    this.state = {
      data: this.data, // checkbox 内部交互
      ...Table.processColumn(props), // column 内部交互
      showMask: props.showMask, // fetchData 时的内部状态改变
      pageSize: props.pageSize, // pagination 相关
      currentPage: props.currentPage, // pagination 相关
      activeColumn: null,
      searchTxt: '',
      expandedKeys: [],
      filterColumns: {},
      treeLoadingIds: [],
      hasFixed: util.hasFixColumn(props),
      // mirror for gDSFP
      lastPageSize: props.pageSize,
      lastCurrentPage: props.currentPage,
      lastJsxcolumns: props.jsxcolumns,
      lastShowMask: props.showMask,
      customView: null,
      removeCustomPager: false
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
    this.handleFilter = this.handleFilter.bind(this);
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
    if (me.props.renderSubComp && this.state.hasFixed) {
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.jsxdata
      && !deepEqual(this.props.jsxdata, this.copyData)) {
      this.fetchData('dataChange', this.props);
      // TODO: need reduce times
      this.forceToCheckRight = true;
    }
    if (prevProps.fetchUrl !== this.props.fetchUrl
      || !deepEqual(prevProps.fetchParams, this.props.fetchParams)) {
      this.fetchData('propsChange', this.props, () => {
        this.checkRightFixed(true);
      });
    }

    if (this.state.hasPercentWidth
      && this.root && this.root.clientWidth !== this.state.tableWidth) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState((state) => {
        const newState = {
          tableWidth: this.root.clientWidth,
          ...Table.processColumn(this.props, state, { tableWidth: this.root.clientWidth }),
        };
        if (state.forceToCheckRight) {
          this.checkRightFixed(true);
          newState.forceToCheckRight = false;
        }
        return newState;
      });
      /* eslint-enable react/no-did-update-set-state */
    }
    // TODO: performance need to be cared
    this.checkBodyVScroll();
    this.checkBodyHScroll();
    this.checkRightFixed(this.forceToCheckRight);
    this.forceToCheckRight = false;
    this.checkFixedMaxWidth();
  }

  componentWillUnmount() {
    if (this.resizeListener) {
      this.resizeListener.remove();
    }
  }

  useCustomView(view, removeCustomPager) {
    this.setState({
      customView: view,
      removeCustomPager
    })
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

  handleColumnResize = (e, changeWidth, column, node) => {
    let columns = deepcopy(this.state.columns)
    columns.map(col => {
      if (col.dataKey === column.dataKey) {
        col.width = (parseInt(col.width, 10) || 100) + changeWidth
      }
    })
    this.setState({
      columns
    }, () => {
      this.checkRightFixed(true)
      node && (node.style.right = parseInt(node.style.right, 10) + changeWidth + 'px')
    })
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

    if (me.state.checkboxColumn.type === 'radioSelector') {
      for (let i = 0; i < _data.length; i++) {
        const item = _data[i];
        if (item.jsxid === rowIndex) {
          item[me.state.checkboxColumnKey] = checked;
        } else if (item[me.state.checkboxColumnKey]) {
          item[me.state.checkboxColumnKey] = false;
        }
      }
    } else {
      for (let i = 0; i < _data.length; i++) {
        const item = _data[i];
        if (item.jsxid === rowIndex) {
          item[me.state.checkboxColumnKey] = checked;
          break;
        }
      }
    }

    me.setState({
      data: content,
    }, () => {
      if (!fromMount) {
        const data = me.state.data.datas || me.state.data.data;
        const selectedRows = data.filter(item => item[me.state.checkboxColumnKey] === true);
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
    current[me.state.checkboxColumnKey] = checked;
    util.changeValueR(current, me.state.checkboxColumnKey, checked);

    // reverse recursion, check/uncheck parents by its children.
    for (let i = treeMap.length - 1; i >= 0; i--) {
      treeMap[i][currentLevel[i]][me.state.checkboxColumnKey] = treeMap[i][currentLevel[i]]
        .data.every(item => item[me.state.checkboxColumnKey] === true);
    }

    me.setState({
      data,
    }, () => {
      const selectedRows = util.getAllSelectedRows(deepcopy(data), me.state.checkboxColumnKey);
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
      const { headerScroll } = this;
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

  /**
   * hide vertical scrollbar if table is not vertically scrollable
   */
  checkBodyVScroll() {
    if (this.bodyScroll) {
      const { prefixCls } = this.props;
      const node = this.bodyScroll.getDom();
      // body does not exist if no data
      if (node.children[0]) {
        const wrapperHeight = node.clientHeight;
        const bodyHeight = node.children[0].clientHeight;
        const headerDom = this.headerScroll ? this.headerScroll.getDom() : null;
        const footerDom = this.footerScroll ? this.footerScroll.getDom() : null;
        const noVScroll = bodyHeight <= wrapperHeight;
        if (this.noVScroll === undefined || this.noVScroll !== noVScroll) {
          if (noVScroll) {
            addClass(node, `${prefixCls}-no-v-scroll`);
            if (headerDom) {
              addClass(headerDom, `${prefixCls}-no-v-scroll`);
            }
            if (footerDom) {
              addClass(footerDom, `${prefixCls}-no-v-scroll`);
            }
          } else {
            removeClass(node, `${prefixCls}-no-v-scroll`);
            if (headerDom) {
              removeClass(headerDom, `${prefixCls}-no-v-scroll`);
            }
            if (footerDom) {
              removeClass(footerDom, `${prefixCls}-no-v-scroll`);
            }
          }
          this.noVScroll = noVScroll;
        }
      }
    }
  }

  /**
   * add fixed body box-shadow when body is scrolling horizontally
   * @param {number} scrollLeft body's current scrollLeft
   */
  checkBodyHScroll(scrollLeft) {
    if (!this.state.hasFixed) {
      return false;
    }
    if (!this.bodyScroll) {
      return false;
    }
    const node = this.bodyScroll.getDom();
    const wrapperScrollLeft = scrollLeft || node.scrollLeft;
    if (this.state.hasFixed.hasLeft && this.fixedTable) {
      if (wrapperScrollLeft > 0) {
        addClass(this.fixedTable, 'has-scroll');
      } else {
        removeClass(this.fixedTable, 'has-scroll');
      }
    }
    if (this.state.hasFixed.hasRight) {
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
   * check if main table need to be right positioned if leftFixedMaxWidth is set
   */
  checkFixedMaxWidth() {
    const { leftFixedMaxWidth } = this.props;
    if (!leftFixedMaxWidth || !this.headerFixed || !this.mainTable) return;
    const fixedColumnsWidth = this.headerFixed.getFixedColumnsWidth();
    if (fixedColumnsWidth && fixedColumnsWidth !== this.fixedColumnsWidth) {
      this.fixedColumnsWidth = fixedColumnsWidth;
      const offset = leftFixedMaxWidth - fixedColumnsWidth;
      if (offset < 0) {
        this.mainTable.style.position = 'relative';
        this.mainTable.style.left = `${offset}px`;
        this.mainTable.style.width = `calc(100% + ${-offset}px)`;
      } else {
        this.mainTable.style.left = '0px';
        this.mainTable.style.width = 'calc(100%)';
      }
    }
  }


  /**
   * cancel the CellField when it is unmounted.
   * @param {element} field  the cell field to be canceled.
   */

  detachCellField(name) {
    delete this.fields[name];
  }


  /**
   * fetch Data via Ajax
   * @param {string} from tell fetchData where it is invoked, the param will be
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
      willFetch: (vars, config) => {
        /* eslint-disable no-param-reassign */
        /* natty-fetch api design force to make param reassign */
        vars.data = props.beforeFetch(deepcopy(vars.data), from, config);
        /* eslint-enable no-param-reassign */
      },
      data: me.getQueryObj(from, props),
      fit: props.fitResponse,
      withCredentials: props.fetchWithCredentials,
      jsonp: isJsonp,
      Promise,
    });

    me.request().then((content) => {
      // Data has changed, so uid which is used to mark the data should be reset.
      me.uid = 0;
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
    // Data has changed, so uid which is used to mark the data should be reset.
    me.uid = 0;
    if (['pagination', 'order', 'search', 'filter'].indexOf(from) !== -1) {
      if (from === 'pagination' && props.onPagerChange) {
        props.onPagerChange(this.state.currentPage, this.state.pageSize);
      }

      if (from === 'order' && props.onOrder) {
        props.onOrder(this.state.activeColumn, this.state.orderType);
      }

      if (from === 'search' && props.onSearch) {
        props.onSearch(this.state.searchTxt);
      }

      if (from === 'filter' && props.onFilter) {
        props.onFilter(this.state.filterColumns);
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
   * @param {string} from used in props.beforeFetch
   */

  getQueryObj(from, props) {
    const me = this;
    let queryObj = {};
    if (props.passedData) {
      const { queryKeys } = props;
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
    const { activeColumn, orderType } = me.state;
    if (activeColumn) {
      queryObj = assign({}, queryObj, {
        orderColumn: activeColumn.dataKey,
      });
      if (orderType && orderType !== 'none') {
        queryObj.orderType = orderType;
      }
    }

    // search query
    const { searchTxt } = me.state;
    if (searchTxt) {
      queryObj = assign({}, queryObj, {
        searchTxt,
      });
    }

    // filter
    const { filterColumns } = this.state;
    if (filterColumns) {
      queryObj = { ...queryObj, ...filterColumns };
    }

    if (['search', 'filter'].indexOf(from) !== -1) {
      queryObj = { ...queryObj, currentPage: 1 };
    }

    // fetchParams has the top priority
    if (props.fetchParams) {
      queryObj = assign({}, queryObj, props.fetchParams);
    }

    // return props.beforeFetch(deepcopy(queryObj), from);
    return queryObj;
  }

  getCheckStatus(data) {
    const me = this;
    const { rowSelection } = me.props;
    const column = me.state.checkboxColumn;
    if (!column || data.length === 0) {
      return false;
    }
    const { checkboxColumnKey } = me.state;
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

  handleColumnPickerCheckAll = (checked) => {
    const columns = deepcopy(this.state.columns);
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    notRenderColumns.push(this.state.checkboxColumnKey);
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
      // current column is a group and groupName is right
      if (isGroup) {
        for (let j = 0; j < item.columns.length; j++) {
          const ele = item.columns[j];
          ele.hidden = !checked;
        }
      } else if (notRenderColumns.indexOf(item.dataKey) === -1) {
        item.hidden = !checked;
      }
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

  handleColumnOrderChange = (columns) => {
    this.setState({
      columns
    })
  }

  handleColumnPickerChange(checkedKeys, groupName) {
    const columns = deepcopy(this.state.columns);
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    notRenderColumns.push(this.state.checkboxColumnKey);
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
        if (checkedKeys.indexOf(item.dataKey) !== -1 || notRenderColumns.indexOf(item.dataKey) !== -1) {
          item.hidden = false;
        } else if (item.type !== 'action') {
          item.hidden = true;
        }
      }
    }

    const { selectedKeys } = util.getSelectedKeys(columns);

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
    if (this.footerIsScorlling) {
      this.footerIsScorlling = false;
      return;
    }
    const me = this;
    if (scrollLeft !== undefined && ['scroll', 'fixed'].indexOf(column) !== -1) {
      const headerNode = me[`header${upperFirst(column)}`];
      const footerNode = me[`footer${upperFirst(column)}`];
      if (headerNode) {
        headerNode.getDom().scrollLeft = scrollLeft;
      }
      if (footerNode) {
        footerNode.getDom().scrollLeft = scrollLeft;
      }
    }
    if (scrollTop !== undefined && this.state.hasFixed) {
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
    if (this.footerIsScorlling) {
      this.footerIsScorlling = false;
      return;
    }
    if (scrollLeft !== undefined) {
      const me = this;
      const bodyNode = me.bodyScroll;
      bodyNode.getDom().scrollLeft = scrollLeft;
      const footerDom = me.footerScroll ? me.footerScroll.getDom() : null;
      if (footerDom) {
        footerDom.scrollLeft = scrollLeft;
      }
    }
  }

  handleFooterScroll(scrollLeft) {
    this.footerIsScrolling = true;
    if (this.bodyIsScorlling) {
      this.bodyIsScorlling = false;
      return;
    }
    if (this.headerIsScrolling) {
      this.headerIsScrolling = false;
      return;
    }

    if (scrollLeft !== undefined) {
      const me = this;
      const bodyNode = me.bodyScroll;
      if (bodyNode) {
        bodyNode.getDom().scrollLeft = scrollLeft;
      }
      const headerDom = me.headerScrol ? me.headerScrol.getDom() : null;
      if (headerDom) {
        headerDom.scrollLeft = scrollLeft;
      }
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

  handleFilter(filterKeys, column) {
    const filterColumns = { ...this.state.filterColumns };
    filterColumns[column.dataKey] = filterKeys;
    this.setState({
      filterColumns,
    }, () => {
      this.fetchData('filter');
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
    const {
      jsxid, column, value, text, pass,
    } = obj;
    const { dataKey } = column;
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


  static getDerivedStateFromProps = (props, state) => {
    let newData = {};
    if (props.pageSize !== state.lastPageSize) {
      newData.pageSize = props.pageSize;
      newData.lastPageSize = props.pageSize;
    }
    if (props.currentPage !== state.lastCurrentPage) {
      newData.currentPage = props.currentPage;
      newData.lastCurrentPage = props.currentPage;
    }
    if (!!props.jsxcolumns
      && !Table.isColumnsEqual(props.jsxcolumns, state.lastJsxcolumns)) {
      newData = {
        ...newData,
        ...Table.processColumn(props, state),
        lastJsxcolumns: props.jsxcolumns,
        forceToCheckRight: true,
      };
      newData.hasFixed = util.hasFixColumn(props);

      // jsxcolumns变更时需要检查activeColumn是否还存在
      let flag = false
      const columns = props.jsxcolumns

      for(let i = 0, len = columns.length; i < len; i++) {
        if (columns[i].dataKey === state.activeColumn.dataKey) {
          flag = true
          break
        }
      }

      if (!flag) {
        newData.activeColumn = undefined
      }
    }
    if (props.showMask !== state.lastShowMask) {
      newData.showMask = props.showMask;
      newData.lastShowMask = props.showMask;
    }

    return newData;
  }

  resizeColumns() {
    if (this.state.hasPercentWidth && this.root && this.root.clientWidth !== this.rootWidth) {
      this.rootWidth = this.root.clientWidth;
      this.setState(state => (
        {
          ...Table.processColumn(this.props, state),
        }
      ));
    }
  }

  selectAll(checked) {
    const me = this;
    const content = deepcopy(me.state.data);
    const data = content.datas || content.data;
    const { rowSelection } = me.props;

    const selectedRows = [];
    for (let i = 0; i < data.length; i++) {
      const column = me.state.checkboxColumn;
      const key = me.state.checkboxColumnKey;
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

  hasFooter() {
    return this.props.showFooter && typeof this.props.footer === 'function';
  }


  renderTbody(renderBodyProps, bodyHeight, fixedColumn) {
    const { prefixCls } = this.props;
    const isFixedTable = ['fixed', 'rightFixed'].indexOf(fixedColumn) !== -1;
    return (
      <div
        className={classnames(`${prefixCls}-body-wrapper`, {
          [`${prefixCls}-fixed-body-wrapper`]: isFixedTable,
        })}
      >
        <Tbody
          {...renderBodyProps}
          fixedColumn={fixedColumn}
          onScroll={this.handleBodyScroll}
          ref={util.saveRef(`body${upperFirst(fixedColumn)}`, this)}
        />
        {!isFixedTable ? (
          <Animate showProp="visible" transitionName="tableMaskFade">
            <Mask visible={this.state.showMask} text={this.props.loadingText} />
          </Animate>
        ) : null}
      </div>
    );
  }

  renderHeader(renderHeaderProps, fixedColumn) {
    const { prefixCls, showHeader } = this.props;
    if (!showHeader) {
      return null;
    }
    return (
      <div className={`${prefixCls}-header-wrapper`}>
        <Header
          {...renderHeaderProps}
          fixedColumn={fixedColumn}
          ref={util.saveRef(`header${upperFirst(fixedColumn)}`, this)}
          onScroll={this.handleHeaderScroll}
        />
      </div>
    );
  }

  renderFooter(renderFooterProps = {}, fixedColumn) {
    const { prefixCls } = this.props;
    if (!this.hasFooter()) {
      return null;
    }
    return (
      <div className={`${prefixCls}-footer-wrapper`}>
        <Footer
          {...renderFooterProps}
          fixedColumn={fixedColumn}
          ref={util.saveRef(`footer${upperFirst(fixedColumn)}`, this)}
          onScroll={(scrollLeft) => { this.handleFooterScroll(scrollLeft); }}
        />
      </div>
    );
  }



  renderPager(miniType) {

    const me = this;
    const { data, currentPage, pageSize } = this.state;
    const {
      showPagerTotal,
      showPager,
      locale,
      pagerSizeOptions,
      isMiniPager,
      showPagerSizeChanger,
      showPagerQuickJumper,
      showUnknownTotalPager,
      prefixCls,
    } = me.props;

    if (miniType && data) {
      return (
        <Pagination simple current={currentPage} onChange={me.onPageChange.bind(me)} total={data.totalCount} />
      )
    }

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
        <div className={`${prefixCls}-page`}>
          <Pagination {...pagersProps} />
        </div>
      );
      if (data.totalCount) {
        if (parseInt(data.totalCount, 10) <= parseInt(pageSize, 10) && !showPagerSizeChanger) {
          return null;
        }
        return pager;
      } if (showUnknownTotalPager) {
        return pager;
      }
    }
    return null;
  }

  renderMainTable({
    renderHeaderProps, renderBodyProps, renderFooterProps, bodyHeight,
  }) {
    const { prefixCls } = this.props;
    const style = {};
    return (
      <div className={`${prefixCls}-main-table`} style={style} ref={util.saveRef('mainTable', this)}>
        {this.renderHeader(renderHeaderProps, 'scroll')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'scroll')}
        {this.renderFooter(renderFooterProps, 'scroll')}
      </div>
    );
  }

  renderLeftFixedTable({
    renderHeaderProps, renderBodyProps, renderFooterProps, bodyHeight,
  }) {
    if (!this.state.hasFixed || !this.state.hasFixed.hasLeft
      || !renderBodyProps.data || !renderBodyProps.data.length) {
      return null;
    }
    const { prefixCls, leftFixedMaxWidth } = this.props;
    const style = {
      maxWidth: leftFixedMaxWidth,
    };
    return (
      <div
        className={classnames(`${prefixCls}-left-fixed-table`)}
        style={style}
        ref={util.saveRef('fixedTable', this)}
      >
        {this.renderHeader(renderHeaderProps, 'fixed')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'fixed')}
        {this.renderFooter(renderFooterProps, 'fixed')}
      </div>
    );
  }

  renderRightFixedTable({
    renderHeaderProps, renderBodyProps, renderFooterProps, bodyHeight,
  }) {
    if (!this.state.hasFixed || !this.state.hasFixed.hasRight
      || !renderBodyProps.data || !renderBodyProps.data.length) {
      return null;
    }
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-right-fixed-table`} ref={util.saveRef('rightFixedTable', this)}>
        {this.renderHeader(renderHeaderProps, 'rightFixed')}
        {this.renderTbody(renderBodyProps, bodyHeight, 'rightFixed')}
        {this.renderFooter(renderFooterProps, 'rightFixed')}
      </div>
    );
  }

  renderActionBar() {
    const shouldRenderActionBar = (config) => {
      let shouldRenderAction = false;
      if (!config.useListActionBar) {
        if (config.actionBar) {
          if (Array.isArray(config.actionBar)) {
            if (config.actionBar.length) {
              shouldRenderAction = true;
            }
          } else if (typeof config.actionBar === 'object') {
            for (let i in config.actionBar) if (config.actionBar.hasOwnProperty(i)) {
              if (typeof config.actionBar[i] === 'function') {
                shouldRenderAction = true;
                break;
              }
            }
          }
        }
      } else {
        const actionBar = config.actionBar
        if (actionBar) {
          if (actionBar.showSelectAll
            || actionBar.buttons && actionBar.buttons.length
            || typeof actionBar.actionBarTip === 'string' && actionBar.actionBarTip
            || typeof actionBar.actionBarTip === 'function' && actionBar.actionBarTip()
            || actionBar.customBarItem
            || actionBar.rowOrder
            || actionBar.columnsOrder
            || actionBar.columnsPicker
            || actionBar.customView
            || actionBar.showMiniPager
            || actionBar.search
            || actionBar.linkBar
          ) {
            shouldRenderAction = true
          }
        }
      }
      return shouldRenderAction
      || (config.linkBar && config.linkBar.length)
      || config.showSearch
      || config.showColumnPicker;
    };

    const me = this;
    const { state, props } = me;
    const data = state.data ? (state.data.datas || state.data.data) : [];
    const checkStatus = me.getCheckStatus(data);

    if (shouldRenderActionBar(props)) {
      const renderActionProps = {
        actionBarConfig: props.actionBar,
        useListActionBar: props.useListActionBar,
        showColumnPicker: props.showColumnPicker,
        locale: props.locale,
        linkBar: props.linkBar,
        checkStatus,
        data,
        currentPage: state.currentPage,
        selectAll: me.selectAll.bind(me),
        checkboxColumnKey: me.state.checkboxColumnKey,
        showSearch: props.showSearch,
        searchBarPlaceholder: props.searchBarPlaceholder,
        columns: me.state.columns,
        width: props.width,
        onSearch: me.handleActionBarSearch,
        showColumnPickerCheckAll: props.showColumnPickerCheckAll,
        handleColumnPickerChange: me.handleColumnPickerChange,
        handleColumnPickerCheckAll: me.handleColumnPickerCheckAll,
        handleColumnOrderChange: me.handleColumnOrderChange,
        key: 'grid-actionbar',
        prefixCls: `${props.prefixCls}-actionbar`,
        tablePrefixCls: props.prefixCls,
        renderPager: me.renderPager.bind(me),
        useCustomView: me.useCustomView.bind(me),
      };
      return <ActionBar {...renderActionProps} />;
    }
    return null;
  }

  render() {
    const me = this;
    const { props, state } = this;
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

    let bodyHeight;
    if (props.height === 'auto' || props.height === '100%') {
      bodyHeight = props.height;
    } else {
      bodyHeight = parseInt(props.height, 10) - (headerHeight || (hasGroup ? 100 : 50))
          - actionBarHeight - pagerHeight;
    }

    const commonProps = {
      columns: state.columns,
      width: props.width,
      mode: props.mode,
      renderModel: props.renderModel,
      checkboxColumnKey: me.state.checkboxColumnKey,
      leftFixedMaxWidth: props.leftFixedMaxWidth,
      tablePrefixCls: props.prefixCls,
      getTooltipContainer: props.getTooltipContainer
    };

    const renderBodyProps = {
      ...commonProps,
      rowGroupColumn: state.rowGroupColumn,
      mask: state.showMask,
      expandedKeys: state.expandedKeys,
      currentHoverRow: state.currentHoverRow,
      rowGroupActiveKey: state.rowGroupActiveKey,
      data,
      treeLoadingIds: this.state.treeLoadingIds,
      bodyHeight,
      hasFooter: this.hasFooter(),
      prefixCls: `${props.prefixCls}-body`,
      toggleSubCompOnRowClick: props.toggleSubCompOnRowClick,
      toggleTreeExpandOnRowClick: props.toggleTreeExpandOnRowClick,
      rowSelection: props.rowSelection,
      addRowClassName: props.addRowClassName,
      locale: props.locale,
      emptyText: props.emptyText,
      renderSubComp: this.state.hasFixed ? null : props.renderSubComp,
      rowHeight: props.rowHeight,
      loadingText: props.loadingText,
      height: bodyHeight,
      levels: props.levels,
      rowGroupKey: props.rowGroupKey,
      footer: props.footer,
      showRowGroupFooter: props.showRowGroupFooter,
      root: this,
      onCollapseChange: (activeKey) => { this.setState({ rowGroupActiveKey: activeKey }); },
      changeSelected: this.changeSelected,
      handleDataChange: this.handleDataChange,
      attachCellField: this.attachCellField,
      detachCellField: this.detachCellField,
      key: 'table-body',
    };
    const renderHeaderProps = {
      ...commonProps,
      activeColumn: state.activeColumn,
      filterColumns: state.filterColumns,
      orderType: state.orderType,
      prefixCls: `${props.prefixCls}-header`,
      showHeaderBorder: props.showHeaderBorder,
      headerHeight: props.headerHeight,
      checkStatus,
      selectAll: this.selectAll,
      orderColumnCB: this.handleOrderColumnCB,
      onColumnFilter: this.handleFilter,
      key: 'table-header',
      columnResizeable: props.columnResizeable,
      handleColumnResize: this.handleColumnResize
    };

    const renderFooterProps = {
      ...commonProps,
      data,
      footer: props.footer,
    };

    const config = {
      renderHeaderProps, renderBodyProps, renderFooterProps, bodyHeight,
    };

    return (
      <TableContext.Provider value={{
        prefixCls: props.prefixCls,
      }}
      >
        <div
          className={classnames({
            [props.prefixCls]: true,
            [`${props.prefixCls}-${props.size}-size`]: true,
            [props.className]: !!props.className,
            'kuma-subgrid-mode': !!props.passedData,
            [`${props.prefixCls}-tree-mode`]: props.renderModel === 'tree',
            [`${props.prefixCls}-row-group-mode`]: !!props.rowGroupKey,
            [`${props.prefixCls}__no-data`]: data.length === 0,
            [`${props.prefixCls}__has-footer`]: this.hasFooter(),
          })}
          style={style}
          ref={util.saveRef('root', this)}
        >
          {this.renderActionBar()}
          {
            !this.state.customView ? <div
              className={`${props.prefixCls}-content`}
              style={{
                width: props.passedData ? 'auto' : props.width,
              }}
            >
              {this.renderMainTable(config)}
              {this.renderLeftFixedTable(config)}
              {this.renderRightFixedTable(config)}
            </div> : this.state.customView
          }
          {!this.state.removeCustomPager ? this.renderPager() : null}
        </div>
      </TableContext.Provider>

    );
  }
}

Table.defaultProps = defaultProps;
Table.propTypes = propTypes;
Table.displayName = 'Table';
Table.CellField = CellField;
Table.Constants = Const;
Table.createCellField = createCellField;

polyfill(Table);

export default Table;
