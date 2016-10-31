
const classnames = require('classnames');
const assgin = require('object-assign');

let React = require('react');

class CellField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: true,
    };
  }

  componentDidMount() {
    const me = this;
    me.props.attachCellField(me.validate.bind(this), me.getName());
  }

  componentWillUnmount() {
    const me = this;
    me.props.detachCellField(me.getName());
  }

  getName() {
    const me = this;
    return `${me.props.column.dataKey}.${me.props.index}`;
  }

  validate(value, cb) {
    const me = this;
    value = value || me.props.value;
    const rowData = me.props.rowData;
    const { rules } = me.props.column;
    let pass = true;
    let errMsg = '';
    if (typeof rules === 'object' && !Array.isArray(rules)) {
      pass = !!rules.validator(value, rowData);
      errMsg = rules.errMsg;
    } else if (Array.isArray(rules)) {
      for (let i = 0; i < rules.length; i++) {
        pass = rules[i].validator(value, rowData);
        if (!pass) {
          errMsg = rules[i].errMsg;
          break;
        }
      }
    }
    if (cb) {
      cb(pass);
    }
    me.setState({
      pass,
      errMsg,
    });
    return pass;
  }


  addSpecificClass() {
    return this.props.prefixCls;
  }


  handleDataChange(obj) {
    const me = this;
    const { value } = obj;
    me.validate(value, (pass) => {
      me.props.handleDataChange(assgin({}, obj, {
        pass,
      }));
    });
  }

  renderContent() {

  }

  render() {
    const me = this;
    const specificCls = me.addSpecificClass();
    return (
      <div
        className={classnames({
          hasError: !me.state.pass,
          [specificCls]: true,
          [me.props.className]: !!me.props.className,
        })}
      >
        {me.renderContent()}
      </div>
    );
  }
}

CellField.displayName = 'CellField';
CellField.propTypes = {
  prefixCls: React.PropTypes.string,
};

CellField.defaultProps = {
  prefixCls: 'kuma-uxtable-cell-field',
};

module.exports = CellField;
