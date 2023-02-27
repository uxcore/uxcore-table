import React from 'react';
import assign from 'object-assign';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Dropdown from 'uxcore-dropdown';
import CheckBoxGroup from 'uxcore-checkbox-group';
import Icon from 'uxcore-icon';
import Menu from 'uxcore-menu';
import isEqual from 'lodash/isEqual';
import { polyfill } from 'react-lifecycles-compat';
import CheckBox from '../Cell/CheckBox';
import MessageIcon from './MessageIcon';
import Draggable from 'react-draggable'

class HeaderCell extends React.Component {
  static displayName = 'HeaderCell';

  static propTypes = {
    prefixCls: PropTypes.string,
    onCheckboxChange: PropTypes.func,
    onFilter: PropTypes.func,
    filterSelectedKeys: PropTypes.array,
    localePack: PropTypes.object,
  }

  static defaultProps = {
    onFilter: () => { },
    filterSelectedKeys: [],
    localePack: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      filterSelectedKeys: props.filterSelectedKeys,
      lastFilterSelectedKeys: props.filterSelectedKeys,
      lastColumnWidth: 0
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.filterSelectedKeys !== state.lastFilterSelectedKeys) {
      return {
        filterSelectedKeys: props.filterSelectedKeys,
        lastFilterSelectedKeys: props.filterSelectedKeys,
      };
    }
    return null;
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  getWidth() {
    if (this.root) {
      return this.root.clientWidth;
    }
    return 0;
  }

  handleFilterDropdownVisible(filterVisible) {
    this.setState({
      filterVisible,
    }, () => {
      if (filterVisible === false
        && !isEqual(this.state.filterSelectedKeys, this.props.filterSelectedKeys)) {
        this.props.onFilter(this.state.filterSelectedKeys);
      }
    });
  }

  handleFilterCheckboxChange(checked, value) {
    let filterSelectedKeys = this.state.filterSelectedKeys.slice(0);
    if (checked) {
      filterSelectedKeys.push(value);
    } else {
      filterSelectedKeys = filterSelectedKeys.filter(item => item !== value);
    }
    this.setState({
      filterSelectedKeys,
    });
  }

  handleFilterActionReset() {
    this.setState({
      filterVisible: false,
      filterSelectedKeys: [],
    }, () => {
      this.props.onFilter([]);
    });
  }

  handleFilterActionConfirm() {
    this.setState({
      filterVisible: false,
    }, () => {
      if (!isEqual(this.state.filterSelectedKeys, this.props.filterSelectedKeys)) {
        this.props.onFilter(this.state.filterSelectedKeys);
      }
    });
  }

  renderIndent(index) {
    if (this.firstIndex !== index) {
      return null;
    }
    const me = this;
    const { renderModel, checkboxColumnKey } = me.props;
    if (renderModel === 'tree') {
      return (
        <span
          className={classnames({
            indent: true,
            hasCheck: checkboxColumnKey,
          })}
        />
      );
    }
    return null;
  }

  renderRequired(item) {
    const { prefixCls } = this.props;
    if (item.required) {
      return (
        <span className={`${prefixCls}-item-required`}>
          *
          {' '}
        </span>
      );
    }
    return null;
  }

