/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTxt: '',
    };
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
          onKeyDown={this.onKeyDown.bind(this)}
          onChange={this.handleChange.bind(this)}
        />
        <i className="kuma-icon kuma-icon-search" onClick={this.doSearch.bind(this)} />
      </div>
    );
  }
}

SearchBar.propTypes = {
  onSearch: React.PropTypes.func,
  prefixCls: React.PropTypes.string,
};

SearchBar.defaultProps = {
  prefixCls: 'kuma-uxtable-searchbar',
  onSearch: () => {},
};

module.exports = SearchBar;
