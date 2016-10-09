/**
 * Created by xy on 15/4/13.
 */

const React = require('react');
const Const = require('uxcore-const');
const CollapsedButton = require('../CollapsedButton');
const CheckBox = require('./CheckBox');
const Radio = require('./Radio');
const TextField = require('./TextField');
const SelectField = require('./SelectField');
const RadioField = require('./RadioField');
const util = require('../util');
const classnames = require('classnames');
const deepcopy = require('lodash/cloneDeep');
const deepEqual = require('deep-equal');

const fieldsMap = {
  select: SelectField,
  text: TextField,
  radio: RadioField,
};

class Cell extends React.Component {

  componentDidMount() {
    const me = this;
    if (me.props.column.type === 'checkbox'
      || me.props.column.type === 'checkboxSelector'
      || me.props.column.type === 'radioSelector') {
      me.props.changeSelected(me.getCellData(), me.props.rowIndex, true);
    }
  }

  shouldComponentUpdate(nextProps) {
    // 需要考虑的 prop 包括
    // column, rowData, rowIndex(s), index(s), cellIndex(s), hasSubComp(s)
    // rowSelection, actions, mode(s)
    const me = this;
    let shouldUpdate = false;

    // only tree mode has children
    if ('children' in nextProps) {
      return true;
    }

    ['rowIndex', 'index', 'cellIndex', 'hasSubComp', 'mode'].forEach((item) => {
      if (me.props[item] !== nextProps[item]) {
        shouldUpdate = true;
      }
    });

    if (!shouldUpdate) {
      ['column', 'rowSelection', 'rowData', 'actions'].forEach((item) => {
        if (!deepEqual(me.props[item], nextProps[item])) {
          shouldUpdate = true;
        }
      });
    }

    return shouldUpdate;
  }

  /**
   * @param actions {Array or Object}
   */
  getActionItems(actions) {
    if (typeof actions !== 'object') {
      console.error('Table: Actions should be an object or array');
      return [];
    }
    const me = this;
    me.items = [];
    if (actions instanceof Array) {
      me.items = actions;
    } else {
      Object.keys(actions).forEach((item) => {
        me.items.push({
          title: item,
          callback: actions[item],
        });
      });
    }
    return me.items;
  }

  getEditData() {
    const me = this;
    const column = me.props.column;
    const editKey = column.editKey || column.dataKey;
    return me.props.rowData[editKey];
  }

  getCellData(nextProps) {
    const props = nextProps || this.props;
    const column = props.column;
    const cellData = props.rowData[column.dataKey];
    return cellData;
  }

  handleCheckChange(e) {
    const me = this;
    me.props.changeSelected(e.target.checked, me.props.rowIndex, false);
  }

  handleActionClick(cb, e) {
    e.stopPropagation();
    e.preventDefault();
    if (cb) {
      cb();
    }
  }

  showSubComp() {
    this.props.showSubCompCallback.apply();
  }

  /**
   * @param {Object} column current column config
   * @param {Object} rowData current row data
   * @param {String} mode current row mode: edit or view, same as rowData['__mode__']
   */

  renderActionItems(column, rowData, mode) {
    const me = this;
    const actions = me.getActionItems(column.actions)
      .filter((item) => (!('mode' in item) || item.mode === mode));
    return (
      <CollapsedButton
        prefixCls={me.props.jsxprefixCls}
        maxLength={column.collapseNum}
        type={column.actionType}
        locale={me.props.locale}
      >
        {actions.map((action, index) => (
          <CollapsedButton.Item
            key={index}
            disabled={typeof action.isDisable === 'function' ? action.isDisable() : false}
            onClick={me.handleActionClick.bind(me,
              action.callback.bind(me, rowData, me.props.root))}
          >
            {action.render ? action.render(action.title, deepcopy(me.props.rowData)) : action.title}
          </CollapsedButton.Item>
        ))}
      </CollapsedButton>
    );
  }

