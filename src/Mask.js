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

        let props = this.props;
        let {visible, text} = props;
        let className = classnames({
            [props.prefixCls]: true,
            [props.prefixCls + "-hide"]: !visible
        });
        return (<div className={className}>
                  <div className={`${props.prefixCls}-centerblk`}>
                    <span className="kuma-loading"></span>
                    <span className={`${props.prefixCls}-text`}>{text}</span>
                  </div>
                </div>);
    }

}

Mask.propTypes = {
    prefixCls: React.PropTypes.string
};

Mask.defaultProps = {
    prefixCls: "kuma-uxmask",
    text: '加载中'
};

export default Mask;
