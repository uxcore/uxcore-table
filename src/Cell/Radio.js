/**
 * A radio field
 */

let Const = require('uxcore-const');
let React = require('react');
let ReactDOM = require('react-dom');

class Radio extends React.Component {

    constructor(props) {
        super(props);
    }

    handleChange(e) {
        this.props.onChange.apply(null,[e])
    }
    
    getValue () {
        return this.refs.radio.checked;
    }

    render() {

        let props = this.props;
  
        if (props.mode !== Const.MODE.VIEW) {
            let renderProps= {
                className: "kuma-checkbox",
                checked: this.props.checked,
                onChange: this.handleChange.bind(this)
            }
            if (!!props.disable) {
                renderProps.disabled = true;
            }
            return <label className="kuma-uxtable-row-selector"><input type="radio" ref="radio" {...renderProps} /><s></s></label>

        }else {

            let renderProps= {
                className: "kuma-checkbox",
                checked: this.props.checked,
                disabled:true
            }
            return <label className="kuma-uxtable-row-selector"><input type="radio" ref="radio"  {...renderProps} /><s></s></label>
        }

    }

};

Radio.propTypes= {
};

Radio.defaultProps = {

};

export default Radio;
