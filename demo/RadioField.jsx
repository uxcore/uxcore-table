const assign = require('object-assign');
const RadioGroup = require('uxcore-radiogroup');
const React = require('react');

const Table = require('../src');

const CellField = Table.CellField;

class RadioField extends CellField {

  processChildren() {
    const me = this;
    const obj = {};
    me.props.column.renderChildren().forEach((item) => {
      obj[item.props.value] = item.props.text;
    });
    return obj;
  }

  renderContent() {
    const me = this;
    const textMap = me.processChildren();
    const fieldProps = {
      onChange: (value) => {
        me.handleDataChange({
          jsxid: me.props.rowData.jsxid,
          column: me.props.column,
          text: textMap[value],
          value,
        });
      },
      value: me.props.value,
    };
    if (me.props.column.config) {
      const { value, onChange, ...customProps } = me.props.column.config;
      assign(fieldProps, customProps);
    }
    return (
      <RadioGroup {...fieldProps}>
        {me.props.column.renderChildren()}
      </RadioGroup>
    );
  }

}

RadioField.propTypes = assign({}, CellField.propTypes);

RadioField.defaultProps = assign({}, CellField.defaultProps);

module.exports = RadioField;
