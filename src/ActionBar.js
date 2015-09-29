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

    doAction(type) {
       this.props.actionBarCB(type);
    }

    renderActionBtn(type) {

        let _props = this.props,
        _config = _props.actionBarConfig;

        return <Button type="secondary" size="medium" onClick={this.doAction.bind(this,type)}>{type}</Button>
    }

    renderSearchBar() {

       let renderSearchBarProps = {
            actionBarCB: this.props.actionBarCB,
            key:'searchbar'
        };
        if(this.props.showSearch) {
            return <SearchBar key='searchbar' {...renderSearchBarProps}/>;
        }

    }

    /**
    * @param {JSON}
    */
    getActionItem(config) {
       let items=[];
       for(let i  in config) {
          if(config.hasOwnProperty(i)) {
             items.push(i);
          }
       }
       return items;
    }

    render() {
        let me=this,_props=this.props, _barConfig = _props.actionBarConfig;

        return (<div className={classnames({
          [_props.jsxprefixCls]: _props.jsxprefixCls,
          "fn-clear": true
        })}>
            {

              me.getActionItem(_barConfig).map(function(item){
                  return me.renderActionBtn(item)
              })
            }

            {
                me.renderSearchBar()
            }
        </div>);
    }

};

ActionBar.propTypes= {
};

ActionBar.defaultProps = {
    jsxprefixCls: "kuma-grid-actionbar"
};

export default ActionBar;
