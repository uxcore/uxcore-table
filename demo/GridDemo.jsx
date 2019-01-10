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
import Promise from 'lie'

class Test extends React.Component {
  render() {
    return (
      <div>{this.props.name}</div>
    )
  }
}

/**
 * @name Demo的标题
 * @description Demo的描述，使用 react-docgen 挖出对应的内容，并作为组件站点 md 生成的源。
 */
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
      {
        dataKey: 'firstName',
        title: <span>123123123</span>,
        // fixed: true,
        // width: '15%',
        filters: [{
          text: 'Joe',
          value: 'Joe',
        }, {
          text: 'Jimmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
          value: 'Jim',
        }, {
          text: 'Submenu',
          value: 'Submenu',
          children: [{
            text: 'Green',
            value: 'Green',
          }, {
            text: 'Black',
            value: 'Black',
          }],
        }],
        message: '这是一个提示',
        ordered: true,
      },

      {
        dataKey: 'lastName',
        title: 'LastName',
        message: 'nihao',
        isDisable: function() {
          return true
        },
        // fixed: true,
        // rightFixed: true
        // width: '55%',
      },
      {
        dataKey: 'email',
        title: 'Email',
        // width: '30%',
        ordered: true,
        message: `sadfsdf\nnsafdasdfasdf`
      },
      {
        title: '操作1',
        width: '200px',
        type: 'action',
        // fixed: false,
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
      },

    ];
    const fetchUrl = 'http://eternalsky.me:8122/file/getGridJson.jsonp';
    const renderProps = {
      actionColumn: {
        edit: () => { },
        del: () => { },
      },
      toggleSubCompOnRowClick: true,
      // width: 800,
      className: 'kuma-uxtable-split-line',
      pagerSizeOptions: [5, 10, 15, 20],
      rowSelection,
      showColumnPicker: true,
      showColumnPickerCheckAll: true,
      actionBar: {
        className: 'my-list-action-bar',
        // 是否使用list-action-bar模式
        useListActionBar: true,
        // 是否显示全选
        showSelectAll: true,
        // 按钮配置
        buttons: [
          {
            title: 'Action Button',
            render() {
              return (
                <p>123123</p>
              )
            },
            keepActiveInCustomView: false,
            callback: () => {
              this.forceUpdate();
              console.log(me.table.getData());
              me.table.toggleSubComp(me.table.getData().data.datas);
            },
          },
          {
            title: '123123',
            keepActiveInCustomView: false,
            // size: 'large',
            type: 'primary',
            // className: 'xxxxx',
            callback: () => {
              me.table.selectAll(true);
            }
          }
        ],
        // 文案提示
        actionBarTip: '已经为您找到记录123条',
        // 自定义内容
        // renderCustomBarItem() {
        //   return (
        //     <p>自定义内容</p>
        //   )
        // },
        // 行排序
        rowOrder: {
          iconName: 'paixu-jiangxu',
          // keepActiveInCustomView: true,
          defaultValue: {
            text: '行排序',
            value: '123'
          },
          items: [
            {
              text: '行排序',
              value: '123'
            },
            {
              text: '排序方式',
              value: '456'
            }
          ],
          onChange(data) {
            console.log(data)
          }
        },
        // 列排序
        columnsOrder: {
          iconName: 'huxiangguanzhu',
          // keepActiveInCustomView: true,
          title: '列排序',
          includeActionColumn: true,  // 优先级低于fixed和rightFixed
          onChange(dragInfo, data) {
            console.log(data)
          }
        },
        // 列选择
        columnsPicker: {
          iconName: 'zidingyilie',
          title: '列选择器',
          // keepActiveInCustomView: true,
          onChange(data) {
            console.log(data)
          }
        },
        // 自定义视图，支持返回promise和component
        renderCustomView(data, currentPage) {
          console.log(data, currentPage);
          // return (
          //   <Test name={'1231323123'}/>
          // )
          return new Promise(function(resolve) {
            setTimeout(() => {
              resolve(<Test name={'1231323123'}/>)
            })
          })
        },
        // 是否显示翻页器
        showPager: true,
        // 在自定义视图下是否显示翻页器
        removePagerInCustomView: false
      },
      // actionBar: [
      //   {
      //     title: 'Action Button',
      //     callback: () => {
      //       this.forceUpdate();
      //       console.log(me.table.getData());
      //       me.table.toggleSubComp(me.table.getData().data.datas);
      //     },
      //   },
      //   {
      //     title: '123123',
      //     callback: () => {
      //       me.table.selectAll(true);
      //       console.log(123123)
      //     }
      //   }
      // ],
      // actionBar: {
      //   'Action Button': () => {
      //     this.forceUpdate();
      //     console.log(me.table.getData());
      //     me.table.toggleSubComp(me.table.getData().data.datas);
      //   },
      //   '123123': () => {
      //     me.table.selectAll(true);
      //     console.log(123123)
      //   }
      // },
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
      beforeFetch: (data, from, config) => {
        console.log(data, from, config);
        return data;
      },
      // height: 400,
      // addRowClassName() {
      //   return 'multiline';
      // },
      rowSelector: function(props) {
        return 'checkboxSelector'
      }, //'checkboxSelector',
      jsxcolumns: columns,

      leftFixedMaxWidth: 900,
      // size: 'small',
      // rowSelection,
      onColumnPick: (columns) => {
        console.log(columns);
      },
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
              {
                id: '001', class: 'API管理系统', dep: '用户体验部', person: '大圣',
              },
              {
                id: '002', class: 'API管理系统', dep: '用户体验部', person: '大圣',
              },
              {
                id: '003', class: 'API管理系统', dep: '用户体验部', person: '大圣',
              },
              {
                id: '004', class: 'API管理系统', dep: '用户体验部', person: '大圣',
              },
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
        >
          重新获取数据
        </Button>
        <Button onClick={this.toggleShowTable}>
          卸载/恢复组件
        </Button>
      </div>
    );
  }
}

export default Demo;
