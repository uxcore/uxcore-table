/**
 * A checkbox field
 */

import Const from 'uxcore-const';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TableContext from '../context';

class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

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
      <TableContext.Consumer>
        {context => (
          <span
            className={classnames({
              [`${context.prefixCls}-row-selector`]: true,
              [this.props.className]: !!this.props.className,
            })}
          >
            <i className="half-checked" onClick={this.handleClick} />
          </span>
        )}
      </TableContext.Consumer>

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
        <input type="checkbox" ref={(c) => { this.checkbox = c; }} {...renderProps} />
        <s />
      </label>
    );
  }


  render() {
    const { props } = this;
    if (props.halfChecked) {
      return this.renderHalfChecked();
    }
    const renderProps = {
      className: 'kuma-checkbox',
      checked: this.props.checked || false,
      onChange: this.handleChange.bind(this),
    };
    if (!!props.disable || props.mode === Const.MODE.VIEW) {
      renderProps.disabled = true;
    }
    return this.renderCheckBox(renderProps);
  }
}


CheckBox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
};

CheckBox.defaultProps = {
  onChange: () => {},
  checked: undefined,
  className: '',
};

export default CheckBox;
