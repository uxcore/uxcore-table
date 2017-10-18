import assign from 'object-assign';
import RadioGroup from 'uxcore-radiogroup';
import React from 'react';
import Table from '../src';

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
      const customProps = { ...me.props.column.config };
      delete customProps.value;
      delete customProps.onChange;
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

export default RadioField;
