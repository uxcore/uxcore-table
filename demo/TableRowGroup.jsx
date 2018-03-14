/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Table from '../src';

const commonData = {
  title: '一级标题',
  entity: '蚂蚁金服（中国）',
  institution: '招商银行丨杭州分行',
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
    const tableProps = {
      jsxcolumns: [
        { dataKey: 'company', title: '公司', width: 200 },
        { dataKey: 'title', title: '标题', width: 200, fixed: true },
        { dataKey: 'entity', title: '支付实体', width: 200 },
        { dataKey: 'institution', title: '金融机构', width: 200 },
        { dataKey: 'person', title: '申请人', width: 200 },
      ],
      jsxdata: {
        data: mixArray(personData, companyData).map(item => ({ ...item, ...commonData })),
      },
      className: 'kuma-uxtable-split-line',
      rowGroupKey: 'company',
      showColumnPicker: true,
      // width: 600,
    };
    return (
      <Table {...tableProps} />
    );
  }
}

export default Demo;
