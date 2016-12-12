const CellField = require('uxcore-cell-field');
const assign = require('object-assign');
const React = require('react');

const Input = props =>
  <input className="kuma-input" {...props} value={props.value} onChange={(e) => { props.onChange(e.target.value); }} />;

Input.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

const createCellField = (options) => {
  class CustomField extends CellField {
    render() {
      const me = this;
      const defaultOptions = {
        valuePropName: 'value',
        changePropName: 'onChange',
        component: <Input />,
        processValue: value => value,
        processText: value => JSON.stringify(value),
      };
      const newOptions = assign({}, defaultOptions, options);
      return React.cloneElement(newOptions.component, {
        [newOptions.valuePropName]: me.props.value,
        [newOptions.changePropName]: (...args) => {
          me.handleDataChange({
            value: newOptions.processValue.apply(me, args),
            texx: newOptions.processText.apply(me, args),
          });
        },
        ...(me.props.column.config || {}),
      });
    }
  }
  return CustomField;
};

module.exports = createCellField;
