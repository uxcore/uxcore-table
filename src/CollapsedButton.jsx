import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'uxcore-button';
import Dropdown from 'uxcore-dropdown';
import Menu from 'uxcore-menu';
import classnames from 'classnames';
import i18n from './i18n';

/**
 * only consider the button style and how to collapse
 */

const CollapsedButtonItem = () => {};


class CollapsedButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
    };
    this.handleDropdownVisibleChange = this.handleDropdownVisibleChange.bind(this);
    this.handleMoreClick = this.handleMoreClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (React.Children.count(nextProps.children) < this.toNum(nextProps.maxLength)) {
      this.setState({
        dropdownVisible: false,
      });
    }
  }

  componentDidUpdate() {
    const { children, maxLength } = this.props;
    if (this.state.dropdownVisible
      && this.toNum(maxLength) === 1
      && React.Children.count(children) > 1
    ) {
      const dropdownDOMNode = this.dropdownInstance.getPopupDomNode();
      const triggerDOMnode = ReactDOM.findDOMNode(this.triggerInstance);

      dropdownDOMNode.style.minWidth = `${(triggerDOMnode || this.triggerInstance).offsetWidth}px`;
    }
  }

  toNum(variable) {
    if (typeof variable === 'string') {
      return variable - 0;
    }
    return variable;
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
      return false;
    };
  }

  handleDropdownVisibleChange(visible) {
    const me = this;
    me.setState({
      dropdownVisible: visible,
    });
  }

  handleMoreClick(e) {
    e.preventDefault();
    const me = this;
    me.setState({
      dropdownVisible: !me.state.dropdownVisible,
    });
  }

  renderItem(item, index) {
    const me = this;
    const { type } = me.props;
    const itemProps = {
      className: 'action',
      key: index,
      onClick: item.props.disabled ? (() => {}) : item.props.onClick,
    };
    if (type === 'button') {
      return (
        <Button
          {...itemProps}
          type="outline"
          size="small"
          disabled={!!item.props.disabled}
        >
          {item.props.children}
        </Button>
      );
    }
    return (
      <a
        {...itemProps}
        className={classnames({
          action: true,
          disabled: !!item.props.disabled,
        })}
      >
        {item.props.children}
      </a>
    );
  }

  renderMore(actions) {
    if (actions.length === 0) {
      return null;
    }
    const me = this;
    const menu = (
      <Menu>
        {actions.map((action, index) => (
          <Menu.Item key={index} disabled={!!action.props.disabled}>
            <a onClick={action.props.onClick}>{action.props.children}</a>
          </Menu.Item>
        ))}
      </Menu>
    );

    const offsetY = me.props.type === 'button' ? -5 : -20;
    const dropdownOptions = {
      key: 'icon',
      overlay: menu,
      trigger: ['click'],
      align: {
        offset: [0, offsetY],
      },
      visible: me.state.dropdownVisible,
      overlayClassName: `${me.props.prefixCls}-collapsed-button-more-dropdown`,
      onVisibleChange: me.handleDropdownVisibleChange,
    };
    const content = (
      <span>
        {i18n[me.props.locale].more}
        <i
          className={classnames({
            'kuma-icon': true,
            'kuma-icon-triangle-down': !me.state.dropdownVisible,
            'kuma-icon-triangle-up': me.state.dropdownVisible,
          })}
        />
      </span>
    );
    if (me.props.type === 'button') {
      return (
        <Dropdown {...dropdownOptions}>
          <Button className="action" type="outline" size="small">{content}</Button>
        </Dropdown>
      );
    }
    return (
      <Dropdown {...dropdownOptions}>
        <a className="action" onClick={me.handleMoreClick}>
          {content}
        </a>
      </Dropdown>
    );
  }

  renderHoverMenu() {
    const me = this;
    const { children, type } = me.props;
    let trigger;
    const options = [];
    React.Children.forEach(children, (child, index) => {
      if (index === 0) {
        const triggerContent = (
          <span>
            {child.props.children}
            <i
              className={classnames({
                'kuma-icon': true,
                'kuma-icon-triangle-down': !me.state.dropdownVisible,
                'kuma-icon-triangle-up': me.state.dropdownVisible,
              })}
            />
          </span>
        );
        if (type === 'button') {
          trigger = (
            <Button
              className="action"
              type="outline"
              size="small"
              ref={me.saveRef('triggerInstance')}
            >
              {triggerContent}
            </Button>
          );
        } else {
          trigger = (
            <a className="action collapse-one" ref={me.saveRef('triggerInstance')}>
              {triggerContent}
            </a>
          );
        }
      }
      options.push(
        <Menu.Item key={index} disabled={!!child.props.disabled}>
          <a
            onClick={child.props.onClick}
          >{child.props.children}</a>
        </Menu.Item>
      );
    });
    const menu = (
      <Menu>
        {options}
      </Menu>
    );

    const offsetY = type === 'button' ? -31 : -44;

    const dropdownOptions = {
      key: 'icon',
      overlay: menu,
      ref: me.saveRef('dropdownInstance'),
      trigger: ['hover'],
      align: {
        offset: [0, offsetY],
      },
      visible: me.state.dropdownVisible,
      overlayClassName: `${me.props.prefixCls}-collapsed-button-more-dropdown`,
      onVisibleChange: me.handleDropdownVisibleChange,
    };

    return (
      <Dropdown {...dropdownOptions}>
        {trigger}
      </Dropdown>
    );
  }

  render() {
    const me = this;
    const { children, maxLength } = me.props;
    const buttons = [];
    const options = [];
    if (me.toNum(maxLength) === 1 && React.Children.count(children) > 1) {
      return (
        <div>{me.renderHoverMenu()}</div>
      );
    }
    if (React.Children.count(children) <= me.toNum(maxLength)) {
      React.Children.forEach(children, (item, index) => {
        buttons.push(me.renderItem(item, index));
      });
    } else {
      React.Children.forEach(children, (item, index) => {
        if (index < me.toNum(maxLength) - 1) {
          buttons.push(me.renderItem(item, index));
        } else {
          options.push(item);
        }
      });
    }

    return (
      <div>
        {buttons}
        {me.renderMore(options)}
      </div>
    );
  }
}

CollapsedButton.displayName = 'CollapsedButton';

CollapsedButton.Item = CollapsedButtonItem;

CollapsedButton.propTypes = {
  children: React.PropTypes.any,
  locale: React.PropTypes.string,
  maxLength: React.PropTypes.number,
  onClick: React.PropTypes.func,
};
CollapsedButton.defaultProps = {
  maxLength: 3,
  onClick: () => {},
};

export default CollapsedButton;
