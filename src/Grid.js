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
import Pagination  from "uxcore-pagination"

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            currentPage:1,
            data: this.props.jsxdata,
            columns: this.props.jsxcolumns,
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
       let ctx=this,queryStr=[];
        //__rowData right now use as subComp row data, if has __rowData
        //that means subComp it is
        if(this.props.__rowData) {

            let queryObj={};

            this.props.params.forEach(function(key) {
                if(ctx.props.__rowData[key]) {
                    queryObj[key]= ctx.props.__rowData[key];
                }
            })
            queryStr= [$.param(queryObj)];
        }

        //pagination
        queryStr.push($.param({pageSize:10,currentPage:this.state.currentPage}))

        //column order

        queryStr.push($.param({timeStamp:new Date().getTime()}))

        let  _activeColumn= this.state.activeColumn
        if(_activeColumn) {
            queryStr.push($.param({
               orderColumn: _activeColumn.dataKey,
               orderType: _activeColumn.orderType
            }));
        }
        return queryStr;
    }

    fetchData() {

       let ctx=this
        // pagination 
        // column order 
        // filter 

        $.ajax({
            url: this.props.fetchUrl+"?"+this.getQueryStr().join("&"),
            success: function(result) {
                let _data= result.content.datas;
                if(result.success) {
                    ctx.props.jsxdata=_data;
                    ctx.props.mask=false;
                    ctx.setState({
                        data: _data,
                        mask:false
                    })
                }
            }
        })
    }

    processData() {

        let props=this.props, columns= props.jsxcolumns,hasCheckedColumn;
        if(!this.props.jsxdata){
            this.props.jsxdata=[];
            //this.props.mask=true;
            this.fetchData();
        }
        this.state.data= this.props.jsxdata;
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
        let _data=this.state.data.map(function(item,index){
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
        this.state.currentPage=index;
        this.fetchData();
        //this.props.onPageChange.apply(null,[index]);
    }

    renderPager() {
        //if(this.props.onPageChange) {
        return (<div className="kuma-grid-pagination"><Pagination className="mini" total={this.props.jsxdata.length} onChange={this.onPageChange.bind(this)} current={this.state.currentPage}/></div>)
        //}
    }

    handleOrderColumnCB(type, column) {

       console.log("111");
       console.info(this);
       console.info(this.setState);
       this.setState({
          test:1,
          activeColumn: column
       });

       console.info(this.state);
       this.fetchData();
    }

    render() {
        this.processData();
        let props= this.props,
        renderBodyProps={
            columns: props.jsxcolumns,
            data: this.state.data,
            width: props.width,
            height: props.height,
            onModifyRow: props.onModifyRow?props.onModifyRow: function(){},
            rowSelection: props.rowSelection,
            subComp: props.subComp,
            mask: props.mask
        },
        renderHeaderProps={
            columns:  props.jsxcolumns,
            activeColumn: this.state.activeColumn,
            checkAll: this.selectAll.bind(this),
            columnPicker: props.columnPicker,
            //fixed: props.fixed,
            handleCP: this.handleCP.bind(this),
            headerHeight: props.headerHeight,
            width: props.width,
            orderColumnCB: this.handleOrderColumnCB.bind(this)
        };

        let gridHeader;
        if(props.headerHeight) {
            gridHeader=<Header {...renderHeaderProps} />
        }
        return (<div className={props.jsxprefixCls}>
            {gridHeader}
            <Tbody  {...renderBodyProps}/>
            {this.renderPager()}
        </div>);

    }

};

Grid.defaultProps = {
}

// http://facebook.github.io/react/docs/reusable-components.html
Grid.propTypes = {
}

Grid.displayName = Grid;

module.exports = Grid;
