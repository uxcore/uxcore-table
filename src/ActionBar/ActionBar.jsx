/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */


import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'uxcore-button';
import React from 'react';
import SearchBar from './SearchBar';
import ColumnPicker from './ColumnPicker';
import LinkBar from './LinkBar';
import CheckBox from "../Cell/CheckBox";
import RowOrder from './RowOrder'
import ColumnOrder from './ColumnOrder'
import Icon from 'uxcore-icon'
import Promise from 'lie'
import i18n from '../i18n';


class ActionBar extends React.Component {
  /**
   *  convert ActionBar config from hash to array
   */
  static getActionItem(config, useListActionBar) {
    let items = [];
    if (useListActionBar) {
      return config.buttons || []
    }
    if (config instanceof Array) {
      items = config;
    } else if (typeof config === 'object') {
      Object.keys(config).forEach((item) => {
        const callback = config[item];
        if (typeof callback === 'function') {
          items.push({
            title: item,
            callback,
          });
        }
      });
    }
    return items;
  }

  constructor(props) {
    super(props)
    this.state = {
      activatedView: 'table',
      removeMiniPagerInCustomView: false
    }
  }

  handleSearch(value) {
    this.props.onSearch(value);
  }

  renderActionBtn(item, index) {
    const me = this;
    const isCustomRender = !!item.render && typeof item.render === 'function'
    const isDisabled = (me.state.activatedView !== 'table' || item.disabled) && !item.keepActiveInCustomView;
    const itemProps = {
      className: `${me.props.prefixCls}-item ${item.className || ''}`,
      onClick: isDisabled ? () => {} : (item.callback || (() => {})),
      type: item.type || 'secondary',
      key: index,
    };
    if (isCustomRender) {
      return (
        <div {...itemProps} style={{cursor: 'pointer'}}>
          {item.render(item.title)}
        </div>
      );
    }
    if (index === 0 && !me.props.useListActionBar) {
      itemProps.type = 'outline';
    }
    return (
      <Button
        {...itemProps}
        size={item.size || 'small'}
        disabled={isDisabled}
      >
        {item.title}
      </Button>
    );
  }

  renderLinkBar(config) {
    const me = this;
    const { tablePrefixCls } = me.props;
    return <LinkBar config={config} prefixCls={`${tablePrefixCls}-linkbar`} />;
  }

  renderSearchBar(config) {
    const me = this;
    const searchBarProps = {
      onSearch: (value) => {
        me.handleSearch(value)
        config.onSearch(value)
      },
      key: 'searchbar',
      placeholder: config.placeholder || this.props.localePack.searchPlaceholder,
      prefixCls: `${me.props.tablePrefixCls}-searchbar`,
    };
    return <SearchBar {...searchBarProps} />;
  }

  renderColumnPicker(config) {
    const me = this;
    const {
      columns,
      handleColumnPickerChange,
      handleColumnPickerCheckAll,
      checkboxColumnKey,
      showColumnPickerCheckAll,
      width,
      locale,
      localePack,
      tablePrefixCls,
      useListActionBar
    } = me.props;
    const commonRenders = {
      columns,
      locale,
      localePack,
      dropdownMaxWidth: width,
      checkboxColumnKey,
      handleColumnPickerChange,
      handleColumnPickerCheckAll,
      showColumnPickerCheckAll,
      prefixCls: `${tablePrefixCls}-column-picker`
    };

    return (
      <ColumnPicker
        {...commonRenders}
        {...config}
        isTableView={me.state.activatedView === 'table'}
        useListActionBar={useListActionBar}
      />
    );
  }
  handleCheckBoxChange = (e) => {
    const v = e.target.checked;
    this.props.selectAll.apply(null, [v]);
  };

  renderSelectAll() {
    const me = this;
    const { checkStatus, localePack } = me.props
    const { isHalfChecked, isAllChecked, isAllDisabled } = checkStatus
    return (
      <span className={`${me.props.tablePrefixCls}-select-all`}>
        <CheckBox
          key={'actionBarSelectAll'}
          checked={isAllChecked}
          halfChecked={isHalfChecked}
          disable={isAllDisabled}
          onChange={me.handleCheckBoxChange}
          text={localePack.check_all}
        />
        {
          isHalfChecked ? <span style={{verticalAlign: 'middle'}}>{' '+ localePack.check_all}</span>: ''
        }
      </span>
    )
  }

  changeView = (e) => {
    const { useCustomView, actionBarConfig, data, currentPage } = this.props
    const { customView, removePagerInCustomView } = actionBarConfig
    const target = e.target;
    const name = target.getAttribute('data-name');
    if (!name) {
      return
    }
    this.setState({
      activatedView: name
    })
    if (name === 'custom') {
      this.setState({
        removeMiniPagerInCustomView: true
      })
      const view = customView.render(data, currentPage);
      if (typeof view.$$typeof === 'symbol') {
        useCustomView(view, removePagerInCustomView)
      } else if (view.constructor.name === 'Promise') {
        view.then(data => {
          useCustomView(data, removePagerInCustomView)
        })
      } else {
        console.warn('不支持的customView类型')
      }
      // const view = renderCustomView(data, currentPage);
      // if (view && typeof view === 'object' && view.type && view.props && name !== 'table') {
      //   useCustomView(view, removePagerInCustomView)
      // }
    } else {
      useCustomView(null)
      this.setState({
        removeMiniPagerInCustomView: false
      })
    }
  }

