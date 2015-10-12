/**
 * Created by xy on 15/4/13.
 */
let Cell = require('./Cell');
let classnames = require('classnames');

class Row extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick() {

    }

    showSubCompFunc() {
        let props= this.props, showSubComp=props.data[props.rowIndex].showSubComp;
        props.data[props.rowIndex].showSubComp=!showSubComp;
        this.forceUpdate();
    }

    renderSubComp() {

        let props= this.props;
        if(props.subComp &&  props.data[props.rowIndex].showSubComp ) {
          let subComp = React.cloneElement(props.subComp,{
            passedData: this.props.data[this.props.rowIndex],
            parentHasCheckbox: !!this.props.rowSelection
          });
          return (<div className="kuma-grid-subrow" ref="subRow">{subComp}</div>)
        }else {
            return false;
        }
    }

    render() {

        let props = this.props,
            _columns = props.columns,
            _style = {},
            _data = props.data,
            me = this,
            otherCls = props.addRowClassName(_data[props.rowIndex]);
        
        return (
            <div className={classnames({
                [this.props.jsxprefixCls]: true,
                [otherCls]: !!otherCls
            })} style={_style} onClick={this.handleClick.bind(this)}>
                {_columns.map(function(item,index){
                    if(item.hidden) return;

                    let renderProps={
                        column: item,
                        root: props.root,
                        align:item.align,
                        rowData: _data[props.rowIndex],
                        cellIndex:index,
                        hasSubComp: props.subComp ? true : false,
                        data:_data,
                        showSubCompCallback:me.showSubCompFunc.bind(me),
                        onModifyRow: props.onModifyRow,
                        rowSelection: props.rowSelection,
                        actions: props.actions,
                        mode: props.mode,
                        key:"cell"+index
                    };
                    //if have vertical data structure, how to process it
                    return <Cell {...renderProps} />
                })}
                {this.renderSubComp()}
            
            </div>
        );
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
