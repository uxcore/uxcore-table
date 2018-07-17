/**
 * Created by xy on 15/4/13.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Const from 'uxcore-const';
import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import deepEqual from 'lodash/isEqual';
import DateField from 'uxcore-date-cell-field';
import CheckField from 'uxcore-checkbox-cell-field';
import Button from 'uxcore-button';
import ButtonGroup from 'uxcore-button-group';
import CheckBox from './CheckBox';
import Radio from './Radio';
import TextField from '../CellField/TextField';
import SelectField from '../CellField/SelectField';
import RadioField from '../CellField/RadioField';
import util from '../util';


const fieldsMap = {
  select: SelectField,
  text: TextField,
  radio: RadioField,
  date: DateField,
  check: CheckField,
};

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.showSubComp = this.showSubComp.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
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

  handleCellClick(e) {
    const me = this;
    const { column, toggleSubCompOnRowClick } = me.props;
    const { type } = column;
    if (type === 'action' && toggleSubCompOnRowClick) {
      e.stopPropagation();
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
          <Button
            buttonType={action.buttonType}
            type="outline"
            key={index}
            disabled={typeof action.isDisable === 'function' ? action.isDisable(rowData) : false}
            onClick={me.handleActionClick.bind(me,
              (action.callback || (() => {})).bind(me, rowData, me.props.root))}
          >
            {content}
          </Button>,
        );
      }
    });
    return (
      <ButtonGroup
        separated
        size="small"
        maxLength={column.collapseNum}
        actionType={column.actionType || 'link'}
        locale={me.props.locale}
      >
        {items}
      </ButtonGroup>
    );
  }

  renderTreeIcon() {
    if (this.props.cellIndex === 0 && this.props.hasSubComp) {
      const open = this.props.rowData.showSubComp;
      return (
        <span
          className="kuma-uxtable-tree-icon"
          onClick={this.showSubComp}
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
      width: width || '100px',
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
      style.cursor = 'default';
    } else if (column.type === 'checkbox' || column.type === 'checkboxSelector') {
      style.paddingRight = '4px';
      style.paddingLeft = '12px';

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
          onChange={me.handleCheckChange}
        />
      );
    } else if (column.type === 'radioSelector') {
      style.paddingRight = '4px';
      style.paddingLeft = '12px';

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
          onChange={me.handleCheckChange}
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
        getTooltipContainer: () => props.bodyNode,
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
      content = (
        <div className="default-cell" title={me.getCellData()}>
          {me.getCellData()}
        </div>
      );
    }

    const child = me.props.children;
    return (
      <div
        className={classnames({
          [props.jsxprefixCls]: true,
          last: props.last,
        })}
        style={style}
        onClick={(e) => { this.handleCellClick(e); }}
        ref={(c) => { this.root = c; }}
      >
        {child}
        {content}
      </div>
    );
  }
}

Cell.propTypes = {
  cellIndex: PropTypes.number,
  hasSubComp: PropTypes.bool,
  rowData: PropTypes.object,
  jsxprefixCls: PropTypes.string,
  showSubCompCallback: PropTypes.func,
};

Cell.defaultProps = {
  jsxprefixCls: 'kuma-uxtable-cell',
  rowSelection: {},
};

export default Cell;
