const CellField = require('uxcore-cell-field');
const assign = require('object-assign');
const RadioGroup = require('uxcore-radiogroup');
const React = require('react');

const { Item } = RadioGroup;

class RadioField extends CellField {

  getTextMap() {
    const me = this;
    const obj = {};
    const { column } = me.props;
    if (column.renderChildren) {
      column.renderChildren().forEach((item) => {
        obj[item.props.value] = item.props.text;
      });
    } else if (column.config && column.config.data) {
      (column.config.data || []).forEach((item) => {
        obj[item.value] = item.text;
      });
    }
    return obj;
  }

  renderChildren() {
    const me = this;
    const { column, rowData } = me.props;
    const { renderChildren, config } = column;
    if (renderChildren) {
      return renderChildren(rowData);
    }
    if (config) {
      return (config.data || []).map((item, index) =>
        <Item key={index} value={item.value} text={item.text} />);
    }
    return [];
  }

  renderContent() {
    const me = this;
    const textMap = me.getTextMap();
    const fieldProps = {
      onChange: (value) => {
        me.handleDataChange({
          text: textMap[value],
          value,
        });
      },
      value: me.props.value,
    };
    if (me.props.column.config) {
      const customProps = { ...me.props.column.config };
      Object.keys(fieldProps).forEach((item) => {
        delete customProps[item];
      });
      assign(fieldProps, customProps);
    }
    return (
      <RadioGroup {...fieldProps}>
        {me.renderChildren()}
      </RadioGroup>
    );
  }

}

RadioField.propTypes = assign({}, CellField.propTypes);

RadioField.defaultProps = assign({}, CellField.defaultProps);

module.exports = RadioField;
