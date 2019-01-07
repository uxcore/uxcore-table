import React from 'react'
import PropTypes from 'prop-types';
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon'
import classnames from 'classnames'
import { getCheckAbleColumns } from '../util'
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
      checkAbleColumns: getCheckAbleColumns(props.columns, props.includeActionColumn),
    }
  }
  onDrop = (data, dragInfo) => {
    const { otherColumns } = this.state.checkAbleColumns
    this.props.onChange(dragInfo, data, otherColumns)
    this.props.handleColumnOrderChange(data.concat(otherColumns))
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
        overlay={!disabled ? this.renderColumns() : <div/>}
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