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
      },
    ],
    currentPage: 1,
    totalCount: 30,
  },
};

describe('Tree', () => {
  let wrapper;
  it('props renderModel', () => {
    wrapper = mount(
      <Table {...common} renderModel="tree" />
    );
    expect(wrapper.find('.kuma-uxtable-expand-icon').length).not.to.be(0);
  });

  it('props levels', () => {
    wrapper = mount(
      <Table {...common} renderModel="tree" levels={1} />
    );
    expect(wrapper.find('.kuma-uxtable-expand-icon .kuma-icon').at(0).hasClass('expanded')).to.be(true);
  });
});

