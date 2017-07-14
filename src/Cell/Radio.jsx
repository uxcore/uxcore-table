/**
 * A radio field
 */

import Const from 'uxcore-const';
import React from 'react';

class Radio extends React.Component {

  getValue() {
    return this.radio.checked;
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    const props = this.props;
    const renderProps = {
      className: 'kuma-checkbox',
      checked: this.props.checked,
    };

    if (props.mode !== Const.MODE.VIEW) {
      renderProps.onChange = this.handleChange.bind(this);
      if (props.disable) {
        renderProps.disabled = true;
      }
    } else {
      renderProps.disabled = true;
    }

    return (
      <label className="kuma-uxtable-row-selector">
        <input type="radio" ref={(c) => { this.radio = c; }} {...renderProps} />
        <s />
      </label>
    );
  }

}

Radio.propTypes = {
  onChange: React.PropTypes.func,
  checked: React.PropTypes.bool,
};

Radio.defaultProps = {

};

export default Radio;
