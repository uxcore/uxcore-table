/**
 * @author: zhouquan.yezq
 * @time : 8/12 2015
 */
class Mask extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount () {
       
    }
    // visible/size
    render() {
        
        let props= this.props,visible=props.visible,loadTips= props.tips?props.tips:"Loading...";
        let _className=props.jsxprefixCls;
        // console.log("visible:",visible);
        if(!visible) {
            _className= _className+" kuma-mask-hide";
        }
        return (<div className={_className}>
            <div className="kuma-mask-centerblk"><span>{loadTips}</span></div>
        </div>);
    }

};

Mask.propTypes= {
};

Mask.defaultProps = {
    jsxprefixCls: "kuma-mask"
};

export default Mask;
