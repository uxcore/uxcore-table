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
    handleChange(e){
        console.info(e.target.value);
        var _props= this.props;
        _props.data[_props.index][_props.column.name]=e.target.value;
    }
    onblur() {
       this.setState({
            mode:"view"
        })
    }
    render() {
        
        let props= this.props,_column=props.column, _width=_column.width, _style={
            width: _width?_width:100
        },_v=props.data[props.index];

        if(_column.type=='checkbox') {
            let checked;
            if(_v.checked){
                checked='checked'
            }else {
                checked="";
            }
            _v=<CheckBox checked={checked} ref="checkbox" onchange={this.handleChange.bind(this)}/>
        }else if(_column.type=='text' && this.state.mode=='edit') {
            _v=<TextField value={_v[_column.name]} onchange={this.handleChange.bind(this)} onblur={this.onblur.bind(this)}/>
        }
        else {
            _v=<span>{props.data[props.index][_column.name]}</span>;
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