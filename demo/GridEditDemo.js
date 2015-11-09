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
let Grid = require('../src');
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
            "id":"2",
            "grade":"grade2",
            "email":"email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2email2",
            "firstName":"firstName2",
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
           data:this.props.data,
           showOtherColumn: false
        }
    }

    onModifyRow(value,dataKey,record) {
        //doValidate
        //debugger;
        //return false;
        return true;
    }

    handleClick() {
        this.setState({
            showOtherColumn: !this.state.showOtherColumn
        })
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
        // let columns = [
        //     { dataKey: 'jsxid',title:"jsxid",width: 40 },  
        //     { dataKey: 'city',title:'城市', width: 180,type:'select' ,options:{
        //        'hz':'杭州',
        //        'bj':'北京',
        //        'sh':'上海',
        //        'ah':'安徽'
        //     }},
        //     { dataKey: 'name',title:"姓名",width: 200,type:"text"},  
        //     { dataKey: 'email',title:"Email",width: 200,type:"text"},
        //     { dataKey: 'action1', title:'操作1', width:100, type:"action",actions:{
        //         "增加": function(rowData) {
        //             me.refs.grid.addEmptyRow();
        //         },
        //         "删除": function(rowData) {
        //             me.refs.grid.delRow(rowData);
        //         }
        //       }
        //     }
        // ];

        // Edit mode but no inline edit
        let columns = [
            { dataKey: 'check', title: '复选框', type: 'checkbox'},
            { dataKey: 'id', title: 'ID', width: 50,hidden:true},
            { dataKey: 'country', title:'国家国家国家国家', width: 200,ordered:true, type: "money", delimiter: ','}
        ];

        if (me.state.showOtherColumn) {
            columns.push({ dataKey: 'city',title:'城市', width: 150})
        }


        let renderProps={
            height: 200,
            width: 800,
            showPager:false,
            fetchParams: {},
            jsxdata: mockData,
            // fetchUrl:"http://demo.nwux.taobao.net/file/getGridJson.jsonp",
            // fetchUrl: "http://10.1.159.52:3002/demo/data.json",
            jsxcolumns:columns,
            beforeFetch: (sendData) => {sendData.id = 1; return sendData;},
            processData: (data) => {return data;},
            rowSelection: rowSelection           
        };
        return (
            <div>
                <Grid {...renderProps}  ref="grid"/>
                <Button onClick={me.handleClick.bind(me)}>手动修改column</Button>
            </div>
        );
      }
};

module.exports = Demo;
