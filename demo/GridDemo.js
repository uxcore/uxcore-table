/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let Grid = require('../src');

// 通过 rowSelection 对象表明需要行选择
let rowSelection = {
  onSelect: function(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: function(selected, selectedRows) {
    console.log(selected, selectedRows);
  }
};

// title, width, type, hidden,dataKey
let columns = [
    { dataKey: 'id', title: 'ID', width: 50,hidden:true},
    { dataKey: 'country', title:'国家', width: 200,ordered:true},
    { dataKey: 'city',title:'城市', width: 150,ordered:true },
    { dataKey: 'firstName',title:"FristName" },  
    { dataKey: 'lastName' ,title:"LastName"},
    { dataKey: 'email',title:"Email",width: 200,ordered:true }
]


class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           data:this.props.data
        }
    }

    onPageChange(pageIndex) {

          this.setState({
             mask: true
          })

          setTimeout(function() {
            this.setState({
             data: gen(20),
             mask: false
            });
          }.bind(this),1000);
          
      }
      onModifyRow(value,dataKey,record) {
        //doValidate
        //debugger;
        //return false;
        return true;
      }
      render () {

        let renderSubProps={
            width: 700,
            height:200,
            jsxcolumns:columns,
            fetchUrl:"http://localhost:3000/demo/data.json",
            params:["dataKey","firstName"],
            onModifyRow: this.onModifyRow
        };

        let renderProps={
            headerHeight:50,
            width:700,
            height:500,
            columnPicker: true,
            //onPageChange: this.onPageChange,
            onModifyRow: this.onModifyRow,
            rowSelection: rowSelection,
            //jsxdata:this.state.data,
            fetchUrl:"http://localhost:3000/demo/data.json",
            subComp:(<Grid {...renderSubProps}  ref="subGrid"/>),
            jsxcolumns:columns,
            mask: true
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
};

module.exports = Demo;
