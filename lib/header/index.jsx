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

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }

    prepareStyle() {

    }

    handleCheckBoxChange() {
        let v=this.refs.checkbox.getValue();
        this.props.checkAll.apply(null,[v]);
    }

    render() {

        let props= this.props, me=this;

        return (<div className={this.props.jsxprefixCls}>
            {props.columns.map(function (item) {
                let _style={
                    width: item.width? item.width:100
                },_v;
                if(item.type=='checkbox') {
                    _v=<CheckBox checked="" ref="checkbox" onchange={me.handleCheckBoxChange.bind(me)}/>
                }else {
                    _v=item.name
                }
                return <div className="kuma-grid-cell" style={_style}><span>{_v}</span></div>
            })}
        </div>);
    }

};

Header.propTypes= {
};

Header.defaultProps = {
    jsxprefixCls: "kuma-grid-header"
};

export default Header;