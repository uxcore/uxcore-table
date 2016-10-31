const CellField = require('./CellField');
const assign = require('object-assign');
const Select = require('uxcore-select2');
const React = require('react');


class SelectField extends CellField {

  renderContent() {
    const me = this;
    const fieldProps = {
      onSelect: (value, option) => {
        me.handleDataChange({
          jsxid: me.props.rowData.jsxid,
          column: me.props.column,
          text: option.props.children,
          value,
        });
      },
      value: me.props.value,
    };
    if (me.props.column.config) {
      const { value, onSelect, ...customProps } = me.props.column.config;
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
