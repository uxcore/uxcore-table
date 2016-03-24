let CellField = require('./CellField');
let classnames = require('classnames');
let assign = require('object-assign');
let Select = require('uxcore-select2');
let {Option} = Select;
let React = require('react');
let ReactDOM = require('react-dom');


class SelectField extends CellField {

    constructor(props) {
        super(props);
    }

    renderContent() {
        let me = this;
        let fieldProps = {
            onSelect: (value, Option) => {
                me.handleDataChange({
                    jsxid: me.props.rowData['jsxid'],
                    column: me.props.column,
                    text: Option.props.children,
                    value: value
                });
            },
            value: me.props.value
        };
        if (me.props.column.config) {
            let {value, onSelect, ...customProps} = me.props.column.config;
            assign(fieldProps, customProps);
        }
        return <Select {...fieldProps}>
                    {me.props.column.children}
               </Select>
    }

};

SelectField.propTypes = assign({}, CellField.propTypes);

SelectField.defaultProps = assign({}, CellField.defaultProps);

module.exports = SelectField;
