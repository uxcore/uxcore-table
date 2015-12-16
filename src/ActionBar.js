/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

let SearchBar = require("./SearchBar");
let classnames = require("classnames");
let Button = require("uxcore-button");


class ActionBar extends React.Component {

    constructor(props) {
        super(props);
    }

    handleSearch(value) {
        this.props.onSearch(value);
    }

    renderActionBtn(item, index) {
        let me = this;
        let itemProps = {
            className: me.props.jsxprefixCls + "-item",
            onClick: item.callback || function() {},
            key: index
        }
        if (!!item.render && typeof item.render == "function") {
            return <div {...itemProps}>{item.render(item.title)}</div>
        }
        else {
            return <Button type="secondary" size="medium" {...itemProps}>{item.title}</Button>
        }
    }

    renderSearchBar() {
        if (this.props.showSearch) {
            let me = this;
            let searchBarProps = {
                onSearch: me.handleSearch.bind(me),
                key:'searchbar'
            };
            return <SearchBar {...searchBarProps}/>;
        }
    }

    /**
     *  convert ActionBar config from hash to array
     */
    getActionItem(config) {
        let items = [];
        if (config instanceof Array) {
            items = config;
        }
        else if (typeof config == "object") {
            for (let item in config) {
                if(config.hasOwnProperty(item)) {
                    items.push({
                        title: item,
                        callback: config[item]
                    });
                }
            }
            
        }
        return items;
    }

    render() {
        let me = this,
            _props = this.props, 
            _barConfig = _props.actionBarConfig;

        return (
            <div className={classnames({
                [_props.jsxprefixCls]: _props.jsxprefixCls,
                "fn-clear": true
            })}>
                {me.getActionItem(_barConfig).map((item, index) => {
                    return me.renderActionBtn(item, index)
                })}
                {me.renderSearchBar()}
            </div>
        );
    }

};

ActionBar.propTypes= {
};

ActionBar.defaultProps = {
    jsxprefixCls: "kuma-uxtable-actionbar"
};

module.exports = ActionBar;
