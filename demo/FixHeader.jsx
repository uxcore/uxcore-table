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
      columns: [
        {
          dataKey: 'firstName',
          title: <span>自定义列头</span>,
          // fixed: true,
          width: '15%',
          textOverflow: 'ellipse',
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
          title: '自定义猎头',
          message: 'nihao',
          isDisable: function() {
            return true
          },
          // fixed: true,
          // rightFixed: true
          width: '25%',
        },
        {
          dataKey: 'email',
          title: 'Email',
          width: '20%',
          ordered: true,
          message: `sadfsdf\nnsafdasdfasdf`
        },
        {
          title: '操作1',
          width: '200px',
          type: 'action',
          // rightFixed: true,
          actions: [{
            title: '点击',
            callback: () => {
            },
            mode: 'edit',
          }, {
            title: '删除',
            callback: (rowData) => {
              this.table.delRow(rowData)
            },
            mode: 'view',
          }, {
            title: '查看',
            callback: () => { },
            mode: 'edit',
          }, {
            title: '查看',
            callback: () => { },
          }],
        },
      ]
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
    const columns = this.state.columns
    const fetchUrl = 'http://eternalsky.me:8122/file/getGridJson.jsonp';
    const renderProps = {
      actionColumn: {
        edit: () => { },
        del: () => { },
      },
      columnResizeable: true,
      fixHeaderToTop: true,
      // fixHeaderOffset: 54,
      // fixActionBarToTop: true,
      toggleSubCompOnRowClick: true,
      // width: 800,
      // className: 'kuma-uxtable-split-line',
      className: 'kuma-uxtable-border-line',
      pagerSizeOptions: [5, 10, 15, 20],
      rowSelection,
      useListActionBar: true,
      actionBar: {
        search: {
          placeholder: '请输入搜索关键字',
          onSearch() {
            console.log(234234)
          }
        }
      },
      // locale:'en-us',
      onSearch: (searchTxt) => {
        console.log(searchTxt);
      },
      onOrder: (column, orderType) => {
        console.log(column, orderType);
      },
      onPagerChange: (current, pageSize) => {
        console.log(current, pageSize);
      },
      showSearch: false,
      fetchUrl,
      beforeFetch: (data, from, config) => {
        console.log(data, from, config);
        return data;
      },
      // height: 400,
      // addRowClassName() {
      //   return 'multiline';
      // },
      rowSelector: 'checkboxSelector',
      jsxcolumns: columns,
      needCheckRightFixed: true,
      leftFixedMaxWidth: 900,
      // size: 'small',
      // rowSelection,
      onColumnPick: (columns) => {
        console.log(columns);
      }
    };
    return (
      <div className="demo1">
      {me.state.showTable
        ? <Table {...renderProps} ref={function saveRef(c) { me.table = c; }} />
        : null}
      {me.state.showTable
        ? <Table {...{
          actionColumn: {
            edit: () => { },
            del: () => { },
          },
          columnResizeable: true,
          fixHeaderToTop: true,
          // fixHeaderOffset: 54,
          // fixActionBarToTop: true,
          toggleSubCompOnRowClick: true,
          // width: 800,
          // className: 'kuma-uxtable-split-line',
          className: 'kuma-uxtable-border-line',
          pagerSizeOptions: [5, 10, 15, 20],
          rowSelection,
          // locale:'en-us',
          // showColumnPicker: true,
          // showColumnPickerCheckAll: true,
          // useListActionBar: true,
          // actionBar: {
          //   className: 'my-list-action-bar',
          //   // 是否显示全选
          //   showSelectAll: true,
          //   // 按钮配置
          //   buttons: [
          //     {
          //       title: 'Action Button',
          //       render() {
          //         return (
          //           <Button type={'primary'}>切换子表格状态</Button>
          //         )
          //       },
          //       keepActiveInCustomView: false,
          //       callback: () => {
          //         this.forceUpdate();
          //         console.log(me.table.getData());
          //         me.table.toggleSubComp(me.table.getData().data.datas);
          //       },
          //     },
          //     {
          //       title: '按钮',
          //       keepActiveInCustomView: false,
          //       // size: 'large',
          //       type: 'primary',
          //       // className: 'xxxxx',
          //       callback: () => {
          //         me.table.selectAll(true);
          //       }
          //     }
          //   ],
          //   // 文案提示
          //   actionBarTip: '已经为您找到记录123条',
          //   // 自定义内容
          //   customBarItem: {
          //     render() {
          //       return (
          //         <p style={{color: 'red'}} onClick={(e) => {console.log(e)}}>自定义内容</p>
          //       )
          //     }
          //   },
          //   // 行排序
          //   rowOrder: {
          //     iconName: 'paixu-jiangxu',
          //     // keepActiveInCustomView: true,
          //     defaultValue: {
          //       text: '排序方式一',
          //       value: '123'
          //     },
          //     items: [
          //       {
          //         text: '排序方式一',
          //         value: '123'
          //       },
          //       {
          //         text: '排序方式二',
          //         value: '456'
          //       }
          //     ],
          //     onChange(data) {
          //       console.log(data)
          //     }
          //   },
          //   // 列排序
          //   columnsOrder: {
          //     iconName: 'huxiangguanzhu',
          //     // keepActiveInCustomView: true,
          //     title: '列排序',
          //     includeActionColumn: false,  // 优先级低于fixed和rightFixed
          //     onChange(dragInfo, data) {
          //       console.log(data)
          //     }
          //   },
          //   // 列选择
          //   columnsPicker: {
          //     iconName: 'zidingyilie',
          //     title: '自定义列',
          //     keepActiveInCustomView: false,
          //     setPickerGroups(columns) {
          //       return [
          //         {
          //           title: '分组1',
          //           columns: columns.filter((item, index) => {return index >= 1})
          //         },
          //         {
          //           title: '分组2',
          //           columns: columns.filter((item, index) => {return index <= 0})
          //         }
          //       ]
          //     },
          //     onChange(data) {
          //       console.log(data)
          //     }
          //   },
          //   // 自定义视图，支持返回promise和component
          //   customView: {
          //     render(data, currentPage) {
          //       console.log(data, currentPage);
          //       // return (
          //       //   <Test name={'自定义的View'}/>
          //       // )
          //       return new Promise(function(resolve) {
          //         setTimeout(() => {
          //           resolve(<Test name={'自定义的View'}/>)
          //         })
          //       })
          //     }
          //   },
          //   // 是否显示翻页器
          //   showMiniPager: true,
          //   search: {
          //     // placeholder: '请输入搜索关键字',
          //     onSearch() {
          //       console.log(234234)
          //     }
          //   },
          //   // 在自定义视图下移出翻页器
          //   removePagerInCustomView: true,
          //   linkBar: [
          //     {
          //       title: '修改columns',
          //       callback: () => {
          //         this.setState({
          //           columns: this.state.columns.filter(item => {
          //             return item.title === 'LastName'
          //               || item.title === 'Email'
          //               || item.title === '操作1'
          //           })
          //         })
          //       },
          //     },
          //     {
          //       title: '操作外链二',
          //       callback: () => {
          //       },
          //     },
          //   ],
          // },
          // onSearch: (searchTxt) => {
          //   console.log(searchTxt);
          // },
          onOrder: (column, orderType) => {
            console.log(column, orderType);
          },
          onPagerChange: (current, pageSize) => {
            console.log(current, pageSize);
          },
          showSearch: false,
          fetchUrl,
          beforeFetch: (data, from, config) => {
            console.log(data, from, config);
            return data;
          },
          // height: 400,
          // addRowClassName() {
          //   return 'multiline';
          // },
          rowSelector: 'checkboxSelector',
          needCheckRightFixed: true,
          leftFixedMaxWidth: 900,
          // size: 'small',
          // rowSelection,
          onColumnPick: (columns) => {
            console.log(columns);
          },
        }} jsxcolumns={[
          {
            dataKey: 'firstName',
            title: <span>自定义列头</span>,
            // fixed: true,
            width: '15%',
            textOverflow: 'ellipse',
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
            title: '自定义猎头',
            message: 'nihao',
            isDisable: function() {
              return true
            },
            // fixed: true,
            // rightFixed: true
            width: '25%',
          }
        ]} ref={function saveRef(c) { me.table1 = c; }} />
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
