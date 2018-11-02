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
// const urlPrefix = 'http://30.9.174.1:3000/';

// 第一列为radio的demo
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 1,
    };
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
    };
    const columns = [
      {
        dataKey: 'select',
        type: 'checkboxSelector',
      },
      {
        group: '分组',
        fixed: true,
        columns: [
          {
            dataKey: 'id',
            title: 'ID',
            width: '50px',
          },
          {
            dataKey: 'country',
            title: '国家',
            width: '200px',
            ordered: true,
          },
        ],
      },
      {
        dataKey: 'city',
        title: () => '城市',
        width: '150px',
        ordered: true,
        message: '都是中国城市',
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
        group: '分组5',
        columns: [
          {
            dataKey: 'id',
            title: 'ID',
            width: '50px',
          },
          {
            dataKey: 'country',
            title: '国家',
            width: '200px',
            ordered: true,
          },
        ],
      },
      {
        group: '分组6',
        columns: [
          {
            dataKey: 'id',
            title: 'ID',
            width: '50px',
          },
          {
            dataKey: 'country',
            title: '国家',
            width: '200px',
            ordered: true,
          },
        ],
      },
      {
        group: '分组7',
        rightFixed: true,
        columns: [
          {
            dataKey: 'id',
            title: 'ID',
            width: '50px',
          },
          {
            dataKey: 'country',
            title: '国家',
            width: '200px',
            ordered: true,
          },
        ],
      },
      {
        dataKey: 'email',
        title: 'Email',
        width: 200,
        ordered: true,
      }, {
        dataKey: 'action1',
        title: '操作1',
        width: 100,
        type: 'action',
        actions: [{
          title: 'click',
          callback() {
            alert('click');
          },
          mode: 'edit',
        }, {
          title: '删除',
          callback() {
            alert('删除');
          },
          mode: 'view',
        }, {
          title: 'view',
          callback() {
            alert('view');
          },
          mode: 'edit',
        }, {
          title: 'view',
          callback() {
            alert('view');
          },
        }],
      }, {
        dataKey: 'action',
        title: '链接',
        width: 100,
        render() {
          return <div><a>111</a></div>;
        },
      },
    ];
    const fetchUrl = 'http://eternalsky.me:8122/file/getGridJson.jsonp';
    const renderProps = {
      pagerSizeOptions: [5, 10, 15, 20],
      actionBar: {
        'Action Button': function () {
          me.setState({
            text: 2,
          });
        },
      },
      width: 1200,
      height: 400,
      showSearch: true,
      showColumnPicker: true,
      fetchUrl,
      rowSelector: 'checkboxSelector',
      jsxcolumns: columns,
      rowSelection,
      // prefixCls: 'aaa',
    };
    return (
      <div>
        <Table
          {...renderProps}
          ref={(c) => { this.table = c; }}
          className="kuma-uxtable-border-line"
        />
        <Button
          onClick={function () {
            me.table.fetchData();
          }}
        >
          重新获取数据
        </Button>
      </div>
    );
  }
}

export default Demo;
