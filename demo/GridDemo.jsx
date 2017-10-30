/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import Button from 'uxcore-button';

import React from 'react';
import Table from '../src';

const urlPrefix = 'http://30.6.61.25:3000/';

//* 第一列为radio的demo
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 1,
      showTable: true,
    };
    this.toggleShowTable = this.toggleShowTable.bind(this);
  }

  toggleShowTable() {
    this.setState({
      showTable: !this.state.showTable,
    });
  }
  render() {
    const me = this;
    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
      },
      onSelectAll(selected, selectedRows) {
        console.log(selected, selectedRows);
      },
      // isDisabled: rowData => true,
    };
    const columns = [
      // {
      //   dataKey: 'select',
      //   type: 'checkboxSelector',
      //   // isDisable: rowData => /c/.test(rowData.country),
      // },
      {
        dataKey: 'id',
        title: 'ID',
        width: '50px',
        hidden: true,
      },
      {
        dataKey: 'country',
        // fixed: true,
        title: '国家',
        width: '200px',
        ordered: true,
        hidden: true,
      },
      {
        dataKey: 'city',
        title: '城市',
        width: '150px',
        ordered: true,
        message: '都是中国城市',
        hidden: true,
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
      }, {
        dataKey: 'action1',
        title: '操作1',
        width: '200px',
        // rightFixed: true,
        type: 'action',
        actions: [{
          title: 'click',
          callback: () => {
          },
          mode: 'edit',
        }, {
          title: '删除',
          callback: () => {
          },
          mode: 'view',
        }, {
          title: 'view',
          callback: () => { },
          mode: 'edit',
        }, {
          title: 'view',
          callback: () => { },
        }],
      }, {
        dataKey: 'action',
        title: '链接',
        width: '100px',
        render: () => <div><a>111</a></div>,
      },
    ];
    const fetchUrl = 'http://eternalsky.me:8122/file/getGridJson.jsonp';
    // const fetchUrl = `${urlPrefix}demo/data.json`;
    const renderProps = {
      actionColumn: {
        edit: () => { },
        del: () => { },
      },
      width: 800,
      // height: 400,
      // className: 'kuma-uxtable-border-line',
      pagerSizeOptions: [5, 10, 15, 20],
      actionBar: {
        'Action Button': () => {
          console.log(me.table.getData());
        },
      },
      onSearch: (searchTxt) => {
        console.log(searchTxt);
      },
      onOrder: (column, orderType) => {
        console.log(column, orderType);
      },
      onPagerChange: (current, pageSize) => {
        console.log(current, pageSize);
      },
      showSearch: true,
      fetchUrl,
      jsxdata: {
        data: [],
      },
      // addRowClassName() {
      //   return 'multiline';
      // },
      rowSelector: 'checkboxSelector',
      jsxcolumns: columns,
      showColumnPicker: true,
      // size: 'small',
      rowSelection,
      renderSubComp: (rowData) => {
        const subProps = {
          jsxcolumns: [
            {
              dataKey: 'id',
              title: '序号',
            },
            {
              dataKey: 'class',
              title: '分类',
              width: '200px',
            },
            {
              dataKey: 'dep',
              title: '部门',
              width: '200px',
            },
            {
              dataKey: 'person',
              title: '采购员',
              width: '200px',
            },
          ],
          jsxdata: {
            data: [
              { id: '001', class: 'API管理系统', dep: '用户体验部', person: '大圣' },
              { id: '002', class: 'API管理系统', dep: '用户体验部', person: '大圣' },
              { id: '003', class: 'API管理系统', dep: '用户体验部', person: '大圣' },
              { id: '004', class: 'API管理系统', dep: '用户体验部', person: '大圣' },
            ],
          },
          className: 'kuma-uxtable-ghost',
        };
        return (
          <div style={{ padding: '0 24px', background: 'rgba(31,56,88,0.04)' }}>
            <Table {...subProps} />
          </div>
        );
      },
    };
    return (
      <div className="demo1">
        {me.state.showTable
          ? <Table {...renderProps} ref={function saveRef(c) { me.table = c; }} />
          : null}
        <Button
          onClick={() => {
            me.table.fetchData();
          }}
        >重新获取数据</Button>
        <Button onClick={this.toggleShowTable}>卸载/恢复组件</Button>
      </div>
    );
  }
}

export default Demo;
