/**
 * @author: zhouquan.yezq
 * @time : 8/12 2015
 */

let classnames = require("classnames");

let React = require('react');
let ReactDOM = require('react-dom');

class Mask extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        let props= this.props,visible=props.visible,loadTips= props.tips?props.tips:"Loading...";
        let _className = classnames({
            [props.jsxprefixCls]: true,
            [props.jsxprefixCls + "-hide"]: !visible
        })
        return (<div className={_className}>
            <div className={`${props.jsxprefixCls}-centerblk`}><span>{loadTips}</span></div>
        </div>);
    }

};

Mask.propTypes= {
};

Mask.defaultProps = {
    jsxprefixCls: "kuma-uxmask"
};

export default Mask;
