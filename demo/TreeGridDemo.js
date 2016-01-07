/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');
let Grid = require('../src');
let urlPrefix = 'http://10.71.218.54:3000/';


class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           data:this.props.data
        }
    }

    onModifyRow(value,dataKey,record) {
        return true;
    }

    render () {

        let me=this;
        // 通过 rowSelection 对象表明需要行选择
        let rowSelection = {
          onSelect: function(record, selected, selectedRows) {
            console.log(record, selected, selectedRows);
          },
          onSelectAll: function(record, selectedRows) {
            console.log(record, selectedRows);
          }
        };
        //[{title:'编辑', type:"inlineEdit1", cb: function(rowData){ me.refs.grid.toggleSubComp(rowData)}},
        //      {title:'删除', type:"del", cb: function(rowData){ me.refs.grid.delRow(rowData)}}
        //  ]
        // title, width, type, hidden,dataKey
        let columns = [
            //{ dataKey: 'check', title: '复选框', type: 'checkbox'},
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'country', title:'国家国家国家国家', width: 200,ordered:true, type: "money", delimiter: ','},
            { dataKey: 'city',title:'城市', width: 150},
            { dataKey: 'firstName',title:"FristName",beforeRender:function(rowData) {
                return "abc";
            } },  
            { dataKey: 'lastName' ,title:"LastName"},
            { dataKey: 'email',title:"Email",width: 200,ordered:true },
            { dataKey: 'action1', title:'操作1', width:100, type:"action",actions:{
                "编辑": function(rowData, actions) {
                    console.log(actions.addEmptyRow);
                    me.refs.grid.toggleSubComp(rowData);
                },
                "删除": function(rowData) {
                    me.refs.grid.delRow(rowData);
                }
              },
              beforeRender: function(rowData,actionItems) {
                 if(rowData.jsxid%2==0) {
                    return ['编辑'];
                 }else {
                    return ['编辑','删除'];
                 }
                 
              }
            },
            { dataKey: 'action', title:'链接', width:150,render: function(cellData,rowData){
               return <div><a href="#">{rowData.email}</a></div>
              },beforeRender(rowData) {
                return rowData.email;
              }
            }
        ];

        let subCols = [
          {dataKey: 'firstName', title: 'firstName', width: 200},
          {dataKey: 'city', title: '城市', width: 200}
        ]

        let renderSubProps={
            height: 100,
            width: 1196,
            showHeader:true,
            showPager:false,
            jsxcolumns:subCols,
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            queryKeys:["firstName", "city"],
            onModifyRow: this.onModifyRow,
            processData: (data) => {return {datas: [data]};}
        };

        let renderProps={
            height: 400,
            width: 800,
            actionBar: {
               '新增': function(type, actions) { console.info(actions); alert(type) },
               '黄山': function(type) {alert(type)}
            },
            showSearch: true,
            fetchParams: {},
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            fetchUrl: urlPrefix + "demo/data.json",
            jsxcolumns:columns,
            renderModel:'tree',
            //rowSelection: rowSelection,
            addRowClassName: (rowData) => {},
            beforeFetch: (sendData, from) => { return sendData;},
            processData: (data) => {return data;}           
        };
        return (<Grid {...renderProps}  ref="grid"/>);
      }
};

module.exports = Demo;
