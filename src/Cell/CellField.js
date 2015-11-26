
let classnames = require('classnames');

class CellField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: true
        }
    }

    handleDataChange(jsxid, dataKey, value) {
        let me = this;
        me.validate(value, () => {
            me.props.handleDataChange(jsxid, dataKey, value, me.state.pass);
        });
        
    }   

    validate(value, cb) {
        let me = this;
        let {rules} = me.props.column;
        let pass = true;
        let errMsg = "";
        if (typeof rules == "object" && !Array.isArray(rules)) {
            pass = !!rules.validator(value);
            errMsg = rules.errMsg;
        }
        else if (Array.isArray(rules)) {
            for (let i = 0; i < rules.length; i++) {
                pass = rules[i].validator(value);
                if (!pass) {
                    errMsg = rules[i].errMsg;
                    break;
                }
            }
        }
        me.setState({
            pass: pass,
            errMsg: errMsg
        }, () => {
            cb();
        });
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

    addSpecificClass() {
        return this.props.prefixCls;
    }

    render() {
        let me = this;
        let specificCls = me.addSpecificClass();
        return (
            <div className={classnames({
                "hasError": !me.state.pass,
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