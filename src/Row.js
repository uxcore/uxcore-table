/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import Cell from './cell/index';
class Row extends React.Component {

    constructor(props) {
        super(props);
        // console.log("++row++");
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }

    handleClick() {

    }

    showSubComp() {
        this.props.showSubComp=!this.props.showSubComp;
        this.forceUpdate();
    }

    renderSubComp() {

        let props= this.props;
        if(props.subComp && this.props.showSubComp ) {
          let subComp= React.cloneElement(props.subComp,{
            passedData: this.props.data[this.props.rowIndex],
            parentHasCheckbox: !!this.props.rowSelection
          });
          return (<div className="kuma-grid-subrow" ref="subRow">{subComp}</div>)
        }else {
            return false;
        }
    }

    render() {
        let props= this.props,_columns=props.columns,_style={
          //height: props.rowHeight
        },_data=props.data,ctx=this;

        return (<div className={this.props.jsxprefixCls} style={_style} onClick={this.handleClick.bind(this)}>
            {
                _columns.map(function(item,index){

                    if(item.hidden) return;
                
                    let renderProps={
                        column: item,
                        align:item.align,
                        rowData: _data[props.rowIndex],
                        cellIndex:index,
                        hasSubComp: props.subComp ? true : false,
                        data:_data,
                        showSubCompCallback:ctx.showSubComp,
                        st_showSubComp: ctx.props.showSubComp,
                        ctx:ctx,
                        onModifyRow: props.onModifyRow,
                        rowSelection: props.rowSelection,
                        key:"cell"+index
                    };
                    //if have vertical data structure, how to process it
                    return <Cell {...renderProps} />
                })
            }
            {this.renderSubComp()}
            
        </div>);
    }

};

Row.propTypes= {
    jsxprefixCls: React.PropTypes.string,
    showSubComp: React.PropTypes.bool
};

Row.defaultProps = {
    jsxprefixCls: "kuma-grid-row",
    showSubComp: false
};

export default Row;
