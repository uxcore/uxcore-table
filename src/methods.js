const deepcopy = require('lodash/cloneDeep');
const Const = require('uxcore-const');
const util = require('./util');

function addEmptyRow(cb) {
  this.insertRecords({}, cb);
}

function addRow(rowData, cb) {
  this.insertRecords(rowData, cb);
}

function resetRow(rowData, cb) {
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
  this.updateRecord(updateData, cb);
}

function delRow(rowData, cb) {
  this.removeRecords(rowData, cb);
}

function editRow(rowData, cb) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.EDIT;
  this.updateRecord(newRowData, cb);
}

function viewRow(rowData, cb) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.VIEW;
  this.updateRecord(newRowData, cb);
}

function saveRow(rowData, cb) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.VIEW;
  newRowData.__edited__ = true;
  this.syncRecord(newRowData, cb);
}

function saveAllRow(cb) {
  const me = this;
  const data = deepcopy(me.state.data.data || me.state.data.datas);
  // data.forEach((item) => {
  //   me.saveRow(item);
  // });
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.__mode__ = Const.MODE.VIEW;
    item.__edited__ = true;
  }
  this.syncRecord(data, cb);
}

function editAllRow(cb) {
  const me = this;
  const data = deepcopy(me.data.data || me.data.datas);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.__mode__ = Const.MODE.EDIT;
  }
  this.updateRecord(data, cb);
}

function toggleSubComp(rowData, cb) {
  const content = deepcopy(this.state.data);
  const data = content.data || content.datas;

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
    }, () => {
      if (cb) {
        cb();
      }
    });
  }
}

function moveRowUp(rowData, cb) {
  const content = deepcopy(this.state.data);
  const data = content.data || content.datas;
  if (data) {
    const treeIdArr = rowData.__treeId__.split('-');
    let rows = data;
    for (let i = 0; i < treeIdArr.length - 1; i++) {
      const rowIndex = treeIdArr[i];
      rows = rows[rowIndex].data;
    }
    const lastIndex = treeIdArr.pop();
    if (lastIndex > 0) {
      rows.splice(lastIndex, 1);
      // change treeId before setState;
      rows[lastIndex - 1].__treeId__ = treeIdArr.concat([lastIndex]).join('-');
      rows.splice(lastIndex - 1, 0, { ...rowData, __treeId__: treeIdArr.concat([lastIndex - 1]).join('-') });
      this.data = content;
      this.setState({
        data: content,
      }, () => {
        if (cb) {
          cb();
        }
      });
    }
  }
}

function moveRowDown(rowData, cb) {
  const content = deepcopy(this.state.data);
  const data = content.data || content.datas;
  if (data) {
    const treeIdArr = rowData.__treeId__.split('-').map(item => parseInt(item, 10));
    let rows = data;
    for (let i = 0; i < treeIdArr.length - 1; i++) {
      const rowIndex = treeIdArr[i];
      rows = rows[rowIndex].data;
    }
    const lastIndex = treeIdArr.pop();
    if (lastIndex < rows.length - 1) {
      // change treeId before setState;
      rows[lastIndex + 1].__treeId__ = treeIdArr.concat([lastIndex]).join('-');
      rows.splice(lastIndex, 1);
      rows.splice(lastIndex + 1, 0, { ...rowData, __treeId__: treeIdArr.concat([lastIndex + 1]).join('-') });
      this.data = content;
      this.setState({
        data: content,
      }, () => {
        if (cb) {
          cb();
        }
      });
    }
  }
}

function getData(validate) {
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
    data.data = data.data.filter(item => item !== undefined);
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

function toggleTreeExpanded(rowData, cb) {
  const expandedKeys = deepcopy(this.state.expandedKeys);
  util.toggleItemInArr(rowData.jsxid, expandedKeys);
  this.setState({
    expandedKeys,
  }, () => {
    if (cb) {
      cb();
    }
  });
}

module.exports = {
  addEmptyRow,
  addRow,
  resetRow,
  delRow,
  editAllRow,
  editRow,
  viewRow,
  saveAllRow,
  saveRow,
  toggleSubComp,
  toggleTreeExpanded,
  getData,
  moveRowUp,
  moveRowDown,
};

