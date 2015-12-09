
let classnames = require('classnames');
let assgin = require('object-assign');

class CellField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: true
        }

    }

    componentDidMount() {
        let me = this;
        me.props.attachCellField(me.validate.bind(this), me.getName());
    }

    componentWillUnmount() {
        let me = this;
        me.props.detachCellField(me.getName());
    }

    handleDataChange(obj) {
        let me = this;
        let {jsxid, column, value, text} = obj;
        me.validate(value, () => {
            me.props.handleDataChange(assgin({}, obj, {
                pass: me.state.pass
            }));
        });
        
    }

    getName() {
        let me = this;
        return me.props.column.dataKey + "." + me.props.index;
    }   

    validate(value, cb) {
        let me = this;
        value = value || me.props.value;
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
            !!cb && cb();
        });
        return pass;
    }

    renderContent() {
        
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