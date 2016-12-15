import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Table from '../src';


describe('Table', () => {
  it('calls componentDidMount', () => {
    sinon.spy(Table.prototype, 'componentDidMount');
    mount(
      <Table
        jsxcolumns={[
          {
            dataKey: 'select',
            title: '选择',
          },
          {
            dataKey: 'id',
            title: 'ID',
          },
        ]}
      />
    );
    expect(Table.prototype.componentDidMount.calledOnce).to.be(true);
  });
});
