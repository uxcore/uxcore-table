/**
 * A editable plain text field
 */

let CellField = require('./CellField');
let classnames = require('classnames');
let assign = require('object-assign');
let React = require('react');
let ReactDOM = require('react-dom');

class TextField extends CellField {

    constructor(props) {
        super(props);
    }

    renderContent() {
        let me = this;
        let dataKey = me.props.column.dataKey;
        let fieldProps = {
            className: classnames({
                "kuma-input": true
            }),
            onChange: (e) => {
                me.handleDataChange({
                    jsxid: me.props.rowData['jsxid'],
                    column: me.props.column,
                    value: e.target.value,
                    text: e.target.value
                });
            },
            value: me.props.value
        };
        if (me.props.column.config) {
            let {className, onChange, ...customProps} = me.props.column.config;
            assign(fieldProps, customProps);
        }
        return <input {...fieldProps} />
    }

};

TextField.propTypes = assign({}, CellField.propTypes);

TextField.defaultProps = assign({}, CellField.defaultProps);

module.exports = TextField;
