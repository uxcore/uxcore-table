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
            currentPage:1,
            data: this.props.jsxdata,
            columns: this.props.jsxcolumns,
            __rowData:null,
            params:null,
            activeColumn:null
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
       
    }

    // pagination 
    // column order 
    // filter 

    getQueryStr() {

       let ctx=this,queryStr=[],_props= this.props;
        //__rowData right now use as subComp row data, if has __rowData
        //that means subComp it is

        if(_props.__rowData) {

            let queryObj={},params=_props.params;
            if(!params) {
                params=_props.__rowData;
            }

            params.forEach(function(key) {
                if(_props.__rowData[key]) {
                    queryObj[key]= _props.__rowData[key];
                }
            })

            queryStr= [$.param(queryObj)];
        }

        //params, like form-grid 
        if(!!_props.fetchParams) {
            queryStr.push(_props.fetchParams);
        }

        //pagination
        queryStr.push($.param({pageSize:_props.pageSize,currentPage:this.state.currentPage}))

        //column order
        let  _activeColumn= this.state.activeColumn
        if(_activeColumn) {
            queryStr.push($.param({
               orderColumn: _activeColumn.dataKey,
               orderType: _activeColumn.orderType
            }));
        }

        //search query
        let  _queryTxt= this.state.searchTxt
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
    fetchData() {

       let ctx=this
        
        $.ajax({
            url: this.props.fetchUrl+"?"+this.getQueryStr().join("&"),
            success: function(result) {
                let _data= result.content;
                if(result.success) {
                    //ctx.props.jsxdata=_data;
                    ctx.props.showMask=false;
                    ctx.setState({
                        data: _data,
                        showMask:false
                    })
                }
            }
        })
    }

    processData() {

        let props=this.props, columns= props.jsxcolumns,hasCheckedColumn;
        if(!this.state.data){
            //this.props.jsxdata=[];
            //this.props.mask=true;
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

       this.setState( {
          currentPage: index
       },function() {
            this.fetchData();
       });

    }

    renderPager() {
        if(this.props.showPager && this.state.data) {
            return (<div className="kuma-grid-pagination"><Pagination className="mini" total={this.state.data.totalCount} onChange={this.onPageChange.bind(this)} current={this.state.currentPage} pageSize={this.props.pageSize} /></div>)
        }
    }

    handleOrderColumnCB(type, column) {

       this.setState({
          activeColumn: column
       },function(){
            this.fetchData();
       });
       
    }

    actionBarCB(type,txt) {
        if(type=='SEARCH') {
           this.setState({
              searchTxt: txt
           },function(){
                this.fetchData();
           });
        }else {
            let _actionCofig= this.props.actionBar;
            _actionCofig[type]?_actionCofig[type].apply():"";
        }
       
    }

    render() {
        this.processData();
        let props= this.props,
        _style= {
            width: props.width,
            height: props.height
        },
        renderBodyProps={
            columns: props.jsxcolumns,
            data: this.state.data?this.state.data.datas:[],
            width: props.width,
            height: props.height,
            onModifyRow: props.onModifyRow?props.onModifyRow: function(){},
            rowSelection: props.rowSelection,
            subComp: props.subComp,
            mask: props.showMask,
            key:'grid-body'
        },
        renderHeaderProps={
            columns:  props.jsxcolumns,
            activeColumn: this.state.activeColumn,
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
    showPager:true,
    showColumnPicker: true,
    showMask: true,
    pageSize:10,
    fetchParams:'',
    //like subComp, we have fetchUrl, but also need query key like id to 
    //query data
    queryKeys:[]
}

// http://facebook.github.io/react/docs/reusable-components.html
Grid.propTypes = {
}

Grid.displayName = Grid;

module.exports = Grid;
