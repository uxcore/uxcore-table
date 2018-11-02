import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Table from '../src';

Enzyme.configure({ adapter: new Adapter() });

const common = {
  jsxcolumns: [
    {
      dataKey: 'id', title: 'ID', width: 50, hidden: true,
    },
    {
      dataKey: 'country', title: '国家', width: 200, ordered: true,
    },
    {
      group: '分组',
      columns: [
        {
          dataKey: 'city', title: '城市', width: 150, ordered: true,
        },
        { dataKey: 'firstName', title: 'FristName' },
      ],
    },
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

describe('TableGroup', () => {
  let wrapper;
  it('should work', () => {
    wrapper = mount(
      <Table {...common} />,
    );
    expect(wrapper.find('.kuma-uxtable-header-column-group').find('.kuma-uxtable-header-group-name').text()).to.be('分组');
  });
  it('showColumnPicker', () => {
    wrapper = mount(
      <Table {...common} showColumnPicker />,
    );
    expect(wrapper.find('.kuma-uxtable-column-picker')).to.have.length(1);
  });
});
