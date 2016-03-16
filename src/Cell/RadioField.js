let CellField = require('./CellField');
let classnames = require('classnames');
let assign = require('object-assign');
let RadioGroup = require('uxcore-radiogroup');
let React = require('react');
let ReactDOM = require('react-dom');

class RadioField extends CellField {

    constructor(props) {
        super(props);
    }

    processChildren() {
        let me = this;
        let obj = {};
        me.props.column.children.forEach((item) => {
            obj[item.props.value] = item.props.text;
        });
        return obj;
    }

    renderContent() {
        let me = this;
        let dataKey = me.props.column.dataKey;
        let textMap = me.processChildren();
        let fieldProps = {
            onChange: (value) => {
                me.handleDataChange({
                    jsxid: me.props.rowData['jsxid'],
                    column: me.props.column,
                    text: textMap[value],
                    value: value
                });
            },
            value: me.props.value
        };
        if (me.props.column.config) {
            let {value, onChange, ...customProps} = me.props.column.config;
            assign(fieldProps, customProps);
        }
        return <RadioGroup {...fieldProps}>
                    {me.props.column.children}
               </RadioGroup>
    }

};

RadioField.propTypes = assign({}, CellField.propTypes);

RadioField.defaultProps = assign({}, CellField.defaultProps);

module.exports = RadioField;
