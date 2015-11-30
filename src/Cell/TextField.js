/**
 * A editable  plain text field
 */

let CellField = require('./CellField');
let classnames = require('classnames');
let assign = require('object-assign');

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
                me.handleDataChange(me.props.rowData['jsxid'], dataKey, e.target.value);
            },
            value: me.props.value
        }
        return <input {...fieldProps} />
    }

};

TextField.propTypes = assign({}, CellField.propTypes);

TextField.defaultProps = assign({}, CellField.defaultProps);

module.exports = TextField;
