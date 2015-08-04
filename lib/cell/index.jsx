/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import CheckBox from './checkBox';
import TextField from './textField';

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            'mode':'view'
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }

    prepareStyle() {

    }
    handleClick(e) {
        this.setState({
            mode:"edit"
        })
    }

    getSelectionRows() {
        var _props= this.props;
        return _props.data.filter(function(item) {
            return item.jsxchecked
        });
    }
    handleCheckChange(e) {
        var _props= this.props,v=_props.data[_props.index];
        v.jsxchecked=e.target.checked;
        this.setState({});
        if( _props.rowSelection) {
            _props.rowSelection.onSelect.apply(null,[v.jsxchecked,v,this.getSelectionRows()])
        }
    }
    handleTxtChange(e){
        var _props= this.props;
        _props.data[_props.index][_props.column.dataKey]=e.target.value;
    }
    onblur(e) {
       var _props= this.props;
       
        var isValid=_props.onModifyRow.apply(null,[_props.data[_props.index]]);
        if(isValid) {
            this.setState({
                mode:"view"
            });
        }else {
           e.target.focus?e.target.focus():"";
        }
    }
    render() {
        
        let props= this.props,_column=props.column, _width=_column.width, _style={
            width: _width?_width:100
        },_v=props.data[props.index],renderProps;

        if(_column.type=='checkbox') {
            let checked;
            if(_v.jsxchecked){
                checked='checked'
            }else {
                checked="";
            }
            _v=<CheckBox jsxchecked={checked} ref="checkbox" onchange={this.handleCheckChange.bind(this)}/>

        }else if(_column.type=='text' && this.state.mode=='edit') {
            renderProps={
                value: _v[_column.dataKey],
                onchange:this.handleTxtChange.bind(this),
                onblur:this.onblur.bind(this)
            }
            _v=<TextField {...renderProps}/>
        }
        else {
            _v=<span>{props.data[props.index][_column.dataKey]}</span>;
        }
        return (<div className={props.jsxprefixCls} style={_style} onClick={this.handleClick.bind(this)}>
            {_v}
        </div>);

        
    }

};

Cell.propTypes= {
};

Cell.defaultProps = {
    jsxprefixCls: "kuma-grid-cell"
};

export default Cell;