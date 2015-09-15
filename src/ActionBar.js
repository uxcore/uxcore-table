/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import SearchBar from "./SearchBar"


class ActionBar extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }

    prepareStyle() {

    }

    doAction(type) {
       this.props.actionBarCB(type);
    }

    //TODO reduce code
    renderActionBtn(type) {

       let  _props=this.props,
       _config=_props.actionBarConfig,
       renderSearchBarProps= {
            actionBarCB: this.props.actionBarCB,
            key:'searchbar'
        };

       if( type =='new' && !!_config[type] ) {
          return <a key={type} href="javascript:;" className="kuma-button kuma-button-swhite" onClick={this.doAction.bind(this,'new')}>新增</a>
       }
       if( type =='import' && !!_config[type] ) {
          return <a key={type} href="javascript:;" className="kuma-button kuma-button-swhite" onClick={this.doAction.bind(this,'import')}>导入</a>
       }
        if(type =='export' && !!_config[type] ) {
          return  <a key={type} href="javascript:;" className="kuma-button kuma-button-swhite" onClick={this.doAction.bind(this,'export')}>导出</a>
       }

        if(type =='search' && !!_config[type] ) {
          return   <SearchBar key={type} {...renderSearchBarProps}/>

       }

    }
    // how to iterator json key use util method
    render() {
        let me=this,_props=this.props,_className=_props.jsxprefixCls;

        return (<div className={_className}>
            {  
              ['new','import','export','search'].map(function(item){
                  return me.renderActionBtn(item)
              })
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
