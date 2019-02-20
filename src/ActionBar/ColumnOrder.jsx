import React from 'react'
import PropTypes from 'prop-types';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon'
import classnames from 'classnames'
import { getColumnsInfo } from '../util'
import DraggableList from './DraggableList'


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
      preColumns: props.columns,
      checkAbleColumns: getColumnsInfo(props.columns, props.includeActionColumn),
    }
  }
  static getDerivedStateFromProps = (props, state) => {
    if (props.columns !== state.preColumns) {
      return {
        checkAbleColumns: getColumnsInfo(props.columns, props.includeActionColumn),
        preColumns: props.columns
      };
    }
    return null;
  }
  onDrop = (data, dragInfo) => {
    const { otherColumns, actionColumnPos, actionColumn, fixedColumns } = this.state.checkAbleColumns
    const { includeActionColumn } = this.props
    this.props.onChange(dragInfo, data, otherColumns)
    // 如果不允许排序操作列，则此处需要添加回去
    if (!includeActionColumn) {
      data.splice(actionColumnPos - otherColumns.length, 0, actionColumn);
    }
    // 同样也要将fixedColumns和othersColumns添加回去
    this.props.handleColumnOrderChange(otherColumns.concat(fixedColumns).concat(data))
  }
  renderDragList() {
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
    newColumns = newColumns.filter(item => {
      return !item.fixed && !item.rightFixed
    })
    return (
      <DraggableList
        data={newColumns}
        itemRender={(item) => {
          return (
            <div key={item.key}>{item.title}</div>
          )
        }}
        onDrop={this.onDrop}
      />
    )
  }
  render() {
    const p = this.props;
    const disabled = !p.keepActiveInCustomView && !p.isTableView
    return (
      <Popover
        overlay={!disabled ? this.renderDragList() : <div/>}
        trigger={'click'}
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
