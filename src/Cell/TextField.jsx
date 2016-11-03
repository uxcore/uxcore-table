const CellField = require('./CellField');
const classnames = require('classnames');
const assign = require('object-assign');
const React = require('react');

class TextField extends CellField {

  renderContent() {
    const me = this;
    const fieldProps = {
      className: classnames({
        'kuma-input': true,
      }),
      onChange: (e) => {
        me.handleDataChange({
          jsxid: me.props.rowData.jsxid,
          column: me.props.column,
          value: e.target.value,
          text: e.target.value,
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
    return <input {...fieldProps} />;
  }

}

TextField.propTypes = assign({}, CellField.propTypes);

TextField.defaultProps = assign({}, CellField.defaultProps);

module.exports = TextField;
