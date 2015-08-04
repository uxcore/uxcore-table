/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import Header from "./header"
import Tbody  from "./tbody"
import Pagination  from "uxcore-pagination"

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

    processData() {
        let props=this.props, columns= props.jsxcolumns,hasCheckedColumn;

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
           this.props.jsxcolumns= [{ dataKey: 'jsxchecked', width: 30,type:'checkbox'}].concat(columns)
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
        /*this.setState({
            currentPage:index
        })*/
        this.props.onPageChange.apply(null,[index])
    }

    renderPager() {
        if(this.props.onPageChange) {
            return (<div className="kuma-grid-pagination"><Pagination total={this.props.jsxdata.length} onChange={this.onPageChange.bind(this)} current={this.state.currentPage}/></div>)
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
            rowSelection: props.rowSelection
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

        return (<div className={props.jsxprefixCls}>
            <Header {...renderHeaderProps} />
            <Tbody  {...renderBodyProps}/>
            {this.renderPager()}
        </div>);

    }

};

Grid.propTypes= {
};

Grid.defaultProps = {
    jsxprefixCls: "kuma-grid"
};

export default Grid;