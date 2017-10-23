import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
// import sinon from 'sinon';

import Table from '../src';

Enzyme.configure({ adapter: new Adapter() });

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

  it('api toggleSubComp', () => {
    wrapper = mount(
      <Table {...common} renderSubComp={() => <div>1</div>} />
    );
    wrapper.instance().toggleSubComp(wrapper.instance().getData().data.data[0]);
    expect(wrapper.find('.kuma-uxtable-subrow').contains(<div>1</div>)).to.be(true);
  });
});

