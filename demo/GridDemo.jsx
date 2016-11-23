/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const Button = require('uxcore-button');
const React = require('react');

const Table = require('../src');

// const urlPrefix = 'http://192.168.99.117:3000/';

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
    };
    const columns = [
      {
        dataKey: 'select',
        type: 'checkboxSelector',
      },
      {
        dataKey: 'id',
        title: 'ID',
        width: 50,
        hidden: true,
      },
      {
        dataKey: 'country',
        title: '国家',
        width: 200,
        ordered: true,
      },
      {
        dataKey: 'city',
        title: '城市',
        width: 150,
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
          callback: () => {},
          mode: 'edit',
        }, {
          title: 'view',
          callback: () => {},
        }],
      }, {
        dataKey: 'action',
        title: '链接',
        width: 100,
        render: () => <div><a>111</a></div>,
      },
    ];
    const fetchUrl = 'http://eternalsky.me:8122/file/getGridJson.jsonp';
    const renderProps = {
      actionColumn: {
        edit: () => {},
        del: () => {},
      },
      width: 800,
      height: 400,
      // className: 'kuma-uxtable-border-line',
      pagerSizeOptions: [5, 10, 15, 20],
      actionBar: {
        'Action Button': () => {
          me.setState({
            text: 2,
          });
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
      addRowClassName() {
        return 'multiline';
      },
      rowSelector: 'checkboxSelector',
      jsxcolumns: columns,
      rowSelection,
      renderSubComp: rowData =>
        (<div className="sub-box">
          <div className="sub-country">{`当前国家: ${rowData.country}`}</div>
          <div className="sub-city">{`当前城市: ${rowData.city}`}</div>
        </div>),
    };
    return (
      <div>
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

module.exports = Demo;
