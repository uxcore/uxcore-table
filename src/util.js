import Formatter from 'uxcore-formatter';
import deepcopy from 'lodash/cloneDeep';

const mergeData = (data, obj) => {
  const newData = deepcopy(data);
    // code compatible
  if (newData.datas) {
    newData.datas = newData.datas.concat(obj);
  } else if (newData.data) {
    newData.data = newData.data.concat(obj);
  }
  newData.totalCount += 1;
  return newData;
};

/* eslint-disable no-param-reassign */
const saveRef = (refName, context) =>
   (c) => {
     context[refName] = c;
   }
;
/* eslint-enable no-param-reassign */

// For changeTreeSelected in Table.js
// will change the first param data, be cautious.
const changeValueR = (data, key, value) => {
  if (data.data && data.data instanceof Array) {
    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];
      item[key] = value;
      changeValueR(item, key, value);
    }
  }
};

const isRowHalfChecked = (rowData, checkboxColumnKey) => {
  if (rowData.data) {
    const isHalfChecked = rowData.data.some((item) => {
      if (item[checkboxColumnKey]) {
        return true;
      }
      return isRowHalfChecked(item, checkboxColumnKey);
    });
    return isHalfChecked;
  }
  return false;
};

// depth-first recursion of multi branches tree
const getAllSelectedRows = (rowData, checkboxColumnKey) => {
  const selectedRows = [];
  let stack = [];
  // put first level data into stack
  stack.push(rowData);
  while (stack.length) {
    const item = stack.shift();
    if (item[checkboxColumnKey]) {
      selectedRows.push(item);
    }
    if (item.data) {
      stack = item.data.concat(stack);
    }
  }
  return selectedRows;
};

// TODO cache row tree set
// const getRowTreeSet = (rowData) => {
//   let stack = [];
//   // put first level data into stack
//   stack.push(rowData);
//   while (stack.length) {
//     const item = stack.shift();
//     if (item.data) {
//       stack = stack.concat(item.data);
//     }
//   }
// };

const getSelectedKeys = (columns) => {
  let realColumns = [];
  const selectedKeys = [];
  columns.forEach((item) => {
    const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
    if (isGroup) {
      realColumns = realColumns.concat(item.columns);
    } else {
      realColumns.push(item);
    }
  });
  realColumns.forEach((item) => {
    if (!item.hidden) {
      selectedKeys.push(item.dataKey);
    }
  });
  return selectedKeys;
};

const getConsts = () => ({
  commonGroup: '__common__',
});

const utils = {
  getIEVer: () => {
    if (window) {
      const ua = window.navigator.userAgent;
      const idx = ua.indexOf('MSIE');
      if (idx > 0) {
        // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64;
        // Trident/6.0; SLCC2; .NET CLR 2.0.50727)"
        return parseInt(ua.substring(idx + 5, ua.indexOf('.', idx)), 10);
      }
      if (ua.match(/Trident\/7\./)) {
        // "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2;
        // .NET CLR 2.0.50727; rv:11.0) like Gecko"
        return 11;
      }
      return 0;
    }
    return 0;
  },
  toggleItemInArr: (item, arr) => {
    const idx = arr.indexOf(item);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(item);
    }
    return arr;
  },
  formatValue: (value, type, delimiter) => {
    const newDelimiter = delimiter || ' ';
    if (value === null || value === undefined) {
      return value;
    }
    const newValue = value.toString();
    if (type === 'money') {
      return Formatter.money(newValue, newDelimiter);
    } else if (type === 'card') {
      return Formatter.card(newValue, newDelimiter);
    } else if (type === 'cnmobile') {
      return Formatter.cnmobile(newValue, newDelimiter);
    }
    return newValue;
  },
  getSelectedKeys,
  changeValueR,
  isRowHalfChecked,
  getAllSelectedRows,
  getConsts,
  saveRef,
  mergeData,
};

export default utils;

