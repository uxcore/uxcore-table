import React from 'react'
import PropTypes from 'prop-types';
import Menu from 'uxcore-menu'
import Popover from 'uxcore-popover';
import Icon from 'uxcore-icon'
import classnames from 'classnames'

class RowOrder extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    items: PropTypes.array,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func,
    isTableView: PropTypes.bool
  }
  static defaultProps = {
    iconName: 'paixu-jiangxu',
    defaultValue: {},
    items: [],
    onChange: () => {},
    isTableView: true
  }
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue,
      overlayId: `overlay_${setTimeout(0)}`
    }
  }
  handleSelect = (data) => {
    const textValue = data.key.split('__');
    const value = {
      text: textValue[0],
      value: textValue[1]
    }
    this.setState({
      value,
    })
    const overlay = document.querySelector(`.${this.state.overlayId}`)
    if (overlay) {
      overlay.classList.add('kuma-popover-hidden')
    }
    this.props.onChange(value)
  }
  renderMenus() {
    const { value } = this.state;
    const { items } = this.props;
    return (
      <Menu onClick={this.handleSelect} className={'list-action-bar-order-menu'}>
        {
          items.map(item => {
            return (
              <Menu.Item key={`${item.text}__${item.value}`}>
                {item.text}
                <span className={'icon-wrapper'}>
                  {value.value === item.value ? <Icon usei name={'duigou'} /> : ''}
                </span>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )
  }
  render() {
    const p = this.props;
    const disabled = !p.keepActiveInCustomView && !p.isTableView
    return (
      <Popover
        overlay={!disabled ? this.renderMenus() : <div/>}
        trigger={'click'}
        overlayClassName={classnames({
          'list-action-bar-order-overlay': true,
          [this.state.overlayId]: true,
          'kuma-popover-hidden': disabled
        })}
        placement={'bottomRight'}
      >
        <div className={classnames('order-title', {
          'disabled': disabled
        })}>
          <Icon usei name={p.iconName} />
          <span>{this.state.value.text}</span>
        </div>
      </Popover>
    )
  }
}

export default RowOrder;
