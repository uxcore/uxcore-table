/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import Validator from 'uxcore-validator';

import Button from 'uxcore-button';
import Constants from 'uxcore-const';
import React from 'react';
import deepcopy from 'lodash/cloneDeep';
import Table from '../src';
// const Select = require('uxcore-select2');
// const RadioGroup = require('uxcore-radiogroup');
// const RadioField = require('./RadioField');
// const PlaceSelect = require('./PlaceSelect');
// const { Option } = Select;
// const RadioItem = RadioGroup.Item;
const { createCellField } = Table;


const mockData = {
  data: [
    {
      email: 'xw@abc.com',
      nameId: 'xiaowang',
      name: '小王',
      cityId: 'bj',
      city: '北京',
      time: '2016-01-02',
      timeId: 1451692800000,
    },
    {
      email: 'xl@abc.com',
      nameId: 'xiaoli',
      name: '小李',
      cityId: 'hz',
      city: '杭州',
      time: '2016-01-02',
      timeId: 1451692800000,
    },
  ],
  currentPage: 1,
  totalCount: 10,
};

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: mockData,
      showOtherColumn: false,
    };
    this.getTableValues = this.getTableValues.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
  }


  getTableValues() {
    console.log(this.table.getData());
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
            cityId: { key: 'bj' },
            city: '北京',
            time: '2016-01-02',
            timeId: 1451692800000,
          },
          {
            email: 'xl@abc.com',
            nameId: 'xiaoli',
            name: '小李',
            cityId: { key: 'hz' },
            city: '杭州',
            time: '2016-01-02',
            timeId: 1451692800000,
          },
          {
            email: 'xl@abc.com',
            nameId: 'xiaoli',
            name: '小李',
            cityId: { key: 'hz' },
            city: '杭州',
            time: '2016-01-02',
            timeId: 1451692800000,
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
        config: {
          filterOption: false,
          data: () => ([{
            value: 'bj',
            text: '北京',
          }, {
            value: 'hz',
            text: '杭州',
          }]),
          dataType: 'jsonp',
          beforeFetch: key => (key || { q: 1 }),
          afterFetch: (content) => {
            const data = [];
            content.result.forEach((item) => {
              data.push({
                value: item[1],
                text: item[0],
              });
            });
            return data;
          },
        },
        rules: {
          validator: value => value.key !== 'bj',
        },
        canEdit: rowData => rowData.name !== '小王',
      },
      {
        dataKey: 'name',
        editKey: 'nameId',
        title: '姓名',
        width: 200,
        type: 'check',
        required: true,
        config: {
          data: () => [{
            value: 'xiaoli',
            text: '小李',
            disabled: true,
          }, {
            value: 'xiaowang',
            text: '小王',
          }],
        },
        rules: {
          validator: value => value.indexOf('xiaowang') !== -1,
        },
      },
      {
        dataKey: 'email',
        title: 'Email',
        width: 200,
        type: 'custom',
        customField: createCellField(),
        rules: {
          validator: Validator.isEmail,
          errMsg: '出错',
        },
        config: {
          onBlur(e) {
            console.log(e);
          },
        },
      },
      {
        dataKey: 'time',
        title: '时间',
        width: 200,
        editKey: 'timeId',
        type: 'date',
        rules: {
          validator: value => value > Date.now(),
        },
      },
      {
        dataKey: 'action1',
        title: '操作1',
        rightFixed: true,
        width: 300,
        type: 'action',
        actionType: 'button',
        collapseNum: 2,
        actions: [
          {
            title: '编辑',
            callback: (rowData) => {
              me.table.editRow(rowData);
            },
            mode: Constants.MODE.VIEW,
          },
          {
            title: '重置',
            callback: (rowData) => {
              me.table.resetRow(rowData);
            },
            mode: Constants.MODE.VIEW,
            isDisable: () => true,
          },
          {
            title: '保存',
            callback: (rowData) => {
              me.table.saveRow(rowData);
            },
            mode: Constants.MODE.EDIT,
          },
          {
            title: '删除',
            callback: (rowData) => {
              me.table.delRow(rowData);
            },
          // mode: Constants.MODE.VIEW
          },
          {
            title: '重置',
            callback: (rowData) => {
              me.table.resetRow(rowData);
            },
            mode: Constants.MODE.EDIT,
          },
        ],
      },
    ];


    const renderProps = {
      // height: 200,
      width: 1000,
      showPager: true,
      fetchParams: {},
      showSearch: true,
      showHeaderBorder: true,
      getSavedData: true,
      jsxdata: me.state.data,
      doubleClickToEdit: true,
      onPagerChange: (currentPage) => {
        const newData = deepcopy(this.state.data);
        newData.currentPage = currentPage;
        me.setState({
          data: newData,
        });
      },
      actionBar: [
        {
          title: '新增行',
          // disabled: true,
          callback: () => {
            me.table.addEmptyRow();
          },
        },
        {
          title: '编辑所有行',
          callback: () => {
            me.table.editAllRow();
          },
        },
        {
          title: '恢复所有行',
          callback: () => {
            me.table.resetAllRow();
          },
        },
      ],
      linkBar: [
        {
          title: '操作外链一',
          callback: () => {
            alert(1);
          },
        },
        {
          title: '操作外链二',
          callback: () => {
            alert(2);
          },
        },
      ],
      // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
      // fetchUrl: "http://10.1.159.52:3002/demo/data.json",
      jsxcolumns: columns,
      showColumnPicker: true,
      // locale: 'en-us',
      beforeFetch: (sendData) => {
        const newData = { ...sendData };
        newData.id = 1;
        return newData;
      },
      processData: data => data,
      onChange: me.handleTableChange,
      showPagerSizeChanger: false,
    };

    return (
      <div>
        <Table {...renderProps} ref={(c) => { this.table = c; }} />
        <Button onClick={me.getTableValues}>获取 Table 的值</Button>
        <Button onClick={me.handleDataChange}>更改 Data</Button>
      </div>
    );
  }
}

export default Demo;
