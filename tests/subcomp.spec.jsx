import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
// import sinon from 'sinon';

import Table from '../src';

const common = {
  jsxcolumns: [
    { dataKey: 'id', title: 'ID', width: 50, hidden: true },
    { dataKey: 'country', title: '国家', width: 200, ordered: true },
    { dataKey: 'city', title: '城市', width: 150, ordered: true },
    { dataKey: 'firstName', title: 'FristName' },
  ],
  jsxdata: {
    data: [
      {
        id: '1',
        country: 'country1',
        city: 'city1',
        firstName: 'firstName1',
      },
    ],
    currentPage: 1,
    totalCount: 30,
  },
};

describe('SubComp', () => {
  let wrapper;
  it('props renderSubComp', () => {
    wrapper = mount(
      <Table {...common} renderSubComp={() => <div>1</div>} />
    );
    wrapper.find('.kuma-uxtable-tree-icon').simulate('click');
    expect(wrapper.find('.kuma-uxtable-subrow').contains(<div>1</div>)).to.be(true);
  });

  it('props subComp', (done) => {
    wrapper = mount(
      <Table {...common} subComp={<div>1</div>} />
    );
    wrapper.find('.kuma-uxtable-tree-icon').simulate('click');
    setTimeout(() => {
      expect(wrapper.find('.kuma-uxtable-subrow').length).not.to.be(0);
      done();
    }, 100);
  });

  it('api toggleSubComp', () => {
    wrapper = mount(
      <Table {...common} renderSubComp={() => <div>1</div>} />
    );
    wrapper.node.toggleSubComp(wrapper.node.getData().data.data[0]);
    expect(wrapper.find('.kuma-uxtable-subrow').contains(<div>1</div>)).to.be(true);
  });
});

