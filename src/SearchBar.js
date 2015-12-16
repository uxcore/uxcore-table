/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTxt: ""
        };
    }

    doSearch() {
        this.props.onSearch(this.state.searchTxt);
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            this.doSearch();
        }
    }

    handleChange(e) {
        this.setState({
            searchTxt: e.target.value
        })
    }

    render() {

        return (
            <div className={this.props.jsxprefixCls}>
                <input type="text" className="kuma-input" placeholder="搜索表格内容" value={this.state.value} onKeyDown={this.onKeyDown.bind(this)} onChange={this.handleChange.bind(this)}/>
                <i className="kuma-icon kuma-icon-search" onClick={this.doSearch.bind(this)}></i>
            </div>
        );

    }

};

SearchBar.propTypes= {};

SearchBar.defaultProps = {
    jsxprefixCls: "kuma-uxtable-searchbar",
    onSearch: () => {}
};

module.exports = SearchBar;
