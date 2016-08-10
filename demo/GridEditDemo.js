/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const Validator = require('uxcore-validator');
const Button = require('uxcore-button');
const Select = require('uxcore-select2');
const RadioGroup = require('uxcore-radiogroup');
const Table = require('../src');
const RadioField = require('./RadioField');
// const PlaceSelect = require('./PlaceSelect');
const Constants = require('uxcore-const');
const React = require('react');

const { Option } = Select;
const RadioItem = RadioGroup.Item;

const mockData = {
  data: [
    {
      email: 'xw@abc.com',
      nameId: 'xiaowang',
      name: '小王',
      cityId: 'bj',
      city: '北京',
    },
    {
      email: 'xl@abc.com',
      nameId: 'xiaoli',
      name: '小李',
      cityId: 'hz',
      city: '杭州',
    },
  ],
  currentPage: 2,
  totalCount: 30,
};

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: mockData,
      showOtherColumn: false,
    };
  }


  getTableValues() {
    console.log(this.refs.grid.getData());
  }

  handleTableChange(data) {
    console.log(data);
  }

  handleDataChange() {
    const me = this;
    me.setState({
      data: {
        data: [
          {
            email: 'xw@abc.com',
            nameId: 'xiaowang',
            name: '小王',
            cityId: 'bj',
            city: '北京',
          },
          {
            email: 'xl@abc.com',
            nameId: 'xiaoli',
            name: '小李',
            cityId: 'hz',
            city: '杭州',
          },
          {
            email: 'xl@abc.com',
            nameId: 'xiaoli',
            name: '小李',
            cityId: 'hz',
            city: '杭州',
          },
        ],
      },
    });
  }

  render() {
    const me = this;
    const columns = [
      {
        dataKey: 'jsxid',
        title: 'jsxid2',
        width: 80,
        fixed: true,
      },
      {
        dataKey: 'city',
        editKey: 'cityId',
        title: '城市',
        width: 200,
        type: 'select',
        renderChildren: () => {
          return [{
            id: 'bj',
            name: '北京',
          }, {
            id: 'hz',
            name: '杭州',
          }].map((item) => <Option key={item.id}>{item.name}</Option>);
        },
        config: {
          filterOption: false,
        },
        canEdit: (rowData) => rowData.name !== '小王',
        rules: {
          validator: () => false,
          errMsg: '出错了',
        },
      },
      {
        dataKey: 'name',
        editKey: 'nameId',
        title: '姓名',
        width: 200,
        type: 'custom',
        customField: RadioField,
        renderChildren: () => {
          return [{
            id: 'xiaoli',
            name: '小李',
          }, {
            id: 'xiaowang',
            name: '小王',
          }].map((item) => {
            return <RadioItem key={item.id} text={item.name} value={item.id} />
          });
        },
      },
      {
        dataKey: 'email',
        title: 'Email',
        width: 200,
        type: 'text',
        rules: {
          validator: Validator.isEmail,
          errMsg: '',
        },
        config: {
          onBlur: function(e) {
            console.log(e);
          },
        },
      },
      {
        dataKey: 'action1',
        title: '操作1',
        width: 100,
        type: 'action',
        actions: [
          {
            title: '编辑',
            callback: (rowData) => {
              me.refs.grid.editRow(rowData);
            },
            mode: Constants.MODE.VIEW,
          },
          {
            title: '保存',
            callback: (rowData) => {
              me.refs.grid.saveRow(rowData);
            },
            mode: Constants.MODE.EDIT,
          },
          {
            title: '删除',
            callback: (rowData) => {
              me.refs.grid.delRow(rowData);
            },
          // mode: Constants.MODE.VIEW
          },
          {
            title: '重置',
            callback: (rowData) => {
              me.refs.grid.resetRow(rowData);
            },
            mode: Constants.MODE.EDIT,
          },
        ],
      },
    ];


    const renderProps = {
      // height: 200,
      width: 500,
      showPager: true,
      fetchParams: {},
      showHeaderBorder: true,
      getSavedData: true,
      jsxdata: me.state.data,
      doubleClickToEdit: true,
      actionBar: [
        {
          title: '新增行',
          callback: () => {
            me.refs.grid.addEmptyRow();
          },
          render: (title) => <Button>{title}</Button>,
        },
        {
          title: '编辑所有行',
          callback: () => {
            me.refs.grid.editAllRow();
          },
        },
        {
          title: '保存所有行',
          callback: () => {
            me.refs.grid.saveAllRow();
          },
        },
      ],
      // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
      // fetchUrl: "http://10.1.159.52:3002/demo/data.json",
      jsxcolumns: columns,
      beforeFetch: (sendData) => {
        sendData.id = 1;
        return sendData;
      },
      processData: (data) => data,
      onChange: me.handleTableChange,
    };

    return (
      <div>
        <Table {...renderProps} ref="grid" />
        <Button onClick={me.getTableValues.bind(me)}>获取 Table 的值</Button>
        <Button onClick={me.handleDataChange.bind(me)}>更改 Data</Button>
      </div>
    );
  }
}

module.exports = Demo;
