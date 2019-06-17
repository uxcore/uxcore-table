/**
 * Table Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

import Const from 'uxcore-const';
import PropTypes from 'prop-types';

const defaultProps = {
  prefixCls: 'kuma-uxtable',
  jsxcolumns: [],
  locale: 'zh-cn',
  size: 'middle',
  showHeader: true,
  showFooter: true,
  showRowGroupFooter: false,
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
  toggleSubCompOnRowClick: false,
  toggleTreeExpandOnRowClick: false,
  pageSize: 10,
  pagerSizeOptions: [10, 20, 30, 40],
  rowHeight: 76,
  fetchParams: {},
  fetchHeader: {},
  currentPage: 1,
  searchBarPlaceholder: '搜索表格内容',
  loadingText: 'loading',
  fitResponse: response => ({
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
  showColumnPickerCheckAll: false,
  defaultEditable: false,
  getTooltipContainer: null,
  columnResizeable: false,
  defaultRowGroupActiveKeys: undefined,
  onRowGroupOpenChange: undefined,
  needCheckRightFixed: false,
  fixHeaderToTop: false,
  fixHeaderOffset: 0,
  fixActionBarToTop: false,
  fixActionBarOffset: 0,
  expandIconType: undefined,
  tooltipPlacement: ''
};

// http://facebook.github.io/react/docs/reusable-components.html
const propTypes = {
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
  showFooter: PropTypes.bool,
  showRowGroupFooter: PropTypes.bool,
  isMiniPager: PropTypes.bool,
  showPagerTotal: PropTypes.bool,
  showPagerQuickJumper: PropTypes.bool,
  pagerSizeOptions: PropTypes.array,
  showHeader: PropTypes.bool,
  showMask: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchBarPlaceholder: PropTypes.string,
  toggleSubCompOnRowClick: PropTypes.bool,
  toggleTreeExpandOnRowClick: PropTypes.bool,
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
  fetchMethod: PropTypes.string,
  fetchHeader: PropTypes.object,
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
  footer: PropTypes.func,
  showColumnPickerCheckAll: PropTypes.bool,
  defaultEditable: PropTypes.bool,
  getTooltipContainer: PropTypes.func,
  columnResizeable: PropTypes.bool,
  defaultRowGroupActiveKeys: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number
  ]),
  onRowGroupOpenChange: PropTypes.func,
  needCheckRightFixed: PropTypes.bool,
  fixHeaderToTop: PropTypes.bool,
  fixHeaderOffset: PropTypes.number,
  fixActionBarToTop: PropTypes.bool,
  fixActionBarOffset: PropTypes.number,
  expandIconType: PropTypes.string,
  tooltipPlacement: PropTypes.oneOf(['topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight'])
};

export {
  propTypes,
  defaultProps,
};
