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
let RadioGroup = require('uxcore-radiogroup');
let RadioItem = RadioGroup.Item;
let Table = require('../src');
let RadioField = require('./RadioField');
let PlaceSelect = require('./PlaceSelect');
// let {Constants} = Table;
let Constants = require('uxcore-const')
let mockData = {
    "data": [
        {
            "email":"xw@abc.com",
            "nameId": "xiaowang",
            "name":"小王",
            "cityId": "bj",
            "city":"北京"
        },
        {
            "email":"xl@abc.com",
            "nameId": "xiaoli",
            "name":"小李",
            "cityId": "hz",
            "city":"杭州"
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


    getTableValues() {
        console.log(this.refs.grid.getData());
    }

    handleTableChange(data) {
        console.log(data);
    }

    handleDataChange() {
        let me = this;
        me.setState({
            data: {
                "data": [
                    {
                        "email":"xw@abc.com",
                        "nameId": "xiaowang",
                        "name":"小王",
                        "cityId": "bj",
                        "city":"北京"
                    },
                    {
                        "email":"xl@abc.com",
                        "nameId": "xiaoli",
                        "name":"小李",
                        "cityId": "hz",
                        "city":"杭州"
                    },
                    {
                        "email":"xl@abc.com",
                        "nameId": "xiaoli",
                        "name":"小李",
                        "cityId": "hz",
                        "city":"杭州"
                    }
                ]
            }
        });
    }

    render () {
        let me = this;
        let columns = [
            { dataKey: 'jsxid', title: 'jsxid', width: 80},
            { dataKey: 'city', editKey: 'cityId',title:'城市', width: 200, type:'select', renderChildren: () => {
                return [{id: 'bj', name: '北京'},{id: 'hz', name: '杭州'}].map((item) => {
                    return <Option key={item.id}>{item.name}</Option>
                });
            }, config: {filterOption: false}, canEdit: function(rowData) { return rowData.name !== "小王"}, rules: {validator: function() {return false}, errMsg: '出错了'}},
            { dataKey: 'name', editKey: 'nameId', title:"姓名", width: 200, type:"custom", customField: RadioField, renderChildren: () => {
                return [{id: 'xiaoli', name: '小李'}, {id: 'xiaowang', name: '小王'}].map((item) => {
                    return <RadioItem key={item.id} text={item.name} value={item.id} />
                });
            }},  
            { dataKey: 'email', title: "Email", width: 200,type:"text", rules: {validator: Validator.isEmail, errMsg: ""}, config: {onBlur: function(e) {console.log(e);} }},
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
                            me.refs.grid.saveRow(rowData);
                        },
                        mode: Constants.MODE.EDIT
                    },
                    {
                        title: '删除',
                        callback: (rowData) => {
                            me.refs.grid.delRow(rowData);
                        },
                        // mode: Constants.MODE.VIEW
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


        let renderProps={
            // height: 200,
            width: 1000,
            showPager:false,
            fetchParams: {},
            showHeaderBorder: true,
            getSavedData: true,
            jsxdata: me.state.data,
            doubleClickToEdit: true,
            actionBar: [
                {
                    title: '新增行',
                    callback: () => {
                        me.refs.grid.addEmptyRow();
                    },
                    render: (title) => {
                        return <Button>{title}</Button>
                    }
                },
                {
                    title: "编辑所有行",
                    callback: () => {
                        me.refs.grid.editAllRow();
                    }
                },
                {
                    title: "保存所有行",
                    callback: () => {
                        me.refs.grid.saveAllRow();
                    }
                }
                
            ],
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            // fetchUrl: "http://10.1.159.52:3002/demo/data.json",
            jsxcolumns:columns,
            beforeFetch: (sendData) => {sendData.id = 1; return sendData;},
            processData: (data) => {return data;},
            onChange: me.handleTableChange       
        };

        return (
            <div>
                <Table {...renderProps}  ref="grid"/>
                <Button onClick={me.getTableValues.bind(me)}>获取 Table 的值</Button>
                <Button onClick={me.handleDataChange.bind(me)}>更改 Data</Button>
            </div>
        );
      }
};

module.exports = Demo;