  renderTreeIcon() {
    if (this.props.cellIndex === 0 && this.props.hasSubComp) {
      const open = this.props.rowData.showSubComp;
      return (
        <span
          className="kuma-uxtable-tree-icon"
          onClick={this.showSubComp.bind(this)}
        >
          <i
            className={classnames({
              'kuma-icon': true,
              'kuma-icon-tree-open': open,
              'kuma-icon-tree-close': !open,
            })}
          />
        </span>
      );
    }
    return null;
  }

  render() {
    const me = this;
    const props = me.props;
    const column = props.column;
    const width = column.width;
    const mode = props.rowData.__mode__;
    const style = {
      width: width || 100,
      textAlign: props.column.align ? props.column.align : 'left',
    };
    let content = deepcopy(props.rowData);
    let renderProps;

    if (column.type === 'action') {
      content = (
        <div className="action-container">
          {me.renderActionItems(column, content, mode)}
        </div>
      );
    } else if (column.type === 'checkbox' || column.type === 'checkboxSelector') {
      style.paddingRight = 4;
      style.paddingLeft = 12;

      let checked = me.getCellData();
      let disable = false;
      if ('disable' in column) {
        disable = column.disable;
      } else if ('isDisable' in column) {
        disable = !!column.isDisable(props.rowData);
      }
      content = (
        <CheckBox
          disable={disable}
          mode={props.mode}
          align={props.column.align}
          checked={checked}
          onChange={me.handleCheckChange.bind(me)}
        />
      );
    } else if (column.type === 'radioSelector') {
      style.paddingRight = 4;
      style.paddingLeft = 12;

      let checked = me.getCellData();
      let disable = false;
      if ('disable' in column) {
        disable = column.disable;
      } else if ('isDisable' in column) {
        disable = !!column.isDisable(props.rowData);
      }
      content = (
        <Radio
          disable={disable}
          mode={props.mode}
          align={props.column.align}
          checked={checked}
          onChange={me.handleCheckChange.bind(me)}
        />
      );
    } else if (column.type === 'treeIcon') {
      content = me.renderTreeIcon();
    } else if (
      (column.type === 'custom' || column.type in fieldsMap)
      && mode === Const.MODE.EDIT
      && (!('canEdit' in column) || column.canEdit(props.rowData))
    ) {
      // inline edit mode
      renderProps = {
        value: me.getEditData(),
        rowData: props.rowData,
        index: props.index,
        column,
        handleDataChange: props.handleDataChange,
        attachCellField: props.attachCellField,
        detachCellField: props.detachCellField,
      };
      let Field;

      if (column.type === 'custom') {
        Field = props.column.customField;
      } else {
        Field = fieldsMap[column.type];
      }
      content = <Field {...renderProps} />;
    } else if (column.type === 'money' || column.type === 'card' || column.type === 'cnmobile') {
      content = (
        <div
          className="default-cell"
          title={me.getCellData()}
        >
            {util.formatValue(me.getCellData(), column.type, column.delimiter)}
        </div>
      );
    } else if (column.render) {
      content = column.render.apply(null, [me.getCellData(), content]);
    } else {
      content = <div className="default-cell" title={me.getCellData()}>{me.getCellData()}</div>;
    }

    let child = me.props.children;
    return (
      <div
        className={classnames({
          [props.jsxprefixCls]: true,
          last: props.last,
        })}
        style={style}
      >
        {child}
        {content}
      </div>
    );
  }
}

Cell.propTypes = {
  cellIndex: React.PropTypes.number,
  hasSubComp: React.PropTypes.bool,
  rowData: React.PropTypes.object,
  jsxprefixCls: React.PropTypes.string,
  showSubCompCallback: React.PropTypes.func,
};

Cell.defaultProps = {
  jsxprefixCls: 'kuma-uxtable-cell',
};

export default Cell;
