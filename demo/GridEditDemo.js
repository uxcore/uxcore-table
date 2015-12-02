/**
 * Grid Component Demo for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');
let Validator = require('uxcore-validator');
let Button = require('uxcore-button');
let Select = require('uxcore-select2');
let {Option} = Select; 
let Grid = require('../src');
let {Constants} = Grid
let mockData = {
    "data": [
        {
            "check": true,
            "id":"1",
            "grade":"grade1",
            "email":"email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1email1",
            "name":"firstName1",
            "lastName":"lastName1",
            "birthDate":"birthDate1",
            "country":"086156529655931.121(xsxs)",
            "city":"87181"
        },
        {
            "check": false,
            "id":"2",
            "grade":"grade2",
            "email":"email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2",
            "name":"firstName2",
            "lastName":"lastName2",
            "birthDate":"birthDate2",
            "country":"086156529655931.121(xsxs)",
            "city":"87181"
        }
    ]
}

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           data:mockData,
           showOtherColumn: false
        }
    }

    handleClick() {
        this.setState({
            showOtherColumn: !this.state.showOtherColumn
        })
    }

    getTableValues() {
        console.log(this.refs.grid.getData());
    }

    handleChangeData() {
        this.setState({
            data: {
                data: this.state.data.data.concat({
                    "check": false,
                    "id":"3",
                    "grade":"grade3",
                    "email":"email3email3email3email",
                    "name":"firstName3",
                    "lastName":"lastName3",
                    "birthDate":"birthDate3",
                    "country":"086156539655931.121(xsxs)",
                    "city":"87181" 
                })
            }
        })
    }

    handleTableChange(data, dataKey, pass) {
        console.log(data['data']);
    }

    render () {
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

        // title, width, type, hidden,dataKey
        let columns = [
            { dataKey: 'jsxid',title:"jsxid",width: 80 },  
            { dataKey: 'city',title:'城市很长很长很长很长很长很长很长很长很长很长', width: 200, type:'select', children: ['1', '2', '3', '4', '87181'].map((item) => {
                return <Option key={item}>{item}</Option>
            }), config: {filterOption: false}},
            { dataKey: 'name',title:"姓名",width: 200,type:"text", rules: {validator: function(value) {
                if (value == undefined) {
                    return false
                }
                else {
                    return value.length < 5;
                }
            }}},  
            { dataKey: 'email',title: "Email", width: 200,type:"text", rules: {validator: Validator.isEmail, errMsg: ""}},
            { dataKey: 'action1', title: '操作1', width:100, type:"action", actions: [
                    {
                        title: '编辑',
                        callback: (rowData) => {
                            me.refs.grid.editRow(rowData);
                        },
                        mode: Constants.MODE.VIEW
                    },
                    {
                        title: '保存',
                        callback: (rowData) => {
                            me.refs.grid.viewRow(rowData);
                        },
                        mode: Constants.MODE.EDIT
                    },
                    {
                        title: '删除',
                        callback: (rowData) => {
                            me.refs.grid.delRow(rowData);
                        },
                        mode: Constants.MODE.VIEW
                    },
                    {
                        title: '重置',
                        callback: (rowData) => {
                            me.refs.grid.resetRow(rowData);
                        },
                        mode: Constants.MODE.EDIT
                    }
                ]
            }
        ];

        if (me.state.showOtherColumn) {
            columns.push({ dataKey: 'city',title:'城市', width: 150})
        }


        let renderProps={
            // height: 200,
            width: 1000,
            showPager:false,
            fetchParams: {},
            jsxdata: me.state.data,
            actionBar: {
                '新增行': () => {
                    me.refs.grid.addEmptyRow();
                }
            },
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            // fetchUrl: "http://10.1.159.52:3002/demo/data.json",
            jsxcolumns:columns,
            beforeFetch: (sendData) => {sendData.id = 1; return sendData;},
            processData: (data) => {return data;},
            rowSelection: rowSelection,
            onChange: me.handleTableChange       
        };
        return (
            <div>
                <Grid {...renderProps}  ref="grid"/>
                <Button onClick={me.handleClick.bind(me)}>手动修改 column</Button>
                <Button onClick={me.handleChangeData.bind(me)}>手动修改 data</Button>
                <Button onClick={me.getTableValues.bind(me)}>获取 Table 的值</Button>
            </div>
        );
      }
};

module.exports = Demo;
