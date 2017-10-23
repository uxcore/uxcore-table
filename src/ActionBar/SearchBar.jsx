/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTxt: '',
    };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.doSearch();
    }
  }

  doSearch() {
    this.props.onSearch(this.state.searchTxt);
  }

  handleChange(e) {
    this.setState({
      searchTxt: e.target.value,
    });
  }

  render() {
    const me = this;
    const { placeholder } = me.props;
    return (
      <div className={this.props.prefixCls}>
        <input
          type="text"
          className="kuma-input"
          placeholder={placeholder}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
          onChange={this.handleChange}
        />
        <i className="kuma-icon kuma-icon-search" onClick={this.doSearch} />
      </div>
    );
  }
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  prefixCls: PropTypes.string,
};

SearchBar.defaultProps = {
  prefixCls: 'kuma-uxtable-searchbar',
  onSearch: () => {},
};

export default SearchBar;
