import React from 'react';
import classnames from 'classnames';
import Tree from 'uxcore-tree';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon';
import i18n from '../i18n';
import { getSelectedKeys, getConsts } from '../util';

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
    if (me.state.visible) {
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

  renderTree() {
    const me = this;
    const { columns } = me.props;
    const notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    notRenderColumns.push(me.props.checkboxColumnKey);
    const options = [];
    const groupTree = [];
    const selectedKeys = getSelectedKeys(columns);
    me.groupNum = 0;
    columns.forEach((item) => {
      // the column is not the notRender one and is not the group.
      const isGroup = {}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object';
      if (isGroup) {
        me.hasGroup = true;
      }
      if (notRenderColumns.indexOf(item.dataKey) === -1 && !isGroup) {
        if (item.dataKey) {
          options.push(
            <TreeNode
              key={item.dataKey}
              title={typeof item.title === 'function' ? item.title() : item.title}
            />
          );
        }
      } else if (isGroup) {
        groupTree.push(me.renderGroupTree(item, me.groupNum));
        me.groupNum += 1;
      }
    });

    const commonGroupName = getConsts().commonGroup;
    const commonTree = (
      <Tree
        checkable
        multiple
        selectable={false}
        className={!me.hasGroup ? 'no-group' : ''}
        ref={me.saveRef('commonTree')}
        checkedKeys={selectedKeys}
        onCheck={me.handlePickerSelect.bind(me, commonGroupName)}
      >
        {options}
      </Tree>
    );

    if (!me.hasGroup) {
      return commonTree;
    }

    return (
      <div>
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

    const selectedKeys = getSelectedKeys(group.columns);

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
            <Icon name="zidingyilie" className={`${prefixCls}-icon`} />
            <span className={`${prefixCls}-title`}>{i18n[locale]['templated-column']}</span>
          </div>
        </div>
      </Popover>
    );
  }
}

ColumnPicker.defaultProps = {
  prefixCls: 'kuma-uxtable-column-picker',
  locale: 'zh-cn',
  columns: [],
};
ColumnPicker.propTypes = {
  prefixCls: React.PropTypes.string,
  locale: React.PropTypes.string,
  columns: React.PropTypes.array,
  handleColumnPickerChange: React.PropTypes.func,
};

ColumnPicker.displayName = 'ColumnPicker';

export default ColumnPicker;
