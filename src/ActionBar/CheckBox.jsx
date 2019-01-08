import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class CheckBox extends Component {

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
      <span
        className={classnames({
          [this.props.className]: !!this.props.className,
        })} onClick={this.handleClick.bind(this)}
      >
        <i
          className={classnames({
            'half-checked': true,
          })}
        />
        {this.props.children}
      </span>
    );
  }

  renderCheckBox(renderProps) {
    return (
      <label
        className={classnames({
          [this.props.className]: !!this.props.className,
        })}
      >
        <input type="checkbox" ref={(c) => { this.checkbox = c; }} {...renderProps} /><s />
        {this.props.children}
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
      disabled: this.props.disabled
    };
    return this.renderCheckBox(renderProps);
  }

}


CheckBox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
};

CheckBox.defaultProps = {
  onChange: () => {},
  disabled: false
};

export default CheckBox;