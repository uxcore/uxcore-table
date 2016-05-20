/**
 * Table Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');
let Table = require('../src');
let urlPrefix = 'http://30.10.29.74:3000/';


class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  render() {

    let me = this;
    let columns = [
      {
        dataKey: 'id',
        title: 'ID',
        width: 50,
        hidden: true
      },
      {
        dataKey: 'country',
        title: '国家国家国家国家',
        width: 200,
        ordered: true,
        type: 'money',
        delimiter: ','
      },
      {
        dataKey: 'city',
        title: '城市',
        width: 150
      },
      {
        dataKey: 'firstName',
        title: 'FristName'
      },
      {
        dataKey: 'lastName',
        title: 'LastName'
      },
      {
        dataKey: 'email',
        title: 'Email',
        width: 200,
        ordered: true
      }
    ];

    let renderProps = {
      height: 400,
      width: 800,
      showSearch: true,
      fetchUrl: urlPrefix + 'demo/data.json',
      jsxcolumns: columns,
      renderModel: 'tree'
    };
    return (<Table {...renderProps} ref="table" />);
  }
}

module.exports = Demo;
