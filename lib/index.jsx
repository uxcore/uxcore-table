/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import Header from "./header"
import Tbody  from "./tbody"

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.processData();
        this.state= {
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
        let columns= this.props.jsxcolumns;
        columns=columns.map(function(item,index){
            if(item.hidden==undefined) {
                item.hidden=false;
            }
            return item;
        });
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
        var _data=this.state.data.map(function(item,index){
            item.checked=checked;
            item.country=item.country;
            return item;
        });
        this.setState({
            data:_data
        })
    }

    render() {

        let props= this.props,
        renderBodyProps={
            columns: props.jsxcolumns,
            data: this.state.data,
            onModifyRow: props.onModifyRow?props.onModifyRow: function(){}
        },
        renderHeaderProps={
            columns:  this.state.columns,
            checkAll: this.selectAll.bind(this),
            columnPicker: props.columnPicker,
            fixed: props.fixed,
            handleCP: this.handleCP.bind(this)
        };

        return (<div className={props.jsxprefixCls}>
            <Header {...renderHeaderProps} />
            <Tbody  {...renderBodyProps}/>
        </div>);

    }

};

Grid.propTypes= {
};

Grid.defaultProps = {
    jsxprefixCls: "kuma-grid"
};

export default Grid;