/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const Table = require('../src');
const React = require('react');

const urlPrefix = window.urlPrefix || 'http://30.9.174.1:3000/';


class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const columns = [
      {
        dataKey: 'id',
        title: 'ID',
        width: 50,
        hidden: true,
      },
      {
        dataKey: 'country',
        title: '国家国家国家国家',
        width: 200,
        ordered: true,
        type: 'money',
        fixed: true,
        delimiter: ',',
      },
      {
        dataKey: 'city',
        title: '城市',
        width: 150,
      },
      {
        dataKey: 'firstName',
        title: 'FristName',
      },
      {
        dataKey: 'lastName',
        title: 'LastName',
      },
      {
        dataKey: 'email',
        title: 'Email',
        width: 200,
        ordered: true,
      },
      {
        title: '操作',
        type: 'action',
        actions: [
          {
            title: '上移',
            callback: (rowData) => { this.table.moveRowUp(rowData); },
          },
          {
            title: '下移',
            callback: (rowData) => { this.table.moveRowDown(rowData); },
          },
        ],
      },
    ];

    const renderProps = {
      height: 400,
      width: 1000,
      showSearch: true,
      levels: 2,
      fetchUrl: `${urlPrefix}demo/data.json`,
      jsxcolumns: columns,
      renderModel: 'tree',
      rowSelection: {
        onSelect: (checked, selectedRow, selectedRows) => {
          console.log(checked, selectedRow, selectedRows);
        },
        onSelectAll: () => {},
      },
      ref: (c) => {
        this.table = c;
      },
    };
    return (<Table {...renderProps} />);
  }
}

module.exports = Demo;
