import Formatter from 'uxcore-formatter';
import deepcopy from 'lodash/cloneDeep';
import cssAni from 'css-animation';


let scrollbarWidth;

// Measure scrollbar width for padding body during modal show/hide
const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll',
};

/**
 * Get IE version.
 * @return {number} the IE version, 0 if the browser is not IE.
 */
const getIEVer = () => {
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
};

/**
 * Add or Remove an item from an array if the item does/does not exist.
 * @param {any} item the item need to add/remove.
 * @param {array} arr the array to change.
 * @return {array} the changed array.
 */
const toggleItemInArr = (item, arr) => {
  const idx = arr.indexOf(item);
  if (idx !== -1) {
    arr.splice(idx, 1);
  } else {
    arr.push(item);
  }
  return arr;
};

/**
 * format a string using uxcore-formatter.
 * @param {string} value the string to be formatted
 * @param {string} type the format type
 * @param {string} delimiter the format delimiter
 * @return {string} the formatted string
 */

const formatValue = (value, type, delimiter) => {
  const newDelimiter = delimiter || ' ';
  if (value === null || value === undefined) {
    return value;
  }
  const newValue = value.toString();
  if (type === 'money') {
    return Formatter.money(newValue, newDelimiter);
  }
  if (type === 'card') {
    return Formatter.card(newValue, newDelimiter);
  }
  if (type === 'cnmobile') {
    return Formatter.cnmobile(newValue, newDelimiter);
  }
  return newValue;
};

const arrayConcat = (oldArr, newArr, reverse) => {
  const resArr = reverse ? newArr.concat(oldArr) : oldArr.concat(newArr);
  return resArr;
};

const mergeData = (data, obj, reverse) => {
  const newData = deepcopy(data);
  // code compatible
  if (newData.datas) {
    newData.datas = arrayConcat(newData.datas, obj, reverse);
  } else if (newData.data) {
    newData.data = arrayConcat(newData.data, obj, reverse);
  }
  newData.totalCount += 1;
  return newData;
};

/* eslint-disable no-param-reassign */
const saveRef = (refName, context) => (c) => {
  context[refName] = c;
};
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


const hasFixColumn = (props) => {
  let hasLeft = false;
  let hasRight = false;
  const columns = props.jsxcolumns.filter((item) => {
    if (item.fixed) {
      hasLeft = true;
      return true;
    }
    if (item.rightFixed) {
      hasRight = true;
      return true;
    }
    return false;
  });
  if (columns.length > 0) {
    return {
      hasLeft,
      hasRight,
    };
  }
  return false;
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
  let isHalfChecked = false;
  columns.forEach((item) => {
    const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
    if (isGroup) {
      realColumns = realColumns.concat(item.columns);
    } else {
      realColumns.push(item);
    }
  });
  realColumns.forEach((item) => {
    if (!item.hidden &&
      item.dataKey &&
      ['jsxchecked', 'jsxtreeIcon'].indexOf(item.dataKey) === -1 &&
      item.type !== 'action'
    ) {
      selectedKeys.push(item.dataKey);
    } else if (item.hidden && item.dataKey) {
      isHalfChecked = true;
    }
  });
  return { selectedKeys, isHalfChecked };
};

const getConsts = () => ({
  commonGroup: '__common__',
});

const getDefaultExpandedKeys = (data, levels, level = 1) => {
  let expandedKeys = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (level <= levels) {
        expandedKeys.push(item.jsxid);
        expandedKeys = expandedKeys.concat(getDefaultExpandedKeys(item.data, levels, level + 1));
      }
    });
  }
  return expandedKeys;
};

const measureScrollbar = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  if (scrollbarWidth) {
    return scrollbarWidth;
  }
  const scrollDiv = document.createElement('div');
  Object.keys(scrollbarMeasure).forEach((scrollProp) => {
    if (Object.hasOwnProperty.call(scrollbarMeasure, scrollProp)) {
      scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
    }
  });
  document.body.appendChild(scrollDiv);
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  scrollbarWidth = width;
  return scrollbarWidth;
};

/* eslint-disable no-param-reassign */

const toggleHeightAnim = (node, show, done) => {
  let height;
  cssAni(node, '__css-animation__', {
    start() {
      node.style.overflow = 'hidden';
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
        node.style.opacity = 0;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
        node.style.opacity = 1;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      node.style.overflow = '';
      done();
    },
  });
};

/**
 * recursively drop key from object
 * @param {*} obj object to drop key
 */
const dropFunc = (obj) => {
  if (obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    const newArr = [];
    obj.forEach((item) => {
      if (typeof item !== 'function') {
        newArr.push(dropFunc(item));
      }
    });
    return newArr;
  }
  if (typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value !== 'function') {
        newObj[key] = dropFunc(value);
      }
    });
    return newObj;
  }
  return obj;
};

/* eslint-enable no-param-reassign */

const utils = {
  getIEVer,
  toggleItemInArr,
  formatValue,
  getSelectedKeys,
  changeValueR,
  isRowHalfChecked,
  getAllSelectedRows,
  getConsts,
  saveRef,
  mergeData,
  hasFixColumn,
  getDefaultExpandedKeys,
  measureScrollbar,
  toggleHeightAnim,
  dropFunc,
};

export default utils;
