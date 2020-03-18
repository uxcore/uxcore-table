/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Table from '../src';
import Constants from 'uxcore-const';

import NattyFetch from 'natty-fetch';


class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          "enumData": [
            {
              "text": "正常",
              "value": "1"
            },
            {
              "text": "异常",
              "value": "-1"
            }
          ],
          "columnGroupName": "",
          "editKey": "nameId",
          "hidden": false,
          "canEdit": function canEdit(rowData, ctx, vsState) {return true;},
          "tooltipPlacement": "",
          "titleRenderer": "",
          "rules": function(value, rowData, ctx, vcState) {  return true;},
          "align": "left",
          "title": "我的下级",
          "enumBadgeType": "background",
          "configPlaceholder": "",
          "dataKey": "name",
          "dynamicColumns": "[]",
          "dynamicMode": false,
          "configDataFunc": function getData(rowData, ctx, vcState) {  return []; },
          "editType": 0,
          "fieldsetCode": "",
          "isDisabled": function isDisabled(ctx, vcState) {return false;},
          "render": function () {},
          "ordered": false,
          "columnGroup": false,
          "pageMode": "",
          "dataType": "custom",
          "message": "",
          "getCustomField": function getCustomField(ctx, vcState) {  return false; },
          "getCustomConfig": function getCustomConfig(ctx, vcState) {  return {}; },
          "width": "200px",
          "timeFormatter": "YYYY-MM-DD HH:mm:ss"
        },
        {
          "enumData": "[{…}, {…}]",
          "columnGroupName": "",
          "hidden": false,
          "canEdit": function canEdit(rowData, ctx, vsState) {return true;},

          "tooltipPlacement": "",
          "titleRenderer": "",
          "rules": "function(value, rowData, ctx, vcState) {  return true;}",
          "align": "left",
          "title": "数量",
          "enumBadgeType": "background",
          "configPlaceholder": "",
          "dataKey": "amount",
          "dynamicColumns": "[]",
          "dynamicMode": false,
          "configDataFunc": function getData(rowData, ctx, vcState) {   return []; },
          "editType": 0,
          "fieldsetCode": "",
          "isDisabled": function isDisabled(ctx, vcState) {  return false;},
          "render": function () {},
          "ordered": false,
          "columnGroup": false,
          "pageMode": "",
          "dataType": "text",
          "message": "",
          "getCustomField": function getCustomField(ctx, vcState) {  return false; },
          "getCustomConfig": function getCustomConfig(ctx, vcState) {  return {}; },
          "width": "150px",
          "timeFormatter": "YYYY-MM-DD HH:mm:ss"
        },
        {
          "enumData": [
            "{text: \"正常\", value: \"1\"}",
            "{text: \"异常\", value: \"-1\"}"
          ],
          "columnGroupName": "",
          "editKey": "",
          "hidden": false,
          "canEdit": function canEdit(rowData, ctx, vsState) {return true;},
          "tooltipPlacement": "",
          "titleRenderer": "",
          "rules": "ƒ () {}",
          "align": "left",
          "title": "调整后",
          "enumBadgeType": "background",
          "configPlaceholder": "",
          "dataKey": "recommendAmount",
          "dynamicColumns": [],
          "dynamicMode": false,
          "configDataFunc": function getData(rowData, ctx, vcState) {   return []; },
          "editType": "text",
          "fieldsetCode": "",
          "isDisabled": function isDisabled(ctx, vcState) {  return false;},
          "render": function l() {},
          "ordered": false,
          "columnGroup": false,
          "pageMode": "",
          "dataType": "text",
          "message": "",
          "getCustomField": function () {},
          "getCustomConfig": function getCustomConfig(ctx, vcState) {  return {}; },
          "width": 180,
          "timeFormatter": "YYYY-MM-DD",
          "type": "text",
          "config": {
            "data": function () {},
            "placeholder": "",
            "allowClear": true
          }
        },
        {
          title: '操作',
          type: 'action',
          rightFixed: true,
          width: '300px',
          collapseNum: 6,
          actions: [
            {
              title: '新增子树',
              callback: (rowData) => {
                this.table.addSubRow({
                  "amount": 2000,
                  "maxAmount": 1000,
                  "minAmount": 0,
                  "name": "按层级",
                  "recommendAmount": 54000
                }, rowData, () => {
                  console.log(this.table.getData())
                })
              }
            },
            {
              title: '删除',
              callback: (rowData) => {
                this.table.delRow(rowData);
              },
            }
          ],
        },
      ]
    };
  }
  render() {
    const me = this;
    const renderProps = {
      height: '600px',
      width: '1000px',
      levels: 0,
      jsxdata: {
        "data": [
          {
            "amount": 100000,
            "maxAmount": 1.7976931348623157e+308,
            "minAmount": 0,
            "name": "按层级",
            "recommendAmount": 100000,
            "data": [
              {
                "amount": 50000,
                "amountType": "AP",
                "amountTypeDesc": "费用报销",
                "maxAmount": 200000,
                "minAmount": 0,
                "name": "小王",
                "recommendAmount": 50000,
                "data": [
                  {
                    "amount": 30000,
                    "amountType": "AP",
                    "amountTypeDesc": "费用报销",
                    "maxAmount": 200000,
                    "minAmount": 0,
                    "name": "小王",
                    "recommendAmount": 50000,
                  },
                  {
                    "amount": 40000,
                    "amountType": "AP",
                    "amountTypeDesc": "报销及借款-业务",
                    "maxAmount": 200000,
                    "minAmount": 0,
                    "name": "小王",
                    "recommendAmount": 60000,
                  }
                ]
              }
            ]
          },
          {
            "amount": 2000,
            "maxAmount": 1.7976931348623157e+308,
            "minAmount": 0,
            "name": "按层级",
            "recommendAmount": 5000,
            "data": [
              {
                "amount": 2000,
                "amountType": "AP",
                "amountTypeDesc": "费用报销",
                "maxAmount": 200000,
                "minAmount": 0,
                "name": "小王",
                "recommendAmount": 4000,
              }
            ]
          }
        ]
      },
      jsxcolumns: this.state.columns,
      renderModel: 'tree',
      isTree: true,
      // toggleTreeExpandOnRowClick: true,
      defaultEditable: true,
      enableInlineEdit: true,
      enableInlineEditInTreeMode: true,
      getSavedData: false,
      dataSourceType: 'data',
      onChange: function(changed) {
        const data = me.table.getData();
      },
      mode: 'edit',
      className: 'kuma-uxtable-split-line',
      ref: (c) => {
        this.table = c;
      },
    };
    return (<Table ref={c => {this.table = c}} {...renderProps} className={'kuma-uxtable-border-line'} />);
  }
}

export default Demo;
