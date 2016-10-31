const CellField = require('./CellField');
const assign = require('object-assign');
let RadioGroup = require('uxcore-radiogroup');
let React = require('react');

class RadioField extends CellField {

  processChildren() {
    const me = this;
    const obj = {};
    if (me.props.column.renderChildren) {
      me.props.column.renderChildren().forEach((item) => {
        obj[item.props.value] = item.props.text;
      });
    } else {
      console.error('RadioCellField: renderChildren must be passed');
    }
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
        {me.props.column.renderChildren && me.props.column.renderChildren(me.props.rowData)}
      </RadioGroup>
    );
  }

}

RadioField.propTypes = assign({}, CellField.propTypes);

RadioField.defaultProps = assign({}, CellField.defaultProps);

module.exports = RadioField;
