/**
 * A checkbox field
 */

import Const from 'uxcore-const';
import React from 'react';
import classnames from 'classnames';

class CheckBox extends React.Component {

  getValue() {
    return this.checkbox.checked;
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  handleClick() {
    // simulate checkbox
    this.props.onChange({
      target: {
        checked: true,
      },
    });
  }

  renderHalfChecked() {
    return (
      <span className="kuma-uxtable-row-selector">
        <i className="half-checked" onClick={this.handleClick.bind(this)} />
      </span>
    );
  }

  renderCheckBox(renderProps) {
    return (
      <label
        className={classnames({
          'kuma-uxtable-row-selector': true,
          [this.props.className]: !!this.props.className,
        })}
      >
        <input type="checkbox" ref={(c) => { this.checkbox = c; }} {...renderProps} /><s />
      </label>
    );
  }


  render() {
    const props = this.props;
    if (props.halfChecked) {
      return this.renderHalfChecked();
    }
    const renderProps = {
      className: 'kuma-checkbox',
      checked: this.props.checked,
      onChange: this.handleChange.bind(this),
    };
    if (!!props.disable || props.mode === Const.MODE.VIEW) {
      renderProps.disabled = true;
    }
    return this.renderCheckBox(renderProps);
  }

}


CheckBox.propTypes = {
  onChange: React.PropTypes.func,
  checked: React.PropTypes.bool,
  className: React.PropTypes.string,
};

CheckBox.defaultProps = {
  onChange: () => {},
};

export default CheckBox;
