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
            className: classnames({
                "kuma-input": true
            }),
            onChange: (e) => {
                me.handleDataChange(me.props.rowData['jsxid'], dataKey, e.target.value);
            },
            value: me.props.value
        }
        return <input {...fieldProps} />
    }

};

SelectField.propTypes = assign({}, CellField.propTypes);

SelectField.defaultProps = assign({}, CellField.defaultProps);

module.exports = SelectField;
