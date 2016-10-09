/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */


import classnames from 'classnames';
import Button from 'uxcore-button';
import React from 'react';
import SearchBar from './SearchBar';
import ColumnPicker from './ColumnPicker';
import LinkBar from './LinkBar';

class ActionBar extends React.Component {


  /**
   *  convert ActionBar config from hash to array
   */
  getActionItem(config) {
    let items = [];
    if (config instanceof Array) {
      items = config;
    } else if (typeof config === 'object') {
      Object.keys(config).forEach((item) => {
        items.push({
          title: item,
          callback: config[item],
        });
      });
    }
    return items;
  }

  handleSearch(value) {
    this.props.onSearch(value);
  }

  renderActionBtn(item, index) {
    const me = this;
    const itemProps = {
      className: `${me.props.prefixCls}-item`,
      onClick: item.callback || (() => {}),
      key: index,
    };
    if (!!item.render && typeof item.render === 'function') {
      return <div {...itemProps}>{item.render(item.title)}</div>;
    }
    return (
      <Button
        type="outline"
        size="medium"
        disabled={item.disabled || false}
        {...itemProps}
      >
        {item.title}
      </Button>
    );
  }

  renderLinkBar() {
    const me = this;
    const { linkBar } = me.props;
    return <LinkBar config={linkBar} />;
  }

  renderSearchBar() {
    if (this.props.showSearch) {
      const me = this;
      const searchBarProps = {
        onSearch: me.handleSearch.bind(me),
        key: 'searchbar',
        placeholder: me.props.searchBarPlaceholder,
      };
      return <SearchBar {...searchBarProps} />;
    }
    return null;
  }

  renderColumnPicker() {
    const me = this;
    const { columns, handleColumnPickerChange, checkboxColumnKey, width, locale } = me.props;
    return (
      <ColumnPicker
        columns={columns}
        locale={locale}
        dropdownMaxWidth={width}
        checkboxColumnKey={checkboxColumnKey}
        handleColumnPickerChange={handleColumnPickerChange}
      />
    );
  }

  render() {
    const me = this;
    const props = me.props;
    const barConfig = props.actionBarConfig;

    return (
      <div
        className={classnames({
          [props.prefixCls]: !!props.prefixCls,
          'fn-clear': true,
        })}
      >
        {me.getActionItem(barConfig).map((item, index) => me.renderActionBtn(item, index))}
        {me.renderSearchBar()}
        {me.renderColumnPicker()}
        {me.renderLinkBar()}
      </div>
    );
  }

}

ActionBar.propTypes = {
  showSearch: React.PropTypes.bool,
  onSearch: React.PropTypes.func,
  prefixCls: React.PropTypes.string,
};

ActionBar.defaultProps = {
  prefixCls: 'kuma-uxtable-actionbar',
};

module.exports = ActionBar;
