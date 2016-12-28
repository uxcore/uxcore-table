import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';

import Table from '../src';

const common = {
  // jsxcolumns: [
  //   { dataKey: 'id', title: 'ID', width: 50, hidden: true },
  //   { dataKey: 'country', title: '国家', width: 200, ordered: true },
  //   { dataKey: 'city', title: '城市', width: 150, ordered: true },
  //   { dataKey: 'firstName', title: 'FristName' },
  // ],
  getSavedData: false,
  jsxdata: {
    data: [
      {
        id: '1',
        country: 'country1',
        city: 'city1',
        firstName: 'firstName1',
        __mode__: 'edit',
      },
    ],
    currentPage: 1,
    totalCount: 30,
  },
  jsxdata2: {
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

describe('inlineEdit', () => {
  let wrapper;
  it('type text', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0).node.value).to.be('1');
  });

  it('type select', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'country',
          editKey: 'id',
          title: 'ID',
          type: 'select',
          config: {
            data: [{ value: '1', text: 'country1' }],
          },
        }]}
      />
    );
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-select2-selection-selected-value').text()).to.be('country1');
  });

  it('type radio', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'country',
          editKey: 'id',
          title: 'ID',
          type: 'radio',
          config: {
            data: [{ value: '1', text: 'country1' }],
          },
        }]}
      />
    );
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-radio-group').length).not.to.be(0);
  });

  it('api editRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.editRow(wrapper.node.getData().data.data[0]);
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(1);
  });

  it('api editAllRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.editAllRow();
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(1);
  });

  it('api viewRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.viewRow(wrapper.node.getData().data.data[0]);
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(0);
  });

  it('api saveRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.saveRow(wrapper.node.getData().data.data[0]);
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(0);
  });

  it('api saveAllRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.saveAllRow();
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(0);
  });

  it('api addEmptyRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.addEmptyRow();
    expect(wrapper.node.getData().data.data).to.have.length(2);
  });

  it('api addRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.addRow({ id: '2' });
    expect(wrapper.node.getData().data.data).to.have.length(2);
    expect(wrapper.node.getData().data.data[1].id).to.be('2');
  });

  it('api delRow', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.delRow(wrapper.node.getData().data.data[0]);
    expect(wrapper.node.getData().data.data).to.have.length(0);
  });

  it('api moveRowDown', () => {
    wrapper = mount(
      <Table
        jsxdata={{
          data: [
            { id: '1' },
            { id: '2' },
          ],
        }}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.moveRowDown(wrapper.node.getData().data.data[0]);
    expect(wrapper.node.getData().data.data[0].id).to.be('2');
  });

  it('api moveRowUp', () => {
    wrapper = mount(
      <Table
        jsxdata={{
          data: [
            { id: '1' },
            { id: '2' },
          ],
        }}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.node.moveRowUp(wrapper.node.getData().data.data[1]);
    expect(wrapper.node.getData().data.data[0].id).to.be('2');
  });

  it('api createCellField && type custom', () => {
    const CustomField = Table.createCellField();
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'custom', customField: CustomField,
        }]}
      />
    );
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0).node.value).to.be('1');
  });

  it.skip('type select with remote data source', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'country',
          editKey: 'id',
          title: 'ID',
          type: 'select',
          config: {
            fetchUrl: 'http://suggest.taobao.com/sug',
            dataType: 'jsonp',
            beforeFetch: (key) => {
              if (key) {
                return key;
              }
              return { q: '1' };
            },
            afterFetch: (content) => {
              done();
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
        }]}
      />
    );
  });

  it('type text with config', () => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id',
          title: 'ID',
          type: 'text',
          config: {
            'data-test': '测试',
          },
        }]}
      />
    );
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0)
      .prop('data-test')).to.be('测试');
  });

  it('inline edit change', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
        onChange={(change) => {
          expect(change.editKey).to.be('id');
          expect(change.dataKey).to.be('id');
          expect(change.pass).to.be(true);
          expect(change.changedData.id).to.be('测试');
          done();
        }}
      />
    );
    const input = wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0);
    input.node.value = '测试';
    input.simulate('change');
  });
});