  renderFilterMenu(filter) {
    const { prefixCls } = this.props;
    if (Array.isArray(filter.children) && filter.children.length) {
      return (
        <Menu.SubMenu key={filter.value} title={filter.text}>
          {filter.children.map(child => this.renderFilterMenu(child))}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={filter.value}>
        <CheckBoxGroup.Item
          checked={this.state.filterSelectedKeys.indexOf(filter.value) !== -1}
          onChange={(checked, value) => { this.handleFilterCheckboxChange(checked, value); }}
          text={filter.text}
          value={filter.value}
          className={`${prefixCls}-item-filter-checkbox`}
        />
      </Menu.Item>
    );
  }

  renderFilterIcon(column) {
    const { prefixCls } = this.props;
    if (Array.isArray(column.filters) && column.filters.length) {
      const menu = (
        <Menu
          mode="vertical"
          prefixCls="kuma-dropdown-menu"
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {column.filters.map(filter => this.renderFilterMenu(filter))}
        </Menu>
      );

      const overlay = (
        <div>
          {menu}
          <div className={`${prefixCls}-item-filter-action-bar`}>
            <div
              className={`${prefixCls}-item-filter-action-button ${prefixCls}-item-filter-action-button-reset`}
              onClick={() => { this.handleFilterActionReset(); }}
            >
              {this.props.localePack.reset}

            </div>
            <div
              className={`${prefixCls}-item-filter-action-button ${prefixCls}-item-filter-action-button-confirm`}
              onClick={() => { this.handleFilterActionConfirm(); }}
            >
              {this.props.localePack.okText}

            </div>
          </div>
        </div>
      );
      return (
        <Dropdown
          overlayClassName={`${prefixCls}-item-filter-dropdown`}
          overlay={overlay}
          trigger={['click']}
          visible={this.state.filterVisible}
          onVisibleChange={(visible) => { this.handleFilterDropdownVisible(visible); }}
        >
          <Icon
            usei
            name="shaixuan"
            className={classnames(`${prefixCls}-item-filter-icon`, {
              [`${prefixCls}-item-filter-icon__active`]: this.state.filterSelectedKeys.length > 0,
            })}
          />
        </Dropdown>
      );
    }
    return null;
  }

  renderOrderIcon(column) {
    const me = this;
    const {
      orderType, activeColumn, onColumnOrder, tablePrefixCls,
    } = me.props;
    if (column.ordered) {
      const desc = 'triangle-down';
      const asc = 'triangle-up';
      const isActive = activeColumn && activeColumn.dataKey === column.dataKey;
      return (
        <span className={`${tablePrefixCls}-h-sort`} onClick={() => { onColumnOrder(); }}>
          <i
            className={classnames({
              [`kuma-icon kuma-icon-${asc}`]: true,
              active: isActive && orderType === 'asc',
            })}
          />
          <i
            className={classnames({
              [`kuma-icon kuma-icon-${desc}`]: true,
              active: isActive && orderType === 'desc',
            })}
          />
        </span>
      );
    }
    return null;
  }
  onDrag = (e, data, column) => {
    const changeWidth = data.lastX - this.state.lastColumnWidth;
    // console.log(data.lastX, this.state.lastColumnWidth, changeWidth)

    this.props.handleColumnResize(e, changeWidth, column, data.node)
    this.setState({
      lastColumnWidth: data.lastX
    })
  }

  needResize(column) {
    const { columnResizeable, last } = this.props
    return columnResizeable
      && column.type !== 'treeIcon'
      && column.type !== 'checkboxSelector'
      && column.type !== 'radioSelector'
      // && !column.fixed
      && !column.rightFixed
      && !column.hidden
      && !last
  }

  render() {
    const me = this;
    const {
      renderModel,
      prefixCls,
      column,
      index,
      hasGroup,
      last,
      tablePrefixCls,
      isStickyHeader,
      isFixedHeader,
      size,
      tooltipPlacement
    } = me.props;
    const rowSelectorInTreeMode = (['checkboxSelector', 'radioSelector'].indexOf(column.type) !== -1)
      && (renderModel === 'tree');
    if (column.hidden || rowSelectorInTreeMode) {
      me.firstIndex = index + 1;
      return null;
    }
    const noBorderColumn = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    const style = {
      width: column.width ? column.width : '100px',
      textAlign: column.align ? column.align : 'left',
      position: 'relative',
      textOverflow: column.textOverflow || 'inherit'
    };
    let v;
    if (hasGroup) {
      assign(style, {
        height: !isFixedHeader ? (size === 'small' ? '80px' : '100px') : (size === 'small' ? '81px' : '101px') ,
        lineHeight: !isFixedHeader ? (size === 'small' ? '80px' : '100px') : (size === 'small' ? '81px' : '101px') ,
      });
    }

    if (column.type === 'checkbox' || column.type === 'checkboxSelector') {
      assign(style, {
        paddingRight: '4px',
        paddingLeft: '12px',
        width: column.width ? column.width : '32px',
      });

      const checkBoxProps = {
        ref: me.saveRef('checkbox'),
        checked: me.props.checkStatus.isAllChecked,
        halfChecked: me.props.checkStatus.isHalfChecked,
        disable: me.props.checkStatus.isAllDisabled,
        onChange: this.props.onCheckboxChange,
      };

      v = <CheckBox {...checkBoxProps} />;
    } else {
      const content = (typeof column.title === 'function') ? column.title() : column.title;
      const title = (typeof column.title === 'function') ? undefined : column.title;
      v = (
        <span title={title}>
          {content}
        </span>
      );
    }
    if (noBorderColumn.indexOf(column.dataKey) !== -1 || last && !column.fixed) {
      assign(style, {
        borderRight: 'none',
      });
    }

    const needResize = this.needResize(column)
    if (needResize) {
      assign(style, {
        borderRight: '1px solid rgba(31, 56, 88, 0.1)'
      })
    }

    return (
      <div
        key={index}
        className={classnames({
          [`${tablePrefixCls}-cell`]: true,
          [`${tablePrefixCls}-cell__action-collapsed`]: column.type === 'action' && column.collapseNum === 1,
          'show-border': me.props.showHeaderBorder,
        })}
        style={style}
        ref={(c) => { this.root = c; }}
      >
        {me.renderIndent(index)}
        {me.renderRequired(column)}
        {v}
        {me.renderOrderIcon(column)}
        {me.renderFilterIcon(column)}
        <MessageIcon message={column.message} prefixCls={`${prefixCls}-msg`} tooltipPlacement={column.tooltipPlacement || tooltipPlacement} isStickyHeader={isStickyHeader} />
        {

          needResize
            ? <Draggable
                axis="x"
                onDrag={(e, dragNode) => {this.onDrag(e, dragNode, column)}}
              >
              <span className={`${tablePrefixCls}-cell-resize-icon`} style={{width: '10px', right: '0'}} />
            </Draggable>
            : null }
      </div>
    );
  }
}

polyfill(HeaderCell);

export default HeaderCell;
