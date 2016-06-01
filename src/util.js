// For changeTreeSelected in Table.js
const changeValueR = (data, key, value) => {
    if (data.data && data.data instanceof Array) {
        data.data.forEach((item) => {
            item[key] = value;
            changeValueR(item, key, value);
        })
    }
}

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
}

// depth-first recursion of multi branches tree
const getAllSelectedRows = (rowData, checkboxColumnKey) => {
    let selectedRows = [];
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
}

// TODO cache row tree set
const getRowTreeSet = (rowData) => {
    let stack = [];
    // put first level data into stack
    stack.push(rowData);
    while (stack.length) {
        item = stack.shift();
        if (item.data) {
            stack = stack.concat(item.data);
        }
    }
}

module.exports = {
    getIEVer: () => {
        if (window) {
            const ua = window.navigator.userAgent;
            const idx = ua.indexOf('MSIE');
            if (idx > 0) {
                // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727)" 
                return parseInt(ua.substring(idx + 5, ua.indexOf(".", idx)));
            }
            if (!!ua.match(/Trident\/7\./)) {
                // "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; rv:11.0) like Gecko"
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
        }
        else {
            arr.push(item);
        }
        return arr;
    },
    changeValueR: changeValueR,
    isRowHalfChecked: isRowHalfChecked,
    getAllSelectedRows: getAllSelectedRows
}