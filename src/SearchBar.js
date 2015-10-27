/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

let reactMixin = require('react-mixin');

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
          searchTxt:""
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }

    prepareStyle() {

    }

    doSearch() {
      this.props.actionBarCB("SEARCH",this.state.searchTxt)
    }

    onKeyDown(e) {
      if(e.keyCode==13) {
        this.doSearch();
      }
    }

    render() {

        let _className=this.props.jsxprefixCls;
        return (<div className={_className}>
            <input type="text" className="kuma-input" placeholder="搜索表格内容" valueLink={this.linkState('searchTxt')} onKeyDown={this.onKeyDown.bind(this)} />
            <i className="kuma-icon kuma-icon-search" onClick={this.doSearch.bind(this)}></i>
        </div>);

    }

};

SearchBar.propTypes= {

};

SearchBar.defaultProps = {
    jsxprefixCls: "kuma-uxtable-searchbar"
};

reactMixin.onClass(SearchBar,React.addons.LinkedStateMixin);

export default SearchBar;
