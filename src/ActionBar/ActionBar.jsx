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
import ColumnPicker from './ColumnPickerNew';
import LinkBar from './LinkBar';
import CheckBox from "../Cell/CheckBox";
import ListOrder from './ListOrder'
import Icon from 'uxcore-icon'

class ActionBar extends React.Component {
  /**
   *  convert ActionBar config from hash to array
   */
  static getActionItem(config, isListActionBar) {
    let items = [];
    if (isListActionBar) {
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
    }
  }

  handleSearch(value) {
    this.props.onSearch(value);
  }

  renderActionBtn(item, index) {
    const me = this;
    const itemProps = {
      className: `${me.props.prefixCls}-item`,
      onClick: item.callback || (() => {}),
      type: item.type || 'secondary',
      key: index,
    };
    if (!!item.render && typeof item.render === 'function') {
      return (
        <div {...itemProps}>
          {item.render(item.title)}
        </div>
      );
    }
    if (index === 0 && !me.props.actionBarConfig.useListActionBar) {
      itemProps.type = 'outline';
    }
    return (
      <Button
        size={item.size || 'small'}
        disabled={(me.state.activatedView !== 'table' || item.disabled) && !item.keepActiveInCustomView}
        {...itemProps}
      >
        {item.title}
      </Button>
    );
  }

  renderLinkBar() {
    const me = this;
    const { linkBar, tablePrefixCls } = me.props;
    return <LinkBar config={linkBar} prefixCls={`${tablePrefixCls}-linkbar`} />;
  }

  renderSearchBar() {
    if (this.props.showSearch) {
      const me = this;
      const searchBarProps = {
        onSearch: me.handleSearch.bind(me),
        key: 'searchbar',
        placeholder: me.props.searchBarPlaceholder,
        prefixCls: `${me.props.tablePrefixCls}-searchbar`,
      };
      return <SearchBar {...searchBarProps} />;
    }
    return null;
  }

  renderColumnPicker() {
    const me = this;
    const {
      showColumnPicker,
      columns,
      handleColumnPickerChange,
      handleColumnPickerCheckAll,
      checkboxColumnKey,
      showColumnPickerCheckAll,
      width,
      locale,
      tablePrefixCls,
      actionBarConfig,
    } = me.props;
    if (!showColumnPicker) {
      return null;
    }
    const  { columnsPicker } = actionBarConfig;
    return (
      <ColumnPicker
        {...columnsPicker}
        isTableView={me.state.activatedView === 'table'}
        columns={columns}
        locale={locale}
        dropdownMaxWidth={width}
        checkboxColumnKey={checkboxColumnKey}
        handleColumnPickerChange={handleColumnPickerChange}
        handleColumnPickerCheckAll={handleColumnPickerCheckAll}
        showColumnPickerCheckAll={showColumnPickerCheckAll}
        prefixCls={`${tablePrefixCls}-column-picker`}
      />
    );
  }
  handleCheckBoxChange = (e) => {
    const v = e.target.checked;
    this.props.selectAll.apply(null, [v]);
  };

  renderSelectAll() {
    const me = this;
    return (
      <span className={`${me.props.tablePrefixCls}-select-all`}>
        <CheckBox
          key={'actionBarSelectAll'}
          checked={me.props.checkStatus.isAllChecked}
          halfChecked={me.props.checkStatus.isHalfChecked}
          disable={me.props.checkStatus.isAllDisabled}
          onChange={me.handleCheckBoxChange}
          text={'全选'}
        />
      </span>
    )
  }

  changeView = async (e) => {
    const { useCustomView, actionBarConfig, data, currentPage } = this.props
    const { renderCustomView, removePagerInCustomView } = actionBarConfig
    const target = e.target;
    const name = target.getAttribute('data-name');
    if (!name) {
      return
    }
    this.setState({
      activatedView: name
    })
    if (name === 'custom') {
      const view = await renderCustomView(data, currentPage);
      if (view && typeof view === 'object' && view.type && view.props && name !== 'table') {
        useCustomView(view, removePagerInCustomView)
      }
    } else {
      useCustomView(null)
    }
  }

  renderListActionBar() {
    const me = this;
    const {
      useListActionBar,
      showSelectAll,
      actionBarTip,
      renderCustomBarItem,
      orderBy,
      columnsPicker,
      showPager
    } = me.props.actionBarConfig;

    const { activatedView } = me.state;

    if (!useListActionBar) {
      return null
    }
    return (
      <div className={`${me.props.tablePrefixCls}-list-action-bar`}>
        <div className={'left'}>
          {showSelectAll ? me.renderSelectAll() : null}
          {
            ActionBar.getActionItem(me.props.actionBarConfig, true).map((item, index) => {
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
          renderCustomBarItem ? <div style={{ display: 'inline-block' }}>
            {
              typeof renderCustomBarItem === 'string' ? renderCustomBarItem : typeof renderCustomBarItem === 'function' ? renderCustomBarItem() : null
            }
          </div> : null
        }
        <div className={'right'}>
          <div onClick={this.changeView}>
            <Icon usei className={classnames({
              active: activatedView === 'table'
            })} data-name={'table'} name={'renwufull'} />
            <Icon usei className={classnames({
              active: activatedView === 'custom'
            })} data-name={'custom'} name={'biaoge1'} />
          </div>
          {
            showPager ? <div style={{ paddingTop: '5px'}}>
              {
                this.props.renderPager(true)
              }
            </div> : null
          }
          {
            columnsPicker ? this.renderColumnPicker() : null
          }
          {
            orderBy ? <ListOrder
              {...orderBy}
              isTableView={activatedView === 'table'}
            /> : null
          }
        </div>
      </div>
    )
  }

  render() {
    const me = this;
    const { props } = me;
    const barConfig = props.actionBarConfig;
    const { useListActionBar } = barConfig;
    return (
      <div
        className={classnames(`${props.tablePrefixCls}-actionbar`, {
          'fn-clear': true,
        })}
      >
        {
          !useListActionBar ? ActionBar.getActionItem(barConfig).map((item, index) => {
            return me.renderActionBtn(item, index)
          }): null
        }
        {!useListActionBar ? me.renderSearchBar() : null}
        {!useListActionBar ? me.renderColumnPicker() : null}
        {!useListActionBar ? me.renderLinkBar() : null}
        {useListActionBar ? me.renderListActionBar() : null}
      </div>
    );
  }
}

ActionBar.propTypes = {
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
};

ActionBar.defaultProps = {
  showSearch: false,
  onSearch: () => {},
};

export default ActionBar;
