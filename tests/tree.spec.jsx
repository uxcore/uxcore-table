import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Promise from 'lie';
// import sinon from 'sinon';

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
      dataKey: 'city', title: '城市', width: 150, ordered: true,
    },
    { dataKey: 'firstName', title: 'FristName' },
  ],
  jsxdata: {
    data: [
      {
        check: true,
        id: '1',
        grade: 'grade1',
        email: 'email',
        firstName: 'firstName1',
        lastName: 'lastName1',
        birthDate: 'birthDate1',
        country: '086156529655931.121(xsxs)',
        city: '87181',
        data: [
          {
            id: '11',
            radio: true,
            grade: '2grade2',
            email: '2email2',
            firstName: '2firstName2',
            lastName: '2lastName2',
            birthDate: '2birthDate2',
            country: '2country2',
            city: '2city2',
            data: [
              {
                id: '21',
                radio: true,
                grade: '3grade2',
                email: '3email2',
                firstName: '3firstName2',
                lastName: '3lastName2',
                birthDate: '3birthDate2',
                country: '3country2',
                city: '3city2',
                data: [
                  {
                    id: '31',
                    grade: '3grade2',
                    email: '3email2',
                    firstName: '3firstName2',
                    lastName: '3lastName2',
                    birthDate: '3birthDate2',
                    country: '3country2',
                    city: '3city2',
                  },
                ],
              },
            ],
          },
          {
            id: '12',
            check: true,
            grade: '2grade3',
            email: '2email3',
            firstName: '2firstName3',
            lastName: '2lastName3',
            birthDate: '2birthDate3',
            country: '2country3',
            city: '2city3',
          },
          {
            id: '13',
            check: true,
            grade: '2grade3',
            email: '2email3',
            firstName: '2firstName3',
            lastName: '2lastName3',
            birthDate: '2birthDate3',
            country: '2country3',
            city: '2city3',
            data: [
              {
                id: '21',
                radio: true,
                grade: '3grade2',
                email: '3email2',
                firstName: '3firstName2',
                lastName: '3lastName2',
                birthDate: '3birthDate2',
                country: '3country2',
                city: '3city2',
              },
              {
                id: '21',
                radio: true,
                grade: '3grade2',
                email: '3email2',
                firstName: '3firstName2',
                lastName: '3lastName2',
                birthDate: '3birthDate2',
                country: '3country2',
                city: '3city2',
              },
            ],
          },
        ],
      }, {
        check: false,
        id: '2',
        grade: 'grade2',
        email: 'email',
        firstName: 'firstName1',
        lastName: 'lastName1',
        birthDate: 'birthDate1',
        country: '086156529655931.121(xsxs)',
        city: '87181',
        data: [],
      },
    ],
    currentPage: 1,
    totalCount: 30,
  },
};

const addedContent = {
  data: [
    {
      id: '3',
      grade: 'grade2',
      email: 'email',
      firstName: 'firstName1',
      lastName: 'lastName1',
      birthDate: 'birthDate1',
      country: '086156529655931.121(xsxs)',
      city: '9527',
    },
  ],
};

function loadTreeDataWithSync() {
  return addedContent;
}

function loadTreeDataWithAsync() {
  return Promise.resolve(addedContent);
}

