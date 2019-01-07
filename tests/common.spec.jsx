import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import util from '../src/util';
import Table from '../src';

Enzyme.configure({ adapter: new Adapter() });

const common = {
  jsxcolumns: [
    { dataKey: 'id', title: 'ID', width: 50 },
    { dataKey: 'country', title: '国家', width: 200 },
    { dataKey: 'city', title: '城市', width: 150 },
    { dataKey: 'firstName', title: 'FristName' },
  ],
  jsxdata: {
    data: [
      {
        id: '1',
        country: 'country1',
        city: 'city1',
        firstName: 'firstName1',
        money: 10000,
        card: '20000000',
        mobile: '15652963333',
      },
    ],
    currentPage: 1,
    totalCount: 30,
  },
};
sinon.spy(Table.prototype, 'componentDidMount');
sinon.spy(Table.prototype, 'fetchRemoteData');

describe('Table', () => {
  it('calls componentDidMount', () => {
    mount(
      <Table />,
    );
    expect(Table.prototype.componentDidMount.calledOnce).to.be(true);
  });
  it('data can be changed', () => {
    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            data: [
              {
                id: '1',
                country: 'country1',
                city: 'city1',
                firstName: 'firstName1',
              },
            ],
          },
        };
      }

      saveRef(refName) {
        const me = this;
        return (c) => {
          me[refName] = c;
        };
      }

      changeState() {
        this.setState({
          data: {
            data: [
              {
                id: '2',
                country: 'country1',
                city: 'city1',
                firstName: 'firstName1',
              },
            ],
          },
        });
      }

      render() {
        return (
          <Table {...common} jsxdata={this.state.data} ref={this.saveRef('table')} />
        );
      }
    }
    const wrapper = mount(<Demo />);
    wrapper.instance().changeState();
    expect(wrapper.instance().table.state.data.data[0].id).to.be('2');
  });
  describe('Props', () => {
    let wrapper;
    it('width support number', () => {
      wrapper = mount(<Table width={500} />);
      expect(wrapper.instance().getDom().style.width).to.be('500px');
    });

    it('width support string', () => {
      wrapper = mount(<Table width="500px" />);
      expect(wrapper.instance().getDom().style.width).to.be('500px');
    });

    it('height support number', () => {
      wrapper = mount(<Table height={500} />);
      expect(wrapper.instance().getDom().style.height).to.be('500px');
    });

    it('height support string', () => {
      wrapper = mount(<Table height="500px" />);
      expect(wrapper.instance().getDom().style.height).to.be('500px');
    });

    it('column width support percentage', (done) => {
      const mountNode = document.createElement('div');
      document.body.appendChild(mountNode);
      let ref;
      const scrollbarWidth = util.measureScrollbar();
      ReactDOM.render(<Table width={900} ref={(c) => { ref = c; }} jsxcolumns={[{ width: '30%', title: '列', dataKey: 'test' }]} />, mountNode);
      setTimeout(() => {
        expect(ref.getDom().querySelector('.kuma-uxtable-cell').clientWidth).to.be(Math.round((900 - scrollbarWidth) * 0.3));
        ref = null;
        ReactDOM.unmountComponentAtNode(mountNode);
        document.body.removeChild(mountNode);
        done();
      }, 200);
    });

    it('showColumnPicker', () => {
      wrapper = mount(<Table {...common} showColumnPicker />);
      expect(wrapper.find('.kuma-uxtable-column-picker')).to.have.length(1);
    });

    it('showColumnPicker with handleColumnPickerChange', () => {
      wrapper = mount(<Table {...common} showColumnPicker />);
      wrapper.instance().handleColumnPickerChange(['country'], '__common__');
      expect(wrapper.state('columns').filter(item => item.dataKey === 'id')[0].hidden).to.be(true);
    });

    it('showSearch', () => {
      wrapper = mount(<Table {...common} showSearch />);
      expect(wrapper.find('.kuma-uxtable-searchbar')).to.have.length(1);
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
      const wrapper2 = mount(<Table {...common} showPagerTotal={false} />);
      expect(wrapper1.instance().getPager().props.showTotal).to.be(true);
      expect(wrapper2.instance().getPager().props.showTotal).to.be(false);
    });

    it('showPagerSizeChanger', () => {
      const wrapper1 = mount(<Table {...common} />);
      const wrapper2 = mount(<Table {...common} showPagerSizeChanger={false} />);
      expect(wrapper1.instance().getPager().props.showSizeChanger).to.be(true);
      expect(wrapper2.instance().getPager().props.showSizeChanger).to.be(false);
    });

    it('isMiniPager', () => {
      const wrapper1 = mount(<Table {...common} />);
      const wrapper2 = mount(<Table {...common} isMiniPager />);
      expect(wrapper1.find('ul.mini')).to.have.length(0);
      expect(wrapper2.find('ul.mini')).to.have.length(1);
    });

    it('actionBar', () => {
      const wrapper1 = mount(
        <Table
          {...common}
          actionBar={[
            {
              title: '新增行',
              callback: () => { },
            },
            {
              title: '编辑所有行',
              callback: () => { },
            },
            {
              title: '保存所有行',
              callback: () => { },
            },
          ]}
        />,
      );

      const wrapper2 = mount(
        <Table
          {...common}
          actionBar={
            {
              useListActionBar: true,
              showSelectAll: true,
              buttons: [
                {
                  title: 'Action Button',
                  keepActiveInCustomView: true,
                  callback: () => {
                    this.forceUpdate();
                    console.log(me.table.getData());
                    me.table.toggleSubComp(me.table.getData().data.datas);
                  },
                },
                {
                  title: '123123',
                  // type: 'secondary',
                  keepActiveInCustomView: true,
                  size: 'small',
                  callback: () => {
                    me.table.selectAll(true);
                  }
                }
              ],
              actionBarTip: '已经为您找到记录123条',
              // renderCustomBarItem() {
              //   return (
              //     <p>自定义内容</p>
              //   )
              // },
              rowOrder: {
                iconName: 'paixu-jiangxu',
                // keepActiveInCustomView: true,
                defaultValue: {
                  text: '行排序',
                  value: '123'
                },
                items: [
                  {
                    text: '行排序',
                    value: '123'
                  },
                  {
                    text: '排序方式',
                    value: '456'
                  }
                ],
                onChange(data) {
                  console.log(data)
                }
              },
              columnsOrder: {
                iconName: 'huxiangguanzhu',
                // keepActiveInCustomView: true,
                title: '列排序',
                includeActionColumn: true,
                onChange(dragInfo, data) {
                  debugger
                  console.log(data)
                }
              },
              columnsPicker: {
                iconName: 'zidingyilie',
                title: '列选择器',
                // keepActiveInCustomView: true,
                onChange(data) {
                  console.log(data)
                }
              },
              // 支持返回promise
              renderCustomView(data, currentPage) {
                console.log(data, currentPage)
                return (
                  <Test name={'123123123'}/>
                )
              },
              showPager: true,
              removePagerInCustomView: false
            }
          }
        />,
      );
      expect(wrapper1.find('button.kuma-uxtable-actionbar-item')).to.have.length(3);

    });

    it('linkBar', () => {
      wrapper = mount(
        <Table
          {...common}
          linkBar={[
            {
              title: '新增行',
              callback: () => { },
            },
            {
              title: '编辑所有行',
              callback: () => { },
            },
          ]}
        />,
      );
      expect(wrapper.find('.kuma-uxtable-linkbar-item')).to.have.length(2);
    });


    it('passedData', () => {
      wrapper = mount(<Table {...common} jsxdata={null} passedData={common.jsxdata} />);
      expect(wrapper.state('data').data[0].id).to.be('1');
    });

    it('rowSelection onSelect', (done) => {
      wrapper = mount(
        <Table
          {...common}
          rowSelection={{
            onSelect: (record, selected, selectedRows) => {
              expect(record).to.be(true);
              expect(selected.id).to.be('1');
              expect(selectedRows).to.have.length(1);
              done();
            },
          }}
        />,
      );
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').instance().checked = true;
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').simulate('change');
    });

    it('rowSelection onDeSelect', (done) => {
      wrapper = mount(
        <Table
          {...common}
          rowSelection={{
            onSelect: (record, selected, selectedRows) => {
              if (record === false) {
                expect(selected.id).to.be('1');
                expect(selectedRows).to.have.length(0);
                done();
              }
            },
          }}
        />,
      );
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').instance().checked = true;
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').simulate('change');
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').instance().checked = false;
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').simulate('change');
    });

    it('rowSelection onSelectAll', (done) => {
      wrapper = mount(
        <Table
          {...common}
          rowSelection={{
            onSelectAll: (record, selectedRows) => {
              expect(record).to.be(true);
              expect(selectedRows).to.have.length(1);
              done();
            },
          }}
        />,
      );
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').instance().checked = true;
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').simulate('change');
    });

    it('rowSelection onDeSelectAll', (done) => {
      wrapper = mount(
        <Table
          {...common}
          rowSelection={{
            onSelectAll: (record, selectedRows) => {
              if (record === false) {
                expect(selectedRows).to.have.length(0);
                done();
              }
            },
          }}
        />,
      );
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').instance().checked = true;
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').simulate('change');
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').instance().checked = false;
      wrapper.find('.kuma-uxtable-header .kuma-checkbox').simulate('change');
    });

    it('rowSelection isDisabled', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxdata={{
            data: [
              {
                id: '1',
                country: 'country1',
                city: 'city1',
                firstName: 'firstName1',
              },
              {
                id: '2',
                country: 'country2',
                city: 'city2',
                firstName: 'firstName2',
              },
            ],
            currentPage: 1,
            totalCount: 30,
          }}
          rowSelection={{
            onSelectAll: () => { },
            isDisabled: rowData => rowData.id === '1',
          }}
        />,
      );
      expect(!!wrapper.find('Row CheckBox').at(0).prop('disable')).to.be(true);
    });

    it('rowSelection onSelect with radioSelector', (done) => {
      wrapper = mount(
        <Table
          {...common}
          jsxdata={{
            data: [
              { id: '1' },
              { id: '2', jsxchecked: true },
            ],
          }}
          rowSelector="radioSelector"
          rowSelection={{
            onSelect: (record, selected, selectedRows) => {
              expect(record).to.be(true);
              expect(selected.id).to.be('1');
              expect(selectedRows).to.have.length(1);
              expect(selectedRows[0].id).to.be('1');
              done();
            },
          }}
        />,
      );
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').at(0).instance().checked = true;
      wrapper.find('.kuma-uxtable-row .kuma-checkbox').at(0).simulate('change');
    });

    it('fetchUrl', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxdata={null}
          fetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
        />,
      );
      expect(Table.prototype.fetchRemoteData.calledOnce).to.be(true);
    });

    it('fetchUrl with beforeFetch', (done) => {
      wrapper = mount(
        <Table
          {...common}
          jsxdata={null}
          fetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
          beforeFetch={(data) => {
            expect(JSON.stringify(data)).to.be(JSON.stringify({ pageSize: 10, currentPage: 1 }));
            done();
          }}
        />,
      );
    });

    it('fetchUrl with fetchParams', (done) => {
      wrapper = mount(
        <Table
          {...common}
          jsxdata={null}
          fetchParams={{ a: 1 }}
          fetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
          beforeFetch={(data) => {
            expect(JSON.stringify(data))
              .to.be(JSON.stringify({ pageSize: 10, currentPage: 1, a: 1 }));
            done();
          }}
        />,
      );
    });

    it('fetchUrl without fetchDataOnMount', () => {
      const beforeFetch = sinon.spy();
      wrapper = mount(
        <Table
          {...common}
          jsxdata={null}
          fetchParams={{ a: 1 }}
          fetchDataOnMount={false}
          fetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
          beforeFetch={beforeFetch}
        />,
      );
      expect(beforeFetch.calledOnce).to.be(false);
    });

    // it('fetchUrl with processData', (done) => {
    //   wrapper = mount(
    //     <Table
    //       {...common}
    //       jsxdata={null}
    //       fetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
    //       processData={(content) => {
    //         expect(content.datas.length).not.to.be(0);
    //         done();
    //         return content;
    //       }}
    //     />
    //   );
    // }).timeout(5000);
  });
  describe('Actions', () => {
    let wrapper;
    it('type action', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxcolumns={[...common.jsxcolumns, {
            type: 'action',
            actions: [
              {
                title: '编辑',
              },
              {
                title: '保存',
              },
            ],
          }]}
        />,
      );
      expect(wrapper.find('.action-container')).to.have.length(1);
    });

    it('actions support object', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxcolumns={[...common.jsxcolumns, {
            type: 'action',
            actions: {
              编辑: () => { },
            },
          }]}
        />,
      );
      expect(wrapper.find('.action-container')).to.have.length(1);
    });

    it('actions support function', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxcolumns={[...common.jsxcolumns, {
            type: 'action',
            actions: (rowData) => {
              expect(rowData.id).to.be('1');
              return [
                {
                  title: '编辑',
                },
                {
                  title: '保存',
                },
              ];
            },
          }]}
        />,
      );
      expect(wrapper.find('.action-container')).to.have.length(1);
    });

    it('collapseNum is 1', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxcolumns={[...common.jsxcolumns, {
            type: 'action',
            collapseNum: 1,
            actions: [
              {
                title: '编辑',
              },
              {
                title: '保存',
              },
            ],
          }]}
        />,
      );
      expect(wrapper.find('.action-container').find('.kuma-button-group-separated-item')).to.have.length(1);
    });

    it('collapseNum is 2', () => {
      wrapper = mount(
        <Table
          {...common}
          jsxcolumns={[...common.jsxcolumns, {
            type: 'action',
            collapseNum: 2,
            actions: [
              {
                title: '编辑',
              },
              {
                title: '保存',
              },
              {
                title: '删除',
              },
            ],
          }]}
        />,
      );
      expect(wrapper.find('.action-container').find('.kuma-button-group-separated-item')).to.have.length(2);
    });
  });
  it('fixed column', () => {
    const wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[
          {
 dataKey: 'id', title: 'ID', width: 50, fixed: true
},
        ]}
      />,
    );
    expect(wrapper.find('.kuma-uxtable-header-scroll')).to.have.length(1);
    expect(wrapper.find('.kuma-uxtable-header-fixed')).to.have.length(1);
  });

  it('right fixed column', () => {
    const wrapper = mount(
      <Table
        {...common}
        jsxcolumns={[
          {
 dataKey: 'id', title: 'ID', width: 50, rightFixed: true
},
        ]}
      />,
    );
    expect(wrapper.find('.kuma-uxtable-header-scroll')).to.have.length(1);
    expect(wrapper.find('.kuma-uxtable-header-right-fixed')).to.have.length(1);
  });

  it('type money', () => {
    const wrapper = mount(
      <Table
        jsxdata={common.jsxdata}
        jsxcolumns={[{ dataKey: 'money', title: '金额', type: 'money' }]}
      />,
    );
    expect(wrapper.find('.kuma-uxtable-body').find('.kuma-uxtable-cell').at(0).text()).to.be('10,000');
  });

  it('type card', () => {
    const wrapper = mount(
      <Table
        jsxdata={common.jsxdata}
        jsxcolumns={[{ dataKey: 'card', title: '卡片', type: 'card' }]}
      />,
    );
    expect(wrapper.find('.kuma-uxtable-body').find('.kuma-uxtable-cell').at(0).text()).to.be('2000 0000');
  });

  it('type cnmobile', () => {
    const wrapper = mount(
      <Table
        jsxdata={common.jsxdata}
        jsxcolumns={[{ dataKey: 'mobile', title: '手机', type: 'cnmobile' }]}
      />,
    );
    expect(wrapper.find('.kuma-uxtable-body').find('.kuma-uxtable-cell').at(0).text()).to.be('1565 2963 333');
  });
});
