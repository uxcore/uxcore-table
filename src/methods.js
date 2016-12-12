const deepcopy = require('lodash/cloneDeep');
const Const = require('uxcore-const');
const util = require('./util');

function addEmptyRow() {
  this.insertRecords({});
}

function addRow(rowData) {
  this.insertRecords(rowData);
}

function resetRow(rowData) {
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

function delRow(rowData) {
  this.removeRecords(rowData);
}

function editRow(rowData) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.EDIT;
  this.updateRecord(newRowData);
}

function viewRow(rowData) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.VIEW;
  this.updateRecord(newRowData);
}

function saveRow(rowData) {
  const newRowData = deepcopy(rowData);
  newRowData.__mode__ = Const.MODE.VIEW;
  newRowData.__edited__ = true;
  this.syncRecord(newRowData);
}

function saveAllRow() {
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

function editAllRow() {
  const me = this;
  const data = deepcopy(me.data.data || me.data.datas);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.__mode__ = Const.MODE.EDIT;
  }
  this.updateRecord(data);
}

function toggleSubComp(rowData) {
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
    });
  }
}

function toggleTreeExpanded(rowData) {
  const expandedKeys = deepcopy(this.state.expandedKeys);
  util.toggleItemInArr(rowData.jsxid, expandedKeys);
  this.setState({
    expandedKeys,
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
};

