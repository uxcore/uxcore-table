import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import Table from '../src';

Enzyme.configure({ adapter: new Adapter() });

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
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0)
      .instance().value).to.be('1');
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

  it('api editRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().editRow(wrapper.instance().getData().data.data[0], () => {
      // expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(1);
      expect(wrapper.find('.kuma-input')).to.have.length(1);
      done();
    });
  });

  it('api editAllRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().editAllRow(() => {
      // expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input')).to.have.length(1);
      expect(wrapper.find('.kuma-input')).to.have.length(1);
      done();
    });
  });

  it('api viewRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().viewRow(wrapper.instance().getData().data.data[0], () => {
      expect(wrapper.find('li.kuma-uxtable-row').find('div.kuma-uxtable-cell').html().indexOf('kuma-input')).to.be(-1);
      done();
    });
  });

  it('api saveRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    window.wrapper = wrapper;
    wrapper.instance().saveRow(wrapper.instance().getData().data.data[0], () => {
      expect(wrapper.find('li.kuma-uxtable-row').find('div.kuma-uxtable-cell').html().indexOf('kuma-input')).to.be(-1);
      done();
    });
  });

  it('api saveAllRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().saveAllRow(() => {
      expect(wrapper.find('li.kuma-uxtable-row').find('div.kuma-uxtable-cell').html().indexOf('kuma-input')).to.be(-1);
      done();
    });
  });

  it('api addEmptyRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().addEmptyRow(() => {
      expect(wrapper.instance().getData().data.data).to.have.length(2);
      done();
    });
  });

  it('api addRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().addRow({ id: '2' }, () => {
      expect(wrapper.instance().getData().data.data).to.have.length(2);
      expect(wrapper.instance().getData().data.data[1].id).to.be('2');
      done();
    });
  });

  it('api delRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        jsxdata={common.jsxdata2}
        jsxcolumns={[{
          dataKey: 'id', title: 'ID', type: 'text',
        }]}
      />
    );
    wrapper.instance().delRow(wrapper.instance().getData().data.data[0], () => {
      expect(wrapper.instance().getData().data.data).to.have.length(0);
      done();
    });
  });

  it('api moveRowDown', (done) => {
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
    wrapper.instance().moveRowDown(wrapper.instance().getData().data.data[0], () => {
      expect(wrapper.instance().getData().data.data[0].id).to.be('2');
      done();
    });
  });

  it('api moveRowUp', (done) => {
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
    wrapper.instance().moveRowUp(wrapper.instance().getData().data.data[1], () => {
      expect(wrapper.instance().getData().data.data[0].id).to.be('2');
      done();
    });
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
    expect(wrapper.find('.kuma-uxtable-row').find('.kuma-uxtable-cell').find('.kuma-input').at(0)
      .instance().value).to.be('1');
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
    input.instance().value = '测试';
    input.simulate('change');
  });
});
