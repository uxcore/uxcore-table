/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import CheckBox from '../cell/checkBox';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
        };
    }

    componentDidMount() {
        window.addEventListener('click', this.handleGlobalClick.bind(this));
    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
        window.removeEventListener('click', this.handleGlobalClick.bind(this));
    }

    prepareStyle() {

    }

    handleGlobalClick() {
        if(this.props.columnPicker) {
            this.hideColumnPick();
        }
    }
    handleCheckBoxChange() {
        let v=this.refs.checkbox.getValue();
        this.props.checkAll.apply(null,[v]);
    }

    handleColumnPicker(e) {
        e.stopPropagation();
        var node=this.refs.columnpicker.getDOMNode();
        if(node.style.display=='block') {
            node.style.display='none';
        }else {
            node.style.display='block';
        }
    }

    hideColumnPick() {
        var node=this.refs.columnpicker.getDOMNode();
        node.style.display='none';
    }

    handleColumns(index) {
        this.props.handleCP.apply(null,[index]);
    }

    //prepare the column picker html fragement
    preparePicker() {
        let me= this;
        return (<div className="kuma-column-picker-container">
            <i className="kuma-icon kuma-icon-target-list kuma-column-picker" onClick={this.handleColumnPicker.bind(this)}></i>
            <ul className="kuma-grid-colmnpicker" ref="columnpicker">
                {
                    this.props.columns.map(function(item,index) {
                        if(item.dataKey=='jsxchecked') return;
                        if(item.hidden) {
                            return <li ref="" onClick={me.handleColumns.bind(me,index)}>{item.title}</li>
                        }else {
                            return <li ref="" onClick={me.handleColumns.bind(me,index)}><i className="kuma-icon kuma-icon-choose"></i>{item.title}</li>

                        }
                    })
                }
             </ul>
        </div>)
    }

    render() {

        let props= this.props, me=this,_picker;

        if(this.props.columnPicker) {
             _picker=this.preparePicker();
        }

        let _style={ 
            height: props.headerHeight?props.headerHeight:40,
            width: props.width,
            lineHeight: (props.headerHeight?props.headerHeight:40)+"px"
        }

        return (<div className={props.jsxprefixCls} style={_style}>

            {props.columns.map(function (item,index) {

                if(item.hidden) return;

                let _style={
                    width: item.width? item.width:100
                },_v;
                if(item.type=='checkbox') {
                    _v=<CheckBox  ref="checkbox" onchange={me.handleCheckBoxChange.bind(me)}/>
                }else {
                    _v=item.title
                }
                if(index==props.columns.length-1) {
                    return (
                            <div className="kuma-grid-cell" style={_style} >
                            <span>{_v}</span>
                    </div>)
                }else {
                    return <div className="kuma-grid-cell" style={_style}><span>{_v}</span></div>
                }
            })}
            {_picker}
        </div>);
    }

};

Header.propTypes= {
};

Header.defaultProps = {
    jsxprefixCls: "kuma-grid-header"
};

export default Header;