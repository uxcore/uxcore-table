/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');
let Hovercard = require("@ali/uxcore-hovercard");
console.log(Hovercard);

let Grid = require('../src');


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
        let me=this;
        // 通过 rowSelection 对象表明需要行选择
        let rowSelection = {
          onSelect: function(record, selected, selectedRows) {
            console.log(record, selected, selectedRows);
            me.setState();
          },
          onSelectAll: function(selected, selectedRows) {
            console.log(selected, selectedRows);
          }
        };

        // title, width, type, hidden,dataKey
        let columns = [
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'country', title:'国家国家国家国家', width: 200,ordered:true, type: "money", delimiter: ','},
            { dataKey: 'city',title:'城市', width: 150},
            { dataKey: 'firstName',title:"FristName" },  
            { dataKey: 'lastName' ,title:"LastName"},
            { dataKey: 'email',title:"Email",width: 200,ordered:true },
            { dataKey: 'action1', title:'操作1', width:100, type:"action",items:[
              {title:'编辑', type:"inlineEdit", cb: function(rowData){console.info(rowData)}},
              {title:'删除', type:"del", cb: function(rowData){console.info(rowData)}}
            ]},
            { dataKey: 'action', title:'链接', width:150,render: function(rowData){
               return <div><a href="#">{rowData.lastName}</a></div>
              }
            }
        ];

        let subCols = [
          {dataKey: 'firstName', title: 'firstName', width: 200},
          {dataKey: 'city', title: '城市', width: 200}
        ]

        let renderSubProps={
            height: 200,
            width: 1196,
            showHeader:true,
            showPager:false,
            jsxcolumns:subCols,
            fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            queryKeys:["firstName", "city"],
            onModifyRow: this.onModifyRow,
            processData: (data) => {return data;}
        };

        let renderProps={
            height: 400,
            width: 1200,
            actionBar: {
               '新增': function(type) { alert(type); },
               'import': function() { alert('import'); },
               'export': function() { alert('export'); },
               'delete': function() { alert('delete'); },
               '黄山': function(type) {alert(type)}
            },
            showSearch: true,
            actionColumn: {
               'edit': function() {},
               'del': function() {}
            },
            fetchParams: {},
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            fetchUrl: "http://192.168.31.117:3000/demo/data.json",
            jsxcolumns:columns,
            subComp:(<Grid {...renderSubProps}  ref="subGrid"/>),
            rowSelection: rowSelection,
            beforeFetch: (sendData, from) => {console.log(from); return sendData;},
            processData: (data) => {return data;}           
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
};

module.exports = Demo;
