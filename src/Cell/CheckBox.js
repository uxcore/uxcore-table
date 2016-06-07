/**
 * A checkbox field
 */

const Const = require('uxcore-const');
const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');

class CheckBox extends React.Component {

    constructor(props) {
        super(props);
    }

    handleChange(e) {
        this.props.onChange(e)
    }

    getValue() {
        return this.refs.checkbox.checked;
    }

    handleClick() {
        // simulate checkbox
        this.props.onChange({
            target: {
                checked: true
            }
        });
    }

    renderHalfChecked() {
        return (
            <label className="kuma-uxtable-row-selector">
                <i className="half-checked" onClick={this.handleClick.bind(this)}></i>
            </label>
        )
    }

    renderCheckBox(renderProps) {
        return (
            <label className={classnames({
                "kuma-uxtable-row-selector": true,
                [this.props.className]: !!this.props.className,
            })}>
                <input type="checkbox" ref="checkbox" {...renderProps}/><s></s>
            </label>
        )
    }


    render() {

        let props = this.props;
        if (props.halfChecked) {
            return this.renderHalfChecked();
        }
        const renderProps = {
            className: "kuma-checkbox",
            checked: this.props.checked,
            onChange: this.handleChange.bind(this)
        }
        if (!!props.disable || props.mode == Const.MODE.VIEW) {
            renderProps.disabled = true;
        }
        return this.renderCheckBox(renderProps);
    }

}
;

CheckBox.propTypes = {
};

CheckBox.defaultProps = {

};

module.exports = CheckBox;