  renderListActionBar(config) {
    const me = this;
    const { activatedView } = me.state;
    const {
      columns,
      handleColumnOrderChange,
      locale,
      localePack
    } = me.props;
    const {
      className,
      showSelectAll,
      actionBarTip,
      customBarItem,
      rowOrder,
      columnsOrder,
      columnsPicker,
      showMiniPager,
      customView,
      linkBar,
      search
    } = config;
    return (
      <div className={classnames(`${me.props.tablePrefixCls}-list-action-bar`, {
        [className]: className
      })}>
        <div className={'left'}>
          {showSelectAll ? me.renderSelectAll() : null}
          {
            config.buttons.map((item, index) => {
              return me.renderActionBtn(item, index)
            })
          }
          {
            actionBarTip ? <div style={{ display: 'inline-block' }}>
              {
                typeof actionBarTip === 'string' ? actionBarTip : typeof actionBarTip === 'function' ? actionBarTip() : null
              }
            </div> : null
          }
        </div>
        {
          customBarItem && customBarItem.render ? <div className={'custom'}>
            {customBarItem.render()}
          </div> : null
        }
        <div className={'right'}>
          {search ? this.renderSearchBar(search) : null}
          {customView ? <div onClick={this.changeView}>
            <Icon usei className={classnames({
              active: activatedView === 'table'
            })} data-name={'table'} name={'renwufull'} />
            <Icon usei className={classnames({
              active: activatedView === 'custom'
            })} data-name={'custom'} name={'biaoge1'} />
          </div> : null }
          {
            showMiniPager && !this.state.removeMiniPagerInCustomView ? <div style={{ paddingTop: '5px'}}>
              {
                this.props.renderPager(true)
              }
            </div> : null
          }
          {
            columnsPicker ? this.renderColumnPicker(columnsPicker) : null
          }
          {
            columnsOrder ? <ColumnOrder
              {...columnsOrder}
              locale={locale}
              localePack={localePack}
              handleColumnOrderChange={handleColumnOrderChange}
              columns={columns}
              isTableView={activatedView === 'table'}
            /> : null
          }
          {
            rowOrder ? <RowOrder
              {...rowOrder}
              isTableView={activatedView === 'table'}
            /> : null
          }
          {linkBar ? this.renderLinkBar(linkBar) : null}
        </div>
      </div>
    )
  }

  fixActionBarConfig() { // when useListActionBar is false or undefined
    const {
      showSearch,
      onSearch, // 此处的onSearch并非table上的onSearch，而是handleActionBarSearch，未对外暴露
      searchBarPlaceholder,
      showColumnPicker,
      onColumnPicker,
      linkBar,
      localePack,
      actionBarConfig,
      useListActionBar
    } = this.props;
    let barConfig = {}
    if (useListActionBar) {
      if (!actionBarConfig || typeof actionBarConfig !== 'object') {
        console.error('当useListActionBar为true时，actionBar参数不可省略')
      }
      barConfig = {
        ...actionBarConfig
      }
      if (!barConfig.buttons || !barConfig.buttons.splice) {
        barConfig.buttons = []
      }
    } else {
      barConfig.buttons = ActionBar.getActionItem(actionBarConfig)
    }

    if (showColumnPicker) {
      if (!barConfig.columnsPicker) {
        barConfig.columnsPicker = {
          iconName: 'zidingyilie',
          title: localePack.templated_column,
          keepActiveInCustomView: true,
          onChange(data) {
            onColumnPicker && onColumnPicker(data)
          }
        }
      }
    }

    if (showSearch) {
      if (!barConfig.search) {
        barConfig.search = {
          placeholder: searchBarPlaceholder || localePack.searchPlaceholder,
          onSearch: (value) => {
            onSearch && onSearch(value)
          }
        }
      }
    }

    if (linkBar) {
      if (!barConfig.linkBar) {
        barConfig.linkBar = linkBar
      }
    }
    return barConfig;
  }

  render() {
    const { props } = this;
    const actionBarConfig = this.fixActionBarConfig();
    return (
      <div
        className={classnames(`${props.tablePrefixCls}-actionbar`, {
          'fn-clear': true,
        })}
      >
        {this.renderListActionBar(actionBarConfig)}
      </div>
    );
  }
}

ActionBar.propTypes = {
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  localePack: PropTypes.object,
};

ActionBar.defaultProps = {
  showSearch: false,
  onSearch: () => {},
  localePack: {},
};

export default ActionBar;
