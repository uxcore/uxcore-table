import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tree from 'uxcore-tree';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon';
import i18n from '../i18n';
import util from '../util';
import CellCheckbox from '../Cell/CheckBox';
import CheckBox from './CheckBox'

const { getSelectedKeys, getConsts } = util;

const { TreeNode } = Tree;

class ColumnPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkAbleColumns: this.getCheckAbleColumns(props.columns).columnsKey,
      selectedKeys: getSelectedKeys(props.columns).selectedKeys
    };
  }

  getDropDownDOMNOde() {
    return this.dropDownDOMNode;
  }

  handleChexkAll = (e) => {
    this.props.handleColumnPickerCheckAll(e.target.checked);
  }

  renderCheckAll() {
    const {
      locale, prefixCls, columns, showColumnPickerCheckAll,
    } = this.props;
    if (!showColumnPickerCheckAll) {
      return false;
    }
    const { selectedKeys, isHalfChecked } = getSelectedKeys(columns);
    return (
      <div className={`${prefixCls}-check-all`}>
        <span style={{ width: 22, display: 'inline-block' }} />
        <CellCheckbox
          onChange={this.handleChexkAll}
          checked={selectedKeys.length !== 0}
          halfChecked={selectedKeys.length !== 0 ? isHalfChecked : false}
        />
        {i18n[locale].check_all}
        <div className={`${prefixCls}-check-all-split-line`} />
      </div>
    );
  }

  isChecked(key) {
    return this.state.selectedKeys.indexOf(key) !== -1
  }

  handleCheck = (e, key) => {
    const checked = e.target.checked;
    let selectKeys = [...this.state.selectedKeys];
    const hasChecked = this.isChecked(key);
    if (checked) {
      !hasChecked && selectKeys.push(key)
    } else {
      hasChecked && (selectKeys = selectKeys.filter(item => {return item !== key}))
    }
    this.setState({
      selectedKeys: selectKeys
    })
  }

  handleCheckAll = e => {
    const checked = e.target.checked;
    this.setState({
      selectedKeys: !checked ? [] : this.state.checkAbleColumns
    })
  };


  renderPickerGroup(group) {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-group`}>
        {/*{*/}
          {/*group.title ? <p style={{ width: '100%'}}> {group.title}</p> : null*/}
        {/*}*/}
        { group.columns.map(column => {
          return (
            column.dataKey ?
            <CheckBox
              checked={this.isChecked(column.dataKey)}
              onChange={(e) => {this.handleCheck(e, column.dataKey)}}
            >
              <span>{column.dataKey}</span>
            </CheckBox> : null
          )
        })}
      </div>
    )
  }

  renderPickerGroups() {
    const { prefixCls, locale, showColumnPickerCheckAll } = this.props;
    const { selectedKeys } = this.state;
    const { columns }  = this.getCheckAbleColumns();
    const isChecked = selectedKeys.length === columns.length
    const isHalfChecked = selectedKeys.length && !isChecked;
    const groups = this.getPickerGroups();
    return (
      <div style={{ position: 'relative'}}>
        <div className={`${prefixCls}-groups`}>
          <div className={`${prefixCls}-header`}>以下内容为可选字段</div>
          <div className={`${prefixCls}-content`}>
            {groups.map(group => {
              return this.renderPickerGroup(group)
            })}
          </div>
        </div>
        {
          showColumnPickerCheckAll ? <CheckBox
            className={`${prefixCls}-check-all`}
            checked={isChecked}
            halfChecked={isHalfChecked}
            onChange={this.handleCheckAll}
          > {i18n[locale].check_all}</CheckBox> : null
        }
      </div>
    )
  }

  getCheckAbleColumns() {
    const { columns } = this.props;
    const blackList = {'jsxchecked': 1, 'jsxtreeIcon': 1, 'jsxwhite': 1};
    let columnsKey = [];
    return {
      columns: columns.filter(column => {
        if (column.dataKey in blackList) {
          return false
        }
        if (column.type === 'action') {
          return false
        }
        columnsKey.push(column.dataKey);
        return true
      }),
      columnsKey: columnsKey
    }
  }

  getPickerGroups() {
    const { columns } = this.getCheckAbleColumns();
    return [
      {
        title: '分组2',
        columns
      }
    ]
  }

  handleClick = (e) => {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleOk = (hideCallback) => {
    const { selectedKeys, checkAbleColumns } = this.state
    const { handleColumnPickerChange, handleColumnPickerCheckAll} = this.props
    const checkAll = selectedKeys.length === checkAbleColumns.length
    const checkNone = !selectedKeys.length
    if (checkAll || checkNone ) {
      if (checkAll) {
        handleColumnPickerCheckAll(true)
      } else if(checkNone) {
        handleColumnPickerCheckAll(false)
      }
    } else {
      handleColumnPickerChange(selectedKeys, getConsts().commonGroup)
    }
    hideCallback()
  }

  handleCancel = () => {

  }

  render() {
    const me = this;
    const p = me.props;
    const disabled = !p.keepActiveInCustomView && !p.isTableView;
    return (
      <Popover
        overlay={!disabled ? me.renderPickerGroups() : <div/>}
        // onClick={me.handleClick}
        // visible={me.state.visible}
        overlayClassName={classnames({
          'list-action-bar-picker-overlay': true,
          'kuma-popover-hidden': disabled
        })}
        trigger={['click']}
        placement={'bottomRight'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        showButton
      >
        <div className={classnames('picker-title', {
          'disabled': disabled
        })}>
          <Icon usei name={p.iconName} />
          <span>{p.title}</span>
        </div>
      </Popover>
    );
  }
}

ColumnPicker.defaultProps = {
  prefixCls: 'kuma-uxtable-column-picker',
  showColumnPickerCheckAll: false,
  locale: 'zh-cn',
  columns: [],
  handleColumnPickerChange: () => {},
  handleColumnPickerCheckAll: () => {},
};
ColumnPicker.propTypes = {
  prefixCls: PropTypes.string,
  showColumnPickerCheckAll: PropTypes.bool,
  locale: PropTypes.string,
  columns: PropTypes.array,
  handleColumnPickerChange: PropTypes.func,
  handleColumnPickerCheckAll: PropTypes.func,
};

ColumnPicker.displayName = 'ColumnPicker';

export default ColumnPicker;