describe('Tree', () => {
  let wrapper;
  it('props renderModel', () => {
    wrapper = mount(
      <Table {...common} renderModel="tree" />,
    );
    expect(wrapper.find('.kuma-uxtable-expand-icon').length).not.to.be(0);
  });

  it('props levels', () => {
    wrapper = mount(
      <Table {...common} renderModel="tree" levels={1} />,
    );
    expect(wrapper.find('.kuma-uxtable-expand-icon .kuma-icon').at(0).hasClass('expanded')).to.be(true);
  });

  it('rowSelection onSelect', (done) => {
    wrapper = mount(
      <Table
        {...common}
        renderModel="tree"
        rowSelection={{
          onSelect: (record, selected, selectedRows) => {
            expect(record).to.be(true);
            expect(selected.id).to.be('1');
            expect(selectedRows).to.have.length(8);
            done();
          },
        }}
      />,
    );
    wrapper.find('.kuma-uxtable-row .kuma-checkbox').at(0).instance().checked = true;
    wrapper.find('.kuma-uxtable-row .kuma-checkbox').at(0).simulate('change');
  });

  it('should be able to toggle tree', () => {
    wrapper = mount(
      <Table {...common} renderModel="tree" levels={1} />,
    );
    wrapper.find('.kuma-uxtable-row .kuma-uxtable-expand-icon').at(0).simulate('change');
    expect(wrapper.find('.kuma-uxtable-row .kuma-uxtable-tree-row').length).not.to.be(0);
  });

  it('should asynchronous add remote row to toggle tree ', (done) => {
    wrapper = mount(
      <Table {...common} loadTreeData={loadTreeDataWithAsync} renderModel="tree" levels={0} />,
    );
    const rowLength = wrapper.find('.kuma-uxtable-row').length;
    wrapper.find('.kuma-icon.kuma-icon-triangle-right').at(4).simulate('click');
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('.kuma-uxtable-row').length).to.equal(rowLength + 1);
      done();
    }, 0);
  });

  it('should change icon type when asynchronous add remote row to toggle tree ', (done) => {
    wrapper = mount(
      <Table {...common} loadTreeData={loadTreeDataWithAsync} renderModel="tree" levels={0} />,
    );
    wrapper.find('.kuma-icon.kuma-icon-triangle-right').at(4).simulate('click');
    expect(wrapper.find('.kuma-uxtable-row-tree-loading-icon').length).above(0);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('.kuma-uxtable-row-tree-loading-icon').length).to.equal(0);
      done();
    }, 0);
  });

  it('should synchronous add remote row to toggle tree', () => {
    wrapper = mount(
      <Table {...common} loadTreeData={loadTreeDataWithSync} renderModel="tree" levels={0} />,
    );
    const rowLength = wrapper.find('.kuma-uxtable-row').length;
    wrapper.find('.kuma-icon.kuma-icon-triangle-right').at(4).simulate('click');
    expect(wrapper.find('.kuma-uxtable-row').length).to.be(rowLength + 1);
  });

  it('api addSubRow & addSubRowFromTop & updateRow', (done) => {
    wrapper = mount(
      <Table
        {...common}
        loadTreeData={loadTreeDataWithSync}
        renderModel="tree"
        levels={0}
      />
    );
    const table = wrapper.instance()
    expect(table.state.expandedKeys).to.have.length(0)
    table.addSubRow({
      id: '9999',
      radio: true,
      grade: '2grade2',
      email: '2email2',
      firstName: '2firstName2',
      lastName: '2lastName2',
      birthDate: '2birthDate2',
      country: '2country2',
      city: '2city2'
    }, {jsxid: 0}, () => {
      const data = table.getData().data.data;
      expect(data[0].data).to.have.length(4);
      expect(data[0].data[3].id).to.be('9999');
      expect(data[0].data[3].__treeId__).to.be('0-3');
      expect(table.state.expandedKeys.includes(0))
      done();
    });
    table.addSubRowFromTop({
      id: '0000',
      radio: true,
      grade: '2grade2',
      email: '2email2',
      firstName: '2firstName2',
      lastName: '2lastName2',
      birthDate: '2birthDate2',
      country: '2country2',
      city: '2city2'
    }, {jsxid: 0}, () => {
      const data = table.getData().data.data;
      expect(data[0].data).to.have.length(5);
      expect(data[0].data[4].id).to.be('0000');
      expect(data[0].data[4].__treeId__).to.be('0-0');
      done();
    });

    // not tree table
    let wrapper = mount(
      <Table
        {...common}
        loadTreeData={loadTreeDataWithSync}
        levels={0}
      />
    );
    const instance = wrapper.instance()
    instance.addSubRow({
      id: '9999',
      radio: true,
      grade: '2grade2',
      email: '2email2',
      firstName: '2firstName2',
      lastName: '2lastName2',
      birthDate: '2birthDate2',
      country: '2country2',
      city: '2city2'
    }, {jsxid: 0}, () => {
      const data = instance.getData().data.data;
      expect(data[0].data).to.have.length(3);
      done();
    });
    let rowData = instance.getData().data.data[0]
    expect(rowData.firstName).to.be('firstName1')
    expect(rowData.email).to.be('email')
    rowData.email = 'xxxx@126.com'
    delete rowData.firstName
    instance.updateRow(rowData, () => {
      const data = instance.getData().data
      expect(data[0].email).to.be('xxxx@126.com')
      expect(data[0].firstName).to.be(undefined)
    })
  });
});
