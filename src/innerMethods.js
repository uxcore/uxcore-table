import deepcopy from 'lodash/cloneDeep';
import Const from 'uxcore-const';
import util from './util';

/**
 * add some specific value for each row data which will be used in manipulating data & rendering.
 * used in record API.
 */

function addJSXIdsForRecord(obj) {
  const me = this;
  let objAux = deepcopy(obj);
  if (objAux instanceof Array) {
    objAux = objAux.map((item) => {
      const newItem = deepcopy(item);
      if (newItem.jsxid === undefined || newItem.jsxid == null) {
        me.uid += 1;
        newItem.jsxid = me.uid;
      }
      if (!newItem.__mode__) {
        newItem.__mode__ = Const.MODE.EDIT;
      }
      return newItem;
    });
  } else {
    me.uid += 1;
    objAux.jsxid = me.uid;
  }
  return objAux;
}

/**
 * add some specific value for each row data which will be used in manipulating data & rendering.
 * used in method fetchData
 */

function addValuesInData(objAux, operation) {
  if (!objAux || (!objAux.datas && !objAux.data)) return null;
  const me = this;
  const data = objAux.datas || objAux.data;
  if (operation === 'reset') {
    me.uid = 0;
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    node.jsxid = me.uid;
    me.uid += 1;
    node.__mode__ = node.__mode__ || (!me.props.defaultEditable ? 'view' : 'edit') || Const.MODE.VIEW;
    node.__treeId__ = objAux.__treeId__ ? `${objAux.__treeId__}-${i}` : `${i}`;
    me.addValuesInData(node);
  }
  return objAux;
}


/**
 * insert some data into this.state.data & this.data
 * @param objAux {Array or Object} datum or data need to be inserted
 */

function insertRecords(obj, reverse, cb, targetJsxId) {
  if (typeof obj !== 'object') return;
  const me = this;
  let objAux = deepcopy(obj);
  if (!(objAux instanceof Array)) {
    objAux = [objAux];
  }
  objAux = me.addJSXIdsForRecord(objAux);
  const { data, expandedKey } = util.mergeData(me.state.data, objAux, reverse, targetJsxId);
  updateTreeId(data.data);
  me.data = data;
  let expandedKeys = [...this.state.expandedKeys];
  if (expandedKey >= 0) {
    expandedKeys.push(expandedKey)
  }
  me.setState({
    data: data,
    expandedKeys
  }, () => {
    if (cb) {
      cb();
    }
  });
}

/**
 * update this.state.data using obj by jsxid
 * @param {object/array} obj
 */
function updateRecord(obj, cb) {
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
      cb(obj);
    }
  });
}

/**
 * update this.state.data & this.data using obj by jsxid
 * @param {objtct/array} obj
 */

function syncRecord(obj, cb) {
  const me = this;
  const data = me.data.data || me.data.datas;
  let objAux = deepcopy(obj);
  if (!(objAux instanceof Array)) {
    objAux = [objAux];
  }
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
    if (cb) {
      cb();
    }
  });
}
/**
 * update row's treeId
 * @param rows
 * @param prefix
 */
function updateTreeId(rows, prefix) {
  if (!rows || !rows.length) {
    return;
  }
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let treeId = prefix ? `${prefix}-${i}` : `${i}`;
    row.__treeId__ = treeId;
    if (row.data) {
      updateTreeId(row.data, treeId);
    }
  }
}

/**
 * remove some items from this.state.data & this.data
 * @param {object/array} obj items to be removed
 */
function removeRecords(obj, cb) {
  const me = this;
  const content = deepcopy(me.state.data);
  const data = content.data || content.datas;
  const treeIdArr = obj.__treeId__.split('-').map(item => parseInt(item, 10));
  let rows = data;
  for (let i = 0; i < treeIdArr.length - 1; i++) {
    const rowIndex = treeIdArr[i];
    rows = rows[rowIndex].data;
  }
  let objAux = deepcopy(obj);
  if (Object.prototype.toString.call(objAux) !== '[object Array]') {
    objAux = [objAux];
  }
  objAux.forEach((item) => {
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      if (element.jsxid === item.jsxid) {
        rows.splice(i, 1);
        break;
      }
    }
  });
  updateTreeId(content.data);
  me.data = content;
  this.setState({
    data: content,
  }, () => {
    if (cb) {
      cb();
    }
  });
}

export default {
  addJSXIdsForRecord,
  addValuesInData,
  insertRecords,
  updateRecord,
  syncRecord,
  removeRecords,
  updateTreeId
};

