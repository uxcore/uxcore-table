/**
 * A radio field
 */

let Const = require('uxcore-const');
let React = require('react');
let ReactDOM = require('react-dom');

class Radio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: !!this.props.checked
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.checked = !!nextProps.jsxchecked
    }

    handleChange(e) {
        if (e.target.checked != this.state.checked) {
            this.state.checked = !this.state.checked;
            this.props.onchange.apply(null,[e])
        }
    }
    
    getValue () {
        return this.refs.radio.checked;
    }

    render() {

        let props = this.props;
  
        if (props.mode !== Const.MODE.VIEW) {
            let renderProps= {
                className: "kuma-checkbox",
                checked: this.props.jsxchecked,
                onChange: this.handleChange.bind(this)
            }
            if (!!props.disable) {
                renderProps.disabled = true;
            }
            return <label className="kuma-uxtable-row-selector"><input type="radio" ref="radio" {...renderProps}/><s></s></label>

        }else {

            let renderProps= {
                className: "kuma-checkbox",
                checked: this.props.jsxchecked,
                disabled:true
            }
            return <label className="kuma-uxtable-row-selector"><input type="radio" ref="radio"  {...renderProps}/><s></s></label>
        }

    }

};

Radio.propTypes= {
};

Radio.defaultProps = {

};

export default Radio;
