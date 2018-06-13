/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Table from '../src';
import NattyFetch from 'natty-fetch';

const urlPrefix = window.urlPrefix || 'http://30.9.174.1:3000/';

function loadTreeData(rowData) {
  const request = NattyFetch.create({
    method: 'GET',
    url: `${urlPrefix}demo/rowData.json`,
    data: '',
    Promise,
  });
  return request();
}

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
        width: '50px',
        hidden: true,
      },
      {
        dataKey: 'country',
        title: '国家',
        width: '200px',
        ordered: true,
        align: 'left',
        type: 'money',
        // fixed: true,
        delimiter: ',',
      },
      {
        dataKey: 'city',
        title: '城市',
        width: '150px',
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
        width: '200px',
        ordered: true,
      },
      {
        title: '操作',
        type: 'action',
        width: '200px',
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
      height: '400px',
      width: '1000px',
      showSearch: true,
      levels: 0,
      fetchUrl: `${urlPrefix}demo/data.json`,
      loadTreeData,
      jsxcolumns: columns,
      renderModel: 'tree',
      toggleTreeExpandOnRowClick: true,
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

export default Demo;
