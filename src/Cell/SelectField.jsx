const CellField = require('./CellField');
const assign = require('object-assign');
const Select = require('uxcore-select2');
const React = require('react');


const getTextFromValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(item => item.label).join(', ');
  } else if (typeof value === 'object') {
    return value.label;
  }
  return '';
};

const processValue = (value) => {
  if (typeof value !== 'object') {
    if (value === undefined || value === null) {
      return value;
    }
    return {
      key: value,
    };
  }
  return value;
};


class SelectField extends CellField {

  renderContent() {
    const me = this;
    const fieldProps = {
      onChange: (value) => {
        me.handleDataChange({
          jsxid: me.props.rowData.jsxid,
          column: me.props.column,
          text: getTextFromValue(value),
          value,
        });
      },
      labelInValue: true,
      value: processValue(me.props.value),
    };
    if (me.props.column.config) {
      const customProps = { ...me.props.column.config };
      delete customProps.value;
      delete customProps.onChange;
      assign(fieldProps, customProps);
    }
    return (
      <Select {...fieldProps}>
        {me.props.column.renderChildren && me.props.column.renderChildren(me.props.rowData)}
      </Select>
    );
  }

}

SelectField.propTypes = assign({}, CellField.propTypes);

SelectField.defaultProps = assign({}, CellField.defaultProps);

module.exports = SelectField;
