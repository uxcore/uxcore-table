let CellField = require('./CellField');
let classnames = require('classnames');
let assign = require('object-assign');
let Select = require('uxcore-select2');
let {Option} = Select;


class SelectField extends CellField {

    constructor(props) {
        super(props);
    }

    renderContent() {
        let me = this;
        let dataKey = me.props.column.dataKey;
        let fieldProps = {
            onChange: (value) => {
                me.handleDataChange(me.props.rowData['jsxid'], dataKey, value);
            },
            value: me.props.value
        };
        if (me.props.column.config) {
            let {value, onChange, ...customProps} = me.props.column.config;
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
