import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tree from 'uxcore-tree';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon';
import i18n from '../i18n';
import util from '../util';
import Checkbox from '../Cell/CheckBox';

const { getSelectedKeys, getConsts } = util;

const { TreeNode } = Tree;

class ColumnPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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
        <Checkbox
          onChange={this.handleChexkAll}
          checked={selectedKeys.length !== 0}
          halfChecked={selectedKeys.length !== 0 ? isHalfChecked : false}
        />
        {i18n[locale].check_all}
        <div className={`${prefixCls}-check-all-split-line`} />
      </div>
    );
  }

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

  render() {
    const me = this;
    const { prefixCls, locale } = me.props;
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
