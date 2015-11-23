
let classnames = require('classnames');

class CellField extends React.Component {
    constructor(props) {
        super(props);
    }

    handleDataChange(jsxid, dataKey, value) {
        let me = this;
        me.props.handleDataChange(jsxid, dataKey, value);
    }   

    renderContent() {
        let me = this;
        let fieldProps = {
            className: classnames({
                "kuma-input": true
            }),
            onChange: (e) => {
                me.handleDataChange(me.props.rowData['jsxid'], me.props.dataKey, e.target.value);
            }
        }
        return <input {...fieldProps} />
    }

    addSpecificClass() {
        return this.props.prefixCls;
    }

    render() {
        let me = this;
        let specificCls = me.addSpecificClass();
        return (
            <div className={classnames({
                [specificCls]: true,
                [me.props.className]: !!me.props.className
            })}>
                {me.renderContent()}
            </div>
        )
    }
}

CellField.displayName = "CellField";
CellField.propTypes = {
    prefixCls: React.PropTypes.string
};

CellField.defaultProps = {
    prefixCls: 'kuma-uxtable-cell-field'
};

module.exports = CellField;