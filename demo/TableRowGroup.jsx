/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Formatter from 'uxcore-formatter';
import Table from '../src';

const commonData = {
  title: '一级标题',
  entity: '蚂蚁金服（中国）',
  institution: '招商银行丨杭州分行',
  money: '60000',
};

const companyData = [
  { company: '阿里巴巴网络技术有限公司' },
  { company: '蚂蚁金服有限公司' },
  {},
];

const personData = [
  { person: 'Vernon Norman' },
  { person: 'David Hammond' },
];

const mixArray = (arr1, arr2) => {
  const twoArray = arr1.map(item => arr2.map(i => ({ ...item, ...i })));
  const result = [];
  twoArray.forEach((item) => {
    item.forEach((i) => {
      result.push(i);
    });
  });
  return result;
};

//* 第一列为radio的demo
class Demo extends React.Component {
  render() {
    const rowSelection = {
      onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
      },
      onSelectAll(selected, selectedRows) {
        console.log(selected, selectedRows);
      },
      // isDisabled: rowData => true,
    };
    const tableProps = {
      jsxcolumns: [
        {
          dataKey: 'company', title: '公司', width: '20%', render: () => 'aaa',
        },
        {
          dataKey: 'title', title: '标题', width: '20%', fixed: true,
        },
        {
          dataKey: 'money', title: '金额', width: '20%', type: 'money',
        },
        { dataKey: 'entity', title: '支付实体', width: '50%' },
        { dataKey: 'institution', title: '金融机构', width: '20%' },
        { dataKey: 'person', title: '申请人', width: '20%' },
      ],
      jsxdata: {
        data: mixArray(personData, companyData).map(item => ({ ...item, ...commonData })),
      },
      className: 'kuma-uxtable-split-line',
      rowGroupKey: 'company',
      showColumnPicker: true,
      footer: ({
        data, column, from, rowGroupData = [],
      }) => {
        if (column.dataKey === 'title') {
          return '合计';
        }
        if (column.dataKey === 'money') {
          let total = 0;
          if (from === 'rowGroup') {
            rowGroupData.forEach((rowData) => {
              total += parseInt(rowData.money, 10);
            });
          } else {
            data.forEach((rowData) => {
              total += parseInt(rowData.money, 10);
            });
          }

          return Formatter.money(total.toString(), ',');
        }
        return null;
      },
      showFooter: false,
      // width: 600,
      rowSelection,
      size: 'small',
      showRowGroupFooter: true,
      height: 300,
    };
    return (
      <Table {...tableProps} />
    );
  }
}

export default Demo;
