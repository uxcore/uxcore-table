import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

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

describe('Table', () => {
  it('calls componentDidMount', () => {
    sinon.spy(Table.prototype, 'componentDidMount');
    mount(
      <Table />
    );
    expect(Table.prototype.componentDidMount.calledOnce).to.be(true);
  });
  describe('Props', () => {
    let wrapper;
    it('width support number', () => {
      wrapper = mount(<Table width={500} />);
      expect(wrapper.node.getDomNode().style.width).to.be('500px');
    });

    it('width support string', () => {
      wrapper = mount(<Table width="500px" />);
      expect(wrapper.node.getDomNode().style.width).to.be('500px');
    });

    it('height support number', () => {
      wrapper = mount(<Table height={500} />);
      expect(wrapper.node.getDomNode().style.height).to.be('500px');
    });

    it('height support string', () => {
      wrapper = mount(<Table height="500px" />);
      expect(wrapper.node.getDomNode().style.height).to.be('500px');
    });

    it('showColumnPicker', () => {
      wrapper = mount(<Table {...common} showColumnPicker />);
      expect(wrapper.find('.kuma-uxtable-column-picker')).to.have.length(1);
    });

    it('showPager if page info is passed', () => {
      wrapper = mount(<Table {...common} />);
      expect(wrapper.find('.kuma-uxtable-page')).to.have.length(1);
    });

    it('not showPager if page info is not passed', () => {
      wrapper = mount(<Table {...common} jsxdata={{ data: [] }} />);
      expect(wrapper.find('.kuma-uxtable-page')).to.have.length(0);
    });

    it('not showPager if prop is false', () => {
      wrapper = mount(<Table {...common} showPager={false} />);
      expect(wrapper.find('.kuma-uxtable-page')).to.have.length(0);
    });

    it('showPagerTotal', () => {
      const wrapper1 = mount(<Table {...common} />);
      const wrapper2 = mount(<Table {...common} showPagerTotal />);
      expect(wrapper1.node.getPager().props.showTotal).to.be(false);
      expect(wrapper2.node.getPager().props.showTotal).to.be(true);
    });

    it('showPagerSizeChanger', () => {
      const wrapper1 = mount(<Table {...common} />);
      const wrapper2 = mount(<Table {...common} showPagerSizeChanger={false} />);
      expect(wrapper1.node.getPager().props.showSizeChanger).to.be(true);
      expect(wrapper2.node.getPager().props.showSizeChanger).to.be(false);
    });

    it('isMiniPager', () => {
      const wrapper1 = mount(<Table {...common} />);
      const wrapper2 = mount(<Table {...common} isMiniPager />);
      expect(wrapper1.find('.mini')).to.have.length(0);
      expect(wrapper2.find('.mini')).to.have.length(1);
    });
  });
});
