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
import Mask from "./Mask"

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            currentPage:1,
            data: this.props.jsxdata,
            columns: this.props.jsxcolumns
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
       
    }

    fetchData() {
        let ctx=this,queryStr="";
        //__rowData right now use as subComp row data, if has __rowData
        //that means subComp it is
        if(this.props.__rowData) {
            let queryObj={};
            this.props.params.forEach(function(key) {
                if(ctx.props.__rowData[key]) {
                    queryObj[key]= ctx.props.__rowData[key];
                }
            })
            queryStr= $.param(queryObj)+"&";
        }
        $.ajax({
            url: this.props.jsxurl+"?"+queryStr+new Date().getTime(),
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
        this.props.onPageChange.apply(null,[index]);
    }

    renderPager() {
        if(this.props.onPageChange) {
            return (<div className="kuma-grid-pagination"><Pagination className="mini" total={this.props.jsxdata.length} onChange={this.onPageChange.bind(this)} current={this.state.currentPage}/></div>)
        }
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
            subComp: props.subComp
        },
        renderHeaderProps={
            columns:  props.jsxcolumns,
            checkAll: this.selectAll.bind(this),
            columnPicker: props.columnPicker,
            fixed: props.fixed,
            handleCP: this.handleCP.bind(this),
            headerHeight: props.headerHeight,
            width: props.width
        };

        let gridHeader;
        if(props.headerHeight) {
            gridHeader=<Header {...renderHeaderProps} />
        }
        return (<div className={props.jsxprefixCls}>
            {gridHeader}
            <Tbody  {...renderBodyProps}/>
            {this.renderPager()}
            <Mask visible={props.mask}/>
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
