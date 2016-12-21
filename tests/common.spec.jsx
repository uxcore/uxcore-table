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
  });
});
