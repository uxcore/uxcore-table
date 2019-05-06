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
    const columnsInfo = util.getColumnsInfo(props.columns);
    this.state = {
      visible: false,
      columnsInfo,
      preColumns: props.columns,
      selectedKeys: getSelectedKeys(props.columns).selectedKeys
    };
  }

  componentDidUpdate() {
    const me = this;
    if (this.state.visible) {
      const dropDownDOMNode = me.getDropDownDOMNOde();
      const commonTreeDOMNode = me.commonTree.refs.tree;
      let width = commonTreeDOMNode.offsetWidth + 41;
      for (let i = 0; i < me.groupNum; i++) {
        width += me[`groupTree-${i}`].refs.tree.offsetWidth;
      }
      const maxWidth = typeof me.props.dropdownMaxWidth === 'number'
        ? me.props.dropdownMaxWidth
        : 1000;
      dropDownDOMNode.style.width = `${width <= maxWidth ? width : maxWidth}px`;
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.columns !== state.preColumns) {
      return {
        selectedKeys: getSelectedKeys(props.columns).selectedKeys,
        columnsInfo: util.getColumnsInfo(props.columns),
        preColumns: props.columns
      };
    }
    return null;
  }

  getDropDownDOMNOde() {
    return this.dropDownDOMNode;
  }

  handleChexkAll = (e) => {
    this.props.handleColumnPickerCheckAll(e.target.checked);
  }

  handlePickerSelect(groupName, selectedKeys) {
    this.props.handleColumnPickerChange(selectedKeys, groupName);
  }


  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
      return false;
    };
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
    const { readOnlyColumnKeys, columnsKey } = this.state.columnsInfo
    this.setState({
      selectedKeys: !checked ? [].concat(readOnlyColumnKeys) : columnsKey
    })
  };

  renderTree() {
    const me = this;
    const { columns } = me.props;
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    notRenderColumns.push(me.props.checkboxColumnKey);
    const options = [];
    const groupTree = [];
    me.groupNum = 0;
    columns.forEach((item) => {
      // the column is not the notRender one and is not the group.
      const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
      if (isGroup) {
        me.hasGroup = true;
      }
      if (notRenderColumns.indexOf(item.dataKey) === -1 && !isGroup) {
        if (item.dataKey && item.type !== 'action') {
          options.push(
            <TreeNode
              key={item.dataKey}
              title={typeof item.title === 'function' ? item.title() : item.title}
            />,
          );
        }
      } else if (isGroup) {
        groupTree.push(me.renderGroupTree(item, me.groupNum));
        me.groupNum += 1;
      }
    });

    const commonGroupName = getConsts().commonGroup;
    const { selectedKeys: commonSelectedKeys } = getSelectedKeys(columns.filter((item) => {
      const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
      return !isGroup;
    }));
    const commonTree = (
      <Tree
        checkable
        multiple
        selectable={false}
        className={!me.hasGroup ? 'no-group' : ''}
        ref={me.saveRef('commonTree')}
        checkedKeys={commonSelectedKeys}
        onCheck={me.handlePickerSelect.bind(me, commonGroupName)}
      >
        {options}
      </Tree>
    );

    // if (!me.hasGroup) {
    //   return commonTree;
    // }

    return (
      <div>
        {this.renderCheckAll()}
        {groupTree}
        {commonTree}
      </div>
    );
  }

  renderGroupTree(group, index) {
    const me = this;
    const options = (group.columns || []).map(item => (
      <TreeNode
        key={item.dataKey}
        title={typeof item.title === 'function' ? item.title() : item.title}
      />
    ));

    const { selectedKeys } = getSelectedKeys(group.columns);

    return (
      <Tree
        key={group.group}
        ref={this.saveRef(`groupTree-${index}`)}
        checkable
        multiple
        selectable={false}
        defaultExpandAll
        checkedKeys={selectedKeys}
        onCheck={me.handlePickerSelect.bind(me, group.group)}
      >
        <TreeNode title={group.group} key={group.group}>
          {options}
        </TreeNode>
      </Tree>
    );
  }

  renderPickerGroup(group) {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-group`} key={group.title}>
        {
          group.title ? <p style={{ width: '100%', lineHeight: 2 }}> {group.title}</p> : null
        }
        { group.columns.map(column => {
          const title = typeof column.title === 'function' ? column.title() : column.title
          return (
            column.dataKey ?
            <CheckBox
              key={column.dataKey}
              checked={this.isChecked(column.dataKey)}
              disable={column.disable || column.isDisable && column.isDisable()}
              onChange={(e) => {this.handleCheck(e, column.dataKey)}}
            >
              <span>{title || column.dataKey}</span>
            </CheckBox> : null
          )
        })}
      </div>
    )
  }

  renderPickerGroups() {
    const { prefixCls, locale, showColumnPickerCheckAll } = this.props;
    const { selectedKeys, columnsInfo } = this.state;
    const { columns }  = columnsInfo;
    const isChecked = selectedKeys.length === columns.length
    const isHalfChecked = selectedKeys.length && !isChecked;
    const groups = this.getPickerGroups();
    return (
      <div style={{ position: 'relative'}}>
        <div className={`${prefixCls}-groups`}>
          <div className={`${prefixCls}-header`}>{i18n[locale].columnPickerTip}</div>
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

  getPickerGroups() {
    const { setPickerGroups } = this.props;
    const { columns } = this.state.columnsInfo;
    const groups = setPickerGroups(columns);
    if (groups && groups.length) {
      return groups
    }
    return [
      {
        title: '',
        columns
      }
    ]
  }

  handleOk = (hideCallback) => {
    const { selectedKeys, columnsInfo } = this.state
    const { handleColumnPickerChange, handleColumnPickerCheckAll, onChange} = this.props
    const checkAll = selectedKeys.length === columnsInfo.columnsKey.length
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
    onChange(selectedKeys)
    hideCallback()
  }

  renderListActionBar() {
    const me = this;
    const p = me.props;
    const { columnsInfo } = this.state
    const disabled = !p.keepActiveInCustomView && !p.isTableView || !columnsInfo.columns.length
    return (
      <Popover
        placement={'bottomRight'}
        trigger={'click'}
        overlay={!disabled ? me.renderPickerGroups() : <div/>}
        overlayClassName={classnames({
          'list-action-bar-picker-overlay': true,
          'kuma-popover-hidden': disabled
        })}
        onOk={this.handleOk}
        okText={i18n[p.locale].okText}
        cancelText={i18n[p.locale].cancelText}
        locale={p.locale}
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

  render() {
    const me = this;
    const p = me.props;
    if (p.useListActionBar) {
      return this.renderListActionBar()
    }
    const { prefixCls, locale } = p;
    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        overlay={me.renderTree()}
        overlayClassName={`${prefixCls}-popover`}
        align={{
          offset: [0, -10],
        }}
      >
        <div className={prefixCls}>
          <div
            className={classnames({
              [`${prefixCls}-trigger`]: true,
              [`${prefixCls}-trigger__dropdown-visible`]: !!me.state.visible,
            })}
          >
            <Icon usei name="zidingyilie" className={`${prefixCls}-icon`} />
            <span className={`${prefixCls}-title`}>
              {i18n[locale].templated_column}
            </span>
          </div>
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
  onChange: () => {},
  setPickerGroups: () => { return null }
};
ColumnPicker.propTypes = {
  prefixCls: PropTypes.string,
  showColumnPickerCheckAll: PropTypes.bool,
  locale: PropTypes.string,
  columns: PropTypes.array,
  handleColumnPickerChange: PropTypes.func,
  handleColumnPickerCheckAll: PropTypes.func,
  onChange: PropTypes.func,
  setPickerGroups: PropTypes.func
};

ColumnPicker.displayName = 'ColumnPicker';

export default ColumnPicker;
