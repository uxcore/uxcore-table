/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');
let Grid = require('../src');
let Button = require('uxcore-button');
let urlPrefix = 'http://localhost:3000/';
let mockData = {
    "datas": [
        {
            "check": true,
            "id":"1",
            "grade":"grade1",
            "email":"email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1",
            "firstName":"firstName1",
            "lastName":"lastName1",
            "birthDate":"birthDate1",
            "country":"086156529655931.121(xsxs)",
            "city":"87181"
        },
        {
            "check": false,
            "id":"1",
            "grade":"grade1",
            "email":"email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1",
            "firstName":"firstName1",
            "lastName":"lastName1",
            "birthDate":"birthDate1",
            "country":"086156529655931.121(xsxs)",
            "city":"87181"
        }
    ]
}


/*
class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           data:this.props.data
        }
    }

    onModifyRow(value,dataKey,record) {
        //doValidate
        //debugger;
        //return false;
        return true;
    }

      render () {
        console.log("demo render");
        let me=this;
        // 通过 rowSelection 对象表明需要行选择
        let rowSelection = {
          onSelect: function(record, selected, selectedRows) {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: function(selected, selectedRows) {
            console.log(selected, selectedRows);
          }
        };

        let doAction= function(rowData,e) {
            let el=$(e.target);
            if(el.hasClass('action')) {
               if( el.data('type') =='edit') {
                  console.info(rowData,el.data('type'));
               }else if(el.data('type') =='del') {
                 console.info(rowData,el.data('type'));
               }
            }
        }
        // title, width, type, hidden,dataKey
        let columns = [
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'country', title:'国家', width: 200,ordered:true},
            { dataKey: 'city',title:'城市', width: 150,ordered:true },
            { dataKey: 'firstName',title:"FristName" },  
            { dataKey: 'lastName' ,title:"LastName"},
            { dataKey: 'email',title:"Email",width: 200,ordered:true },
            { dataKey: 'action1', title:'操作1', width:100, type:"action",actions:{
                "clickme": function(rowData, actions) {
                    alert('thanks clickme,'+rowData.firstName)
                },
                "del": function(rowData) {
                    me.refs.grid.delRow(rowData);
                }
              },
              beforeRender: function(rowData,actionItems) {
                 if(rowData.jsxid%2==0) {
                    return ['clickme'];
                 }else {
                    return ['clickme','del'];
                 }

              }
            },
            { dataKey: 'action', title:'链接', width:100,render: function(rowData){
               return <div><a href="#">111</a></div>
              }
            }
        ]

        let fetchUrl = './demo/data.json';
        let renderSubProps={
            showHeader:false,
            showPager:false,
            //showMask:false,
            jsxcolumns:columns,
            fetchUrl: fetchUrl,
            queryKeys:["dataKey","firstName"],
            onModifyRow: this.onModifyRow
        };

        let renderProps={

            actionColumn: {
               'edit': function() {},
               'del': function() {}
            },
            actionBar: {
               'action button': function(type, table) { 
                   alert(type);
                },
            },
            showSearch:true,
            fetchParams:'',
            fetchUrl: fetchUrl,
            jsxcolumns:columns,
            //onModifyRow: this.onModifyRow,
            rowSelection: rowSelection
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
};
//*/



///* 第一列为radio的demo
class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           data:this.props.data
        }
    }

    onModifyRow(value,dataKey,record) {
        //doValidate
        //debugger;
        //return false;
        return true;
    }

      render () {
        console.log("demo render");
        let me=this;
        // 通过 rowSelection 对象表明需要行选择
        let rowSelection = {
          onSelect: function(record, selected, selectedRows) {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: function(selected, selectedRows) {
            console.log(selected, selectedRows);
          }
        };

        let doAction= function(rowData,e) {
            let el=$(e.target);
            if(el.hasClass('action')) {
               if( el.data('type') =='edit') {
                  console.info(rowData,el.data('type'));
               }else if(el.data('type') =='del') {
                 console.info(rowData,el.data('type'));
               }
            }
        }
        // title, width, type, hidden,dataKey
        let columns = [
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'radio', title:'', type: 'radioSelector' /*checkboxSelector*/, width: 50, isDisable: function (rowData) {
              return rowData.id > 5;
            }},
            { dataKey: 'country', title:'国家', width: 200,ordered:true},
            { dataKey: 'city',title:'城市', width: 150,ordered:true },
            { dataKey: 'firstName',title:"FristName" },  
            { dataKey: 'lastName' ,title:"LastName"},
            { dataKey: 'email',title:"Email",width: 200,ordered:true },
            { dataKey: 'action1', title:'操作1', width:100, type:"action",actions:{
                "clickme": function(rowData, actions) {
                    alert('thanks clickme,'+rowData.firstName)
                },
                "del": function(rowData) {
                    me.refs.grid.delRow(rowData);
                }
              },
              beforeRender: function(rowData,actionItems) {
                 if(rowData.jsxid%2==0) {
                    return ['clickme'];
                 }else {
                    return ['clickme','del'];
                 }

              }
            },
            { dataKey: 'action', title:'链接', width:100,render: function(rowData){
               return <div><a href="#">111</a></div>
              }
            }
        ]

        let fetchUrl = './demo/GridDemoData.json';
        let renderSubProps={
            showHeader:false,
            showPager:false,
            //showMask:false,
            jsxcolumns:columns,
            fetchUrl: fetchUrl,
            queryKeys:["dataKey","firstName"],
            onModifyRow: this.onModifyRow
        };

        let renderProps={

            actionColumn: {
               'edit': function() {},
               'del': function() {}
            },
            actionBar: {
               'action button': function(type, table) { 
                   alert(type);
                },
            },
            showSearch:true,
            fetchParams:'',
            fetchUrl: fetchUrl,
            jsxcolumns:columns,
            //onModifyRow: this.onModifyRow,
            rowSelection: rowSelection
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
};
//*/

module.exports = Demo;
