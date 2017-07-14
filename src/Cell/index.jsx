/**
 * Created by xy on 15/4/13.
 */

const React = require('react');
const Const = require('uxcore-const');
const classnames = require('classnames');
const deepcopy = require('lodash/cloneDeep');
const deepEqual = require('deep-equal');
const DateField = require('uxcore-date-cell-field');
const CheckField = require('uxcore-checkbox-cell-field');

const CollapsedButton = require('../CollapsedButton');
const CheckBox = require('./CheckBox');
const Radio = require('./Radio');
const TextField = require('../CellField/TextField');
const SelectField = require('../CellField/SelectField');
const RadioField = require('../CellField/RadioField');
const util = require('../util');


const fieldsMap = {
  select: SelectField,
  text: TextField,
  radio: RadioField,
  date: DateField,
  check: CheckField,
};

class Cell extends React.Component {

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
   * @param actions {Array|Object|Function}
   */
  getActionItems(actions) {
    if (typeof actions !== 'object' && typeof actions !== 'function') {
      console.error('Table: Actions should be an object/array/function');
      return [];
    }
    const me = this;
    me.items = [];
    if (typeof actions === 'function') {
      me.items = actions(me.props.rowData);
    } else if (actions instanceof Array) {
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
      .filter(item => (!('mode' in item) || item.mode === mode));
    const items = [];
    actions.forEach((action, index) => {
      const content = action.render
        ? action.render(action.title, deepcopy(me.props.rowData))
        : action.title;
      if (content) {
        items.push(
          <CollapsedButton.Item
            key={index}
            disabled={typeof action.isDisable === 'function' ? action.isDisable(rowData) : false}
            onClick={me.handleActionClick.bind(me,
              (action.callback || (() => {})).bind(me, rowData, me.props.root))}
          >
            {content}
          </CollapsedButton.Item>
        );
      }
    });
    return (
      <CollapsedButton
        prefixCls={me.props.jsxprefixCls}
        maxLength={column.collapseNum}
        type={column.actionType}
        locale={me.props.locale}
      >
        {items}
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
              'kuma-icon-triangle-right': true,
              'kuma-icon-triangle-right__open': open,
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

      const checked = me.getCellData();
      let disable = props.rowSelection.isDisabled
        ? props.rowSelection.isDisabled(props.rowData) : false;
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

      const checked = me.getCellData();
      let disable = props.rowSelection.isDisabled
        ? props.rowSelection.isDisabled(props.rowData) : false;
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
      style.borderRight = 'none';
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

    const child = me.props.children;
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
  rowSelection: {},
};

export default Cell;
