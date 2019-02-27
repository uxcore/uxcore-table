import deepcopy from 'lodash/cloneDeep';
import Const from 'uxcore-const';
import util from './util';

function addEmptyRow(cb) {
  this.insertRecords({}, false, cb);
}

function addEmptyRowFromTop(cb) {
  this.insertRecords({}, true, cb);
}

function addRow(rowData, cb) {
  this.insertRecords(rowData, false, cb);
}

function addRowFromTop(rowData, cb) {
  this.insertRecords(rowData, true, cb);
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
  this.updateRecord(updateData, () => {
    this.doValidate();
    if (cb) { cb(updateData); }
  });
}

function resetAllRow(cb) {
  const me = this;
  const copyData = deepcopy(me.data);
  const stateData = me.state.data.data || me.state.data.datas;
  if (copyData.data || copyData.datas) {
    const data = copyData.data || copyData.datas;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      stateData.forEach((stateItem) => {
        if (item.jsxid === stateItem.jsxid) {
          item.__mode__ = stateItem.__mode__;
        }
      });
    }
    this.setState({
      data: copyData,
    }, () => {
      this.doValidate();
      if (cb) {
        cb();
      }
    });
  }
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

function viewAllRow(cb) {
  const me = this;
  const data = deepcopy(me.state.data.data || me.state.data.datas);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.__mode__ = Const.MODE.VIEW;
  }
  this.updateRecord(data, cb);
}

function resetAndViewAllRow(cb) {
  const me = this;
  const data = deepcopy(me.data.data || me.data.datas);
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.__mode__ = Const.MODE.VIEW;
  }
  this.updateRecord(data, cb);
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
  const rows = Array.isArray(rowData) ? rowData : [rowData];


  if (data) {
    rows.forEach((row) => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.jsxid === row.jsxid) {
          item.showSubComp = !item.showSubComp;
          break;
        }
      }
    });
    this.syncRecord(data, cb);
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
      rows.splice(lastIndex - 1, 0, { ...rowData, __treeId__: treeIdArr.concat([lastIndex - 1]).join('-') });
      this.data = content;
      this.updateTreeId(content.data);
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
      rows.splice(lastIndex, 1);
      rows.splice(lastIndex + 1, 0, { ...rowData, __treeId__: treeIdArr.concat([lastIndex + 1]).join('-') });
      this.data = content;
      this.updateTreeId(content.data);
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

function doValidate() {
  let pass = true;
  const me = this;
  const fieldKeys = Object.keys(me.fields);
  fieldKeys.forEach((name) => {
    const fieldPass = me.fields[name]();
    // if one field fails to pass, the table fails to pass
    if (pass) {
      pass = fieldPass;
    }
  });
  return pass;
}

function getData(validate) {
  const me = this;
  let pass = true;
  if (validate !== false) {
    pass = this.doValidate();
  }
  if (me.props.getSavedData) {
    // 滤除可能为空的元素
    const data = deepcopy(me.data);
    if (data && data.data instanceof Array) {
      data.data = data.data.filter(item => item !== undefined);
    }
    return {
      data,
      pass,
    };
  }
  return {
    data: deepcopy(me.state.data),
    pass,
  };
}

function changeTreeExpandState({ tableData, rowData }, cb = () => {}) {
  const expandedKeys = deepcopy(this.state.expandedKeys);
  util.toggleItemInArr(rowData.jsxid, expandedKeys);
  const filteredTreeLoadingIds = this.state.treeLoadingIds.filter(id => id !== rowData.__treeId__);
  if (tableData) {
    const newData = {
      ...this.state.data,
      data: [...tableData]
    }
    this.data = newData;
    this.setState({
      treeLoadingIds: filteredTreeLoadingIds,
      expandedKeys,
      data: newData,
    }, () => {
      cb();
    });
  } else {
    this.setState({
      treeLoadingIds: filteredTreeLoadingIds,
      expandedKeys,
    }, () => {
      cb();
    });
  }
}

function toggleTreeExpanded(rowData, cb) {
  const { loadTreeData } = this.props;
  const { treeLoadingIds } = this.state;
  if (Array.isArray(rowData.data) && !rowData.data.length && loadTreeData) {
    const newTreeLoadingIds = [...treeLoadingIds];
    newTreeLoadingIds.push(rowData.__treeId__);
    this.setState({
      treeLoadingIds: newTreeLoadingIds,
    });
    const loadedResult = loadTreeData(rowData);
    const loadedAction = (content) => {
      const { tableData, newRowData } = this.addDataToSelectedRow(content, rowData);
      this.changeTreeExpandState({ tableData, rowData: newRowData }, cb);
    };
    if (typeof loadedResult === 'object' && loadedResult.then) {
      loadedResult.then((content) => {
        loadedAction(content);
      });
    } else {
      loadedAction(loadedResult);
    }
  } else {
    this.changeTreeExpandState({ rowData }, cb);
  }
}

function addDataInRow(table, treeId, newData) {
  const tableData = deepcopy(table.data);
  const rowPositionArr = treeId.split('-');
  let temp = tableData;
  let index;
  let newRowData;
  for (let i = 0; i < rowPositionArr.length; i++) {
    index = rowPositionArr[i];
    if (i === rowPositionArr.length - 1) {
      newRowData = temp[index];
      newRowData.data = newData;
    } else {
      temp = temp[index].data;
    }
  }
  return { tableData, newRowData };
}

function addDataToSelectedRow(content, rowData) {
  const me = this;
  const {
    tableData,
    newRowData,
  } = this.addDataInRow(me.state.data, rowData.__treeId__, content.data);
  const processedData = me.addValuesInData({ data: tableData }, 'reset') || {};
  return { tableData: processedData, newRowData };
}

export default {
  addEmptyRow,
  addEmptyRowFromTop,
  addRow,
  addRowFromTop,
  resetRow,
  resetAllRow,
  delRow,
  editRow,
  editAllRow,
  viewRow,
  viewAllRow,
  resetAndViewAllRow,
  saveRow,
  saveAllRow,
  toggleSubComp,
  addDataInRow,
  addDataToSelectedRow,
  changeTreeExpandState,
  toggleTreeExpanded,
  doValidate,
  getData,
  moveRowUp,
  moveRowDown,
};
