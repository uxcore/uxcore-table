/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import Header from "./Header"
import Tbody  from "./Tbody"
import ActionBar from "./ActionBar"
import Pagination  from "uxcore-pagination"

class Grid extends React.Component {

    constructor(props) {
        super(props);

        this.state= {
            data: this.props.jsxdata,
            columns: this.props.jsxcolumns,
            passedData:null,
            params:null,
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
       
    }

    notEmpty(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

    // pagination 
    // column order 
    // filter 

    getQueryStr() {

       let ctx=this,queryStr=[],_props= this.props;
        //passedData right now use as subComp row data, if has passedData
        //that means subComp it is

        if(_props.passedData) {

            let queryObj={},queryKeys=_props.queryKeys;
            if(!queryKeys) {
                queryKeys=_props.passedData;
            }

            queryKeys.forEach(function(key) {
                if(ctx.notEmpty(_props.passedData[key])) {
                    queryObj[key]= _props.passedData[key];
                }
            })

            queryStr= [$.param(queryObj)];
        }

        //params, like form-grid 
        if(!!_props.fetchParams) {
            queryStr.push(_props.fetchParams);
        }

        //pagination
        queryStr.push($.param({pageSize:_props.pageSize,currentPage:this.props.currentPage}))

        //column order
        let  _activeColumn= this.props.activeColumn
        if(_activeColumn) {
            queryStr.push($.param({
               orderColumn: _activeColumn.dataKey,
               orderType: _activeColumn.orderType
            }));
        }

        //search query
        let  _queryTxt= this.props.searchTxt
        if(_queryTxt) {
            queryStr.push($.param({
               searchTxt: _queryTxt
            }));
        }

        queryStr.push($.param({timeStamp:new Date().getTime()}))


        return queryStr;
    }
    // pagination 
    // column order 
    // filter 
    fetchData(obj) {

       let ctx=this
        
        $.ajax({
            url: this.props.fetchUrl+"?"+this.getQueryStr().join("&"),
            success: function(result) {
                let _data= result.content;
                if(result.success) {
                    ctx.props.jsxdata=_data;
                    ctx.props.showMask=false;
                    let updateObj= $.extend({},obj?obj:{},{
                      data: _data,
                      showMask:false
                    })
                    ctx.setState(updateObj)
                }
            }
        })
    }

    //just call once when init
    processData() {

        let props=this.props, columns= props.jsxcolumns,hasCheckedColumn;
        if(!this.props.jsxdata){
            this.props.jsxdata=[];
            this.props.mask=true;
            this.fetchData();
        }
        //this.state.data= this.props.jsxdata;
        columns=columns.map(function(item,index){
            if(item.hidden==undefined) {
                item.hidden=false;
            }
            if(item.dataKey =='jsxchecked') {
                hasCheckedColumn=true;
            }
            return item;
        });

        //if has rowSelection, also attach checked column
        //{ dataKey: 'jsxchecked', width: 30,type:'checkbox'}
        if(props.rowSelection && !hasCheckedColumn) {
           if(props.subComp) {
                this.props.jsxcolumns= [{ dataKey: 'jsxchecked', width: 60,type:'checkbox', align:'right'}].concat(columns)
           }else {
                this.props.jsxcolumns= [{ dataKey: 'jsxchecked', width: 30,type:'checkbox'}].concat(columns)
           }
        }

    }

    //hancle column picker
    handleCP(index) {
        let props= this.props,hidden=props.jsxcolumns[index].hidden;
        if(hidden==undefined) hidden=true;
        props.jsxcolumns[index].hidden= !!hidden ? false: true;
        this.setState({
            columns: props.jsxcolumns
        })
    }

    selectAll(checked) {
        let _data=this.state.data.datas.map(function(item,index){
            item.jsxchecked=checked;
            item.country=item.country;
            return item;
        });

        let rowSelection=this.props.rowSelection

        if(rowSelection && rowSelection.onSelectAll) {
            rowSelection.onSelectAll.apply(null,[checked,_data])
        }
        this.setState({
            data:_data
        })
    }

    onPageChange (index) {

      this.props.currentPage=index;
      this.fetchData();

    }

    renderPager() {
        if(this.props.showPager && this.state.data) {
            return (<div className="kuma-grid-pagination"><Pagination className="mini" total={this.state.data.totalCount} onChange={this.onPageChange.bind(this)} current={this.props.currentPage} pageSize={this.props.pageSize} /></div>)
        }
    }

    handleOrderColumnCB(type, column) {

       this.props.activeColumn=column;
       this.fetchData();

    }

    actionBarCB(type,txt) {
        if(type=='SEARCH') {
           this.props.searchTxt=txt;
           this.fetchData();
        }else {
            let _actionCofig= this.props.actionBar;
            _actionCofig[type]?_actionCofig[type].apply():"";
        }
       
    }

    componentWillMount() {
        this.processData();
    }

    componentWillUpdate() {

    }

    render() {
        console.log("++++grid render+++");
        
        let props= this.props,
        _style= {
            width: props.width,
            height: props.height
        },
        renderBodyProps={
            columns: props.jsxcolumns,
            data: this.state.data?this.state.data.datas:[],
            width: props.width=="100%"?props.width:(props.width-props.headerHeight),
            height: props.height=="100%"?props.height:(props.height-props.headerHeight-props.actionBarHeight-(props.showPager?50:0)),
            onModifyRow: props.onModifyRow?props.onModifyRow: function(){},
            rowSelection: props.rowSelection,
            subComp: props.subComp,
            mask: props.showMask,
            key:'grid-body'
        },
        renderHeaderProps={
            columns:  props.jsxcolumns,
            activeColumn: this.props.activeColumn,
            checkAll: this.selectAll.bind(this),
            columnPicker: props.showColumnPicker,
            //fixed: props.fixed,
            handleCP: this.handleCP.bind(this),
            headerHeight: props.headerHeight,
            width: props.width,
            orderColumnCB: this.handleOrderColumnCB.bind(this),
            key:'grid-header'

        };

        let gridHeader, actionBar;
        if(props.showHeader) {
            gridHeader=<Header {...renderHeaderProps} />
        }

        if(props.actionBar) {
            let renderActionProps={
                actionBarConfig: this.props.actionBar,
                actionBarCB: this.actionBarCB.bind(this),
                key:'grid-actionbar'
            };
            actionBar=<ActionBar {...renderActionProps}/>
        }

        return (<div className={props.jsxprefixCls} style={_style}>
            {actionBar}
            {gridHeader}
            <Tbody  {...renderBodyProps}/>
            {this.renderPager()}
        </div>);

    }

};

Grid.defaultProps = {
    showHeader:true,
    width:"100%",
    height:"100%",
    headerHeight:50,
    actionBarHeight:40,
    showPager:true,
    showColumnPicker: true,
    showMask: true,
    pageSize:10,
    fetchParams:'',
    currentPage:1,
    //like subComp, we have fetchUrl, but also need query key like id to 
    //query data
    queryKeys:[],
    searchTxt:''
}

// http://facebook.github.io/react/docs/reusable-components.html
Grid.propTypes = {
}

Grid.displayName = Grid;

module.exports = Grid;
