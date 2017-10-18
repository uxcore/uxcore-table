/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';

import Button from 'uxcore-button';
import Table from '../src';

const urlPrefix = window.urlPrefix || 'http://30.9.174.1:3000/';
const mockData = {
  data: [
    {
      check: true,
      id: '1',
      grade: 'grade1',
      email: 'email1email1email1email',
      firstName: 'firstName1',
      lastName: 'lastName1',
      birthDate: 'birthDate1',
      country: '086156529655931.121(xsxs)',
      city: '87181',
    },
    {
      check: false,
      id: '1',
      grade: 'grade1',
      email: 'email1email1email1email',
      firstName: 'firstName1',
      lastName: 'lastName1',
      birthDate: 'birthDate1',
      country: '086156529655931.121(xsxs)',
      city: '87181',
    },
  ],
};


class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentWillUpdate() {
    // this.table.fetchData();
  }


  handleClick() {
    mockData.datas[0].check = !mockData.datas[0].check;
    this.forceUpdate();
  }

  render() {
    const me = this;
    const columns = [
      { dataKey: 'check', title: '复选框', type: 'checkboxSelector' },
      { dataKey: 'id', title: 'ID', width: 50, hidden: true },
      {
        dataKey: 'country',
        title: '国家国家',
        width: 200,
        ordered: true,
        type: 'money',
        delimiter: ',',
      },
      {
        group: '大表头测试',
        columns: [
          { dataKey: 'city', title: '城市', width: 150 },
          {
            dataKey: 'firstName',
            title: 'FristName',
          },
          { dataKey: 'lastName', title: 'LastName' },
        ],
      },
      { dataKey: 'email', title: 'Email', width: 200, ordered: true },
      {
        dataKey: 'action1',
        title: '操作1',
        width: 100,
        type: 'action',
        actions: {
          编辑(rowData, actions) {
            console.log(actions.addEmptyRow);
            me.table.toggleSubComp(rowData);
          },
          删除(rowData) {
            me.table.delRow(rowData);
          },
        },
        beforeRender(rowData) {
          if (rowData.jsxid % 2 === 0) {
            return ['编辑'];
          }
          return ['编辑', '删除'];
        },
      },
      {
        dataKey: 'action',
        title: '链接',
        width: 150,
        render(cellData, rowData) {
          return <div><a>{rowData.email}</a></div>;
        },
        beforeRender(rowData) {
          return rowData.email;
        },
      },
    ];

    const renderProps = {
      height: 400,
      width: 1000,
      actionBar: {
        新增(type, actions) { console.info(actions); alert(type); },
        黄山(type) { alert(type); },
      },
      mode: 'view',
      showSearch: true,
      fetchParams: {},
      // jsxdata: mockData,
      // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
      fetchUrl: `${urlPrefix}demo/data.json`,
      jsxcolumns: columns,
      emptyText: '没有',
      // subComp:(<Grid {...renderSubProps}  ref="subGrid"/>),
      // rowSelection: rowSelection,
      addRowClassName: () => { },
      beforeFetch: (sendData) => sendData,
      processData: (data) => data,
    };
    return (
      <div>
        <Table {...renderProps} ref={(c) => { this.table = c; }} />
        <Button onClick={me.handleClick.bind(me)}>页面重新渲染</Button>
      </div>
    );
  }
}

export default Demo;
