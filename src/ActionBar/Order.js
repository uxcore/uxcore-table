import React from 'react'
import PropTypes from 'prop-types';
import Menu from 'uxcore-menu'
import Dropdown from 'uxcore-dropdown'
import Icon from 'uxcore-icon'

class Order extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    items: PropTypes.array,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func
  }
  static defaultProps = {
    iconName: 'paixu-jiangxu',
    defaultValue: {},
    items: [],
    onChange: () => {}
  }
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue
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
                  {value.value === item.value ? <Icon name={'duigou'} className={'icon'} /> : ''}
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
    return (
      <Dropdown overlay={this.renderMenus()}>
        <div>
          <Icon name={p.iconName} className={'order-icon'} />
          {this.state.value.text}
        </div>
      </Dropdown>
    )
  }
}

export default Order;