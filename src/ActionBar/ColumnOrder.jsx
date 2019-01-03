import React from 'react'
import PropTypes from 'prop-types';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon'
import classnames from 'classnames'
import Tree from 'uxcore-tree';
import { getCheckAbleColumns } from '../util'

const TreeNode = Tree.TreeNode;

class ColumnOrder extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    onChange: PropTypes.func,
    isTableView: PropTypes.bool
  }
  static defaultProps = {
    iconName: 'paixu-jiangxu',
    onChange: () => {},
    isTableView: true
  }
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue,
      checkAbleColumns: getCheckAbleColumns(props.columns, props.includeActionColumn)
    }
    // this.checkAbleColumns = getCheckAbleColumns(props.columns)
  }
  onDrop = (data) => {
    const { includeActionColumn } = this.props;
    const { columns, otherColumns, actionColumn } = this.state.checkAbleColumns;
    // const dropKey = info.node.props.eventKey;
    // const dragKey = info.dragNode.props.eventKey;
    // const dropPos = info.node.props.pos.split('-');
    // const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const dragKey = data.dragNodesKeys[0];
    let newPos = data.dropPosition;
    if (newPos < 0) {
      newPos = 0
    }
    if (newPos > columns.length - 1) {
      newPos = columns.length - 1
    }
    let newColumns = [...columns];
    let index = 0;
    for (let i = 0; i < newColumns.length; i++) {
      let column = newColumns[i];
      if (column.type === 'action') {
        if (column.key === dragKey) {
          index = i;
          break
        }
      } else {
        if (column.dataKey === dragKey) {
          index = i;
          break
        }
      }
    }

    const tmp = newColumns[index];
    newColumns[index] = newColumns[newPos];
    newColumns[newPos] = tmp;
    this.setState({
      checkAbleColumns: {
        ...this.state.checkAbleColumns,
        columns: newColumns
      }
    });

    newColumns = otherColumns.concat(newColumns)
    // if includeActionColumn is true, newColumns had contain actionColumn
    if (actionColumn && !includeActionColumn) {
      newColumns.push(actionColumn)
    }
    this.props.handleColumnOrderChange(newColumns)
  }
  renderColumns() {
    const { columns } = this.state.checkAbleColumns
    let newColumns = [...columns]
    newColumns.map(column => {
      if (column.type === 'action') {
        column.key = '_action_'
      } else {
        column.key = column.dataKey
      }
      if (typeof column.title === 'function') {
        column.title = column.title()
      }
    })
    const renderNode = data => data.map((item) => {
      return <TreeNode key={item.key} title={item.title} />;
    });
    return (
      <Tree
        draggable
        onDrop={this.onDrop}
      >
        {renderNode(newColumns)}
      </Tree>
    )
  }
  render() {
    const p = this.props;
    const disabled = !p.keepActiveInCustomView && !p.isTableView
    return (
      <Popover
        overlay={!disabled ? this.renderColumns() : <div/>}
        trigger={['click']}
        // onClick={(e) => {debugger;e.preventDefault()}}
        overlayClassName={classnames({
          'list-action-bar-column-order-overlay': true,
          'kuma-popover-hidden': disabled
        })}
        placement={'bottomRight'}
      >
        <div className={classnames('column-order-title', {
          'disabled': disabled
        })}>
          <Icon usei name={p.iconName} />
          <span>{p.title}</span>
        </div>
      </Popover>
    )
  }
}

export default ColumnOrder;