import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'uxcore-icon'
import classnames from 'classnames'

class DraggableList extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    draggable: PropTypes.bool,
    data: PropTypes.array,
    itemRender: PropTypes.func,
    onDrop: PropTypes.func
  }
  static defaultProps = {
    prefixCls: 'kuma-draggable-list',
    draggable: true,
    data: [],
    itemRender: () => {},
    onDrop: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      dragElement: null,
      isDragging: false
    }
  }
  onDragStart = (e) => {
    const dragElement = e.currentTarget
    dragElement.classList.add('is-dragging');
    this.setState({
      dragElement,
      isDragging: true
    })
    this.dragLock = true
  }
  onDragEnter = (e) => {
    const { dragElement } = this.state;
    const target = e.currentTarget;
    const parent = target.parentElement
    if (target !== dragElement) {
      parent.insertBefore(dragElement, target)
    }
  }
  onDragLeave = (e) => {
    const { dragElement } = this.state;
    const target = e.currentTarget;
    const parent = target.parentElement;
    if (target !== dragElement ) {
      const last = parent.lastElementChild;
      if (this.dragLock && target === last) {
        parent.appendChild(dragElement)
        this.dragLock = false
      } else {
        this.dragLock = true
      }
    }
  }
  onDragEnd = (e) => {
    const { prefixCls, onDrop, data } = this.props
    const { dragElement } = this.state
    dragElement.classList.remove('is-dragging')
    const dragInfo = {
      dragColumn: dragElement.getAttribute('data-key'),
      dragPosition: +dragElement.getAttribute('data-index'),
      dropPosition: 0
    }
    this.setState({
      dragElement: null,
      isDragging: false
    })
    const resultNodes = (dragElement.parentNode ? dragElement.parentNode : document).querySelectorAll(`.${prefixCls}-item`)
    let newData = []
    for (let i = 0; i < resultNodes.length; i++) {
      const node = resultNodes[i]
      const index = node.getAttribute('data-index')
      if (index === dragInfo.dragPosition) {
        dragInfo.dropPosition = i
      }
      newData[i] = data[index]
    }
    onDrop(newData, dragInfo)
  }

  render() {
    const { prefixCls, draggable, itemRender, data } = this.props;
    return(
      <div className={`${prefixCls}-wrapper`}>
        {
          data.map((item, index) => {
            return (
              <div
                key={item.dataKey || item.type || `key_${Math.random()}`}
                className={classnames(`${prefixCls}-item`, {'can-drag': draggable})}
                data-index={index}
                data-key={item.dataKey || item.type}
                draggable={draggable}
                onDragStart={this.onDragStart}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragEnd={this.onDragEnd}
                onDragOver={function(e) {e.preventDefault()}}
                onDrop={function(e){e.preventDefault()}}
              >
                {itemRender(item)}
                {draggable ? <Icon usei name="drag" /> : null}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default DraggableList
