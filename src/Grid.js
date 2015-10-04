/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

let Header = require("./Header");
let Tbody  = require("./Tbody");
let ActionBar = require("./ActionBar");
let Pagination  = require("uxcore-pagination");
let assign = require('object-assign');
let classnames = require("classnames");
let uid = 0;
class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            data: this.props.jsxdata,
            columns: this.processColumn(),
            showMask: this.props.showMask,
            passedData:null,
            params:null,
            pageSize: props.pageSize,
            currentPage: props.currentPage
        };
    }


    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        let me = this;
        me.el = React.findDOMNode(me);
        // console.log("showMask:",this.props.showMask);
        $(me.el).find(".kuma-grid-body-wrapper").on("scroll", function(e) {
            let scrollLeft = this.scrollLeft;
            $(me.el).find(".kuma-grid-header-wrapper")[0].scrollLeft = scrollLeft;
        })
    }

    componentWillUnmount() {
        let me = this;
        $(me.el).find(".kuma-grid-body-wrapper").off("scroll");
    }



    /*
     * get Query Object by combining data from searchBar, column order, pagination
     * and fetchParams.
     * @param from {string} used in props.beforeFetch
     */

    getQueryObj(from) {

        let ctx = this, queryObj = {};
        if (ctx.props.passedData) {

            let queryKeys = ctx.props.queryKeys;

            if (!queryKeys) {
                queryObj = ctx.props.passedData;
            }

            else {
                queryKeys.forEach(function(key) {
                    if(ctx.props.passedData[key] !== undefined) {
                        queryObj[key]= ctx.props.passedData[key];
                    }
                })
            }
        }

        // pagination
        queryObj = assign({}, queryObj, {
            pageSize: ctx.state.pageSize,
            currentPage: ctx.state.currentPage
        });

        // column order
        let activeColumn = this.props.activeColumn;
        if(!!activeColumn) {
            queryObj = assign({}, queryObj, {
                orderColumn: activeColumn.dataKey,
                orderType: activeColumn.orderType
            })
        }

        // search query
        let searchTxt = ctx.props.searchTxt
        if (!!searchTxt) {
            queryObj = assign({}, queryObj, {
               searchTxt: searchTxt
            })
        }

        // fetchParams has the top priority 
        if(!!ctx.props.fetchParams) {
            queryObj = assign({}, queryObj, ctx.props.fetchParams);
        }

        return ctx.props.beforeFetch(queryObj, from);
    }
    
    /*
     * fetch Data via Ajax
     * @param from {string} tell fetchData where it is invoked, the param will be 
     * passed to props.beforeFetch in order to help the user.
     */

    fetchData(from) {

        let ctx = this;
        
        // fetchUrl has the top priority.
        if (!!ctx.props.fetchUrl) {
            if (!ctx.state.showMask) {
                ctx.setState({
                    showMask: true
                });
            }
            let ajaxOptions = {
                url: ctx.props.fetchUrl,
                data: ctx.getQueryObj(from),
                dataType: "json",
                success: function(result) {
                    let _data = result.content;
                    if(result.success) {
                        let updateObj= {
                          data: ctx.props.processData(_data),
                          showMask: false
                        };
                        ctx.setState(updateObj)
                    }
                    else {
                        console.log("##ERROR##");
                        console.log(result);
                    }
                }
            };

            if (/\.jsonp/.test(ctx.props.fetchUrl)) {
                ajaxOptions.dataType = "jsonp"
            }
            
            $.ajax(ajaxOptions);
        }

        else if (!!ctx.props.passedData) {

            if (!ctx.props.queryKeys) {
                ctx.setState({
                    data: ctx.props.processData(ctx.props.passedData)
                });
            }
            else {
                let data = {};
                ctx.props.queryKeys.forEach((key, index) => {
                    if (ctx.props.passedData[key] !== undefined) {
                        data[key] = ctx.props.passedData[key];
                    }
                });
                ctx.setState({
                    data: ctx.props.processData(data)
                });
            }
        }
        else if (!!this.props.jsxdata) {
          ctx.setState({
             data: this.props.jsxdata
          });
        }
        else {
          //default will create one row
          ctx.setState({
              "data": {
                  datas: [{
                    jsxid:0
                  }],
                  "currentPage": 1,
                  "totalCount": 0
              }
          })
        }

    }
    

    processColumn() {

        let props = this.props, 
            columns = props.jsxcolumns,
            hasCheckedColumn;

        // filter the column which has a datakey 'jsxchecked'

        columns = columns.filter((item) => {
            return item.dataKey !== 'jsxchecked' && item.datakey !== 'jsxtreeIcon';
        });

        // if hidden is not set, then it's false

        columns = columns.map((item,index) => {
            item.hidden = item.hidden || false;
            return item;
        });

        if (!!props.rowSelection) {
            columns = [{ dataKey: 'jsxchecked', width: 46, type:'checkbox', align:'right'}].concat(columns)
        }

        // no rowSelection but parentHasCheckbox, render placeholder
        else if (!!props.parentHasCheckbox) {
            columns = [{dataKey: 'jsxwhite', width: 46, type: 'empty'}].concat(columns);
        }


        if (!!props.subComp) {
            columns = [{dataKey: 'jsxtreeIcon', width: 34, type: 'treeIcon'}].concat(columns);
        }
        // no subComp but has passedData, means sub mode, parent should has tree icon,
        // render tree icon placeholder
        else if (!!props.passedData) {
            columns = [{dataKey: 'jsxwhite', width: 34,type: 'empty'}].concat(columns);
        }

        return columns;
    }

    //handle column picker
    handleCP(index) {
        let _columns= [].concat(this.state.columns),hidden=_columns[index].hidden;
        if(hidden==undefined) hidden=true;
        _columns[index].hidden= !!hidden ? false: true;
        this.setState({
            columns: _columns
        })
    }

    selectAll(checked) {

        let _data=$.extend(true,{},this.state.data);
        _data.datas.map(function(item,index){
            item.jsxchecked=checked;
            item.country=item.country;
            return item;
        });

        let rowSelection=this.props.rowSelection

        if(rowSelection && rowSelection.onSelectAll) {
            rowSelection.onSelectAll.apply(null,[checked,_data])
        }
        this.setState({
            data:_data
        })
    }

    onPageChange (current) {

      let me = this;
      me.setState({
        currentPage: current
      }, () => {
        me.fetchData("pagination")
      })

    }

    handleShowSizeChange(current, pageSize) {
        let me = this;
        me.setState({
            currentPage: current,
            pageSize: pageSize
        }, () => {
            me.fetchData("pagination");
        });
    }

    renderPager() {
        if(this.props.showPager && this.state.data && this.state.data.totalCount) {
            return (
                <div className="kuma-grid-pagination">
                    <Pagination className="mini" 
                                showSizeChanger={true}
                                total={this.state.data.totalCount} 
                                onShowSizeChange={this.handleShowSizeChange.bind(this)}
                                onChange={this.onPageChange.bind(this)} 
                                current={this.state.currentPage} 
                                pageSize={this.state.pageSize} />
                </div>
            );
        }
    }

    handleOrderColumnCB(type, column) {

       this.props.activeColumn=column;
       this.fetchData("order");

    }

    actionBarCB(type,txt) {
        if(type == 'SEARCH') {
           // TODO: Don't set props 
           this.props.searchTxt=txt;
           this.fetchData("search");
        }else {
            let _actionCofig = this.props.actionBar;
            _actionCofig[type] ? _actionCofig[type].apply(null,[type]) : "";
        }
       
    }

    getData() {
       return this.state.data;
    }

    addRow() {
        this.insertData({
          jsxid: ++uid
        });
    }

    delRow(rowData) {
        this.removeData(rowData);
    }

    // some time, UI new some data, but not sync with db, 
    // need cache on the client, then use save action, get
    // all grid data to sync with db
    //[{name:'',email:''}]

    insertData(objAux) {
       let _data=$.extend(true,{},this.state.data);
       if(Object.prototype.toString.call(objAux)!=="[object Array]") {
          objAux=[objAux];
       }
       _data.datas= objAux.concat(_data.datas);

       this.setState({
          data: _data
       });
    }

    removeData(objAux) {
      
       //at least one record
       if(this.state.data.datas.length==1){
          return ;
       }
        let _data=$.extend(true,{},this.state.data),_newArr;

       if(Object.prototype.toString.call(objAux)!=="[object Array]") {
          objAux=[objAux];
       }

        objAux.map(function(item) {
            _data.datas.forEach(function(element, index, array) {
                if(element.jsxid==item.jsxid) {
                   _data.datas.splice(index,1);
                }
            })
        })

        this.setState({
          data: _data
        });

    }

    render() {

        let props= this.props,
            // if grid is sub mode, people always want to align the parent
            // and the sub grid, so width should not be cared.
            _style= {
                width: !!props.passedData ? "auto" : props.width,
                height: props.height
            },
            actionBarHeight=props.actionBar?props.actionBarHeight:0,
            pagerHeight= (this.props.showPager && this.state.data && this.state.data.totalCount)? 50:0,
            bodyHeight = props.height == "100%" ? props.height : (props.height - props.headerHeight - actionBarHeight - pagerHeight),
            renderBodyProps={
                columns: this.state.columns,
                data: this.state.data?this.state.data.datas:[],
                onModifyRow: props.onModifyRow?props.onModifyRow: function(){},
                rowSelection: props.rowSelection,
                subComp: props.subComp,
                actions:{
                   'addRow': this.addRow.bind(this),
                   'delRow': this.delRow.bind(this)
                },
                mask: this.state.showMask,
                rowHeight: this.props.rowHeight,
                mode: this.props.mode,
                key:'grid-body'
            },
            renderHeaderProps={
                columns:  this.state.columns,
                activeColumn: this.props.activeColumn,
                checkAll: this.selectAll.bind(this),
                columnPicker: props.showColumnPicker,
                handleCP: this.handleCP.bind(this),
                headerHeight: props.headerHeight,
                width: props.width,
                orderColumnCB: this.handleOrderColumnCB.bind(this),
                key:'grid-header'

            };

        let gridHeader, actionBar;
        if(props.showHeader) {
            gridHeader=<Header {...renderHeaderProps} />
        }

        if(props.actionBar || props.showSearch) {
            let renderActionProps={
                actionBarConfig: this.props.actionBar,
                showSearch: this.props.showSearch,
                actionBarCB: this.actionBarCB.bind(this),
                key:'grid-actionbar'
            };
            actionBar=<ActionBar {...renderActionProps}/>
        }

        return (
            <div className={classnames({
                [props.jsxprefixCls]: true,
                "kuma-subgrid-mode": !!props.passedData
            })} style={_style}>
                {actionBar}
                <div className="kuma-grid-content" style={{
                    width: !!props.passedData ? "auto" : props.width
                }}>
                    <div className="kuma-grid-header-wrapper">
                        {gridHeader}
                    </div>
                    <div className="kuma-grid-body-wrapper" style={{
                        height: bodyHeight
                    }}>
                        <Tbody  {...renderBodyProps}/>
                    </div>
                </div>
                {this.renderPager()}
            </div>);

    }
    

};

Grid.defaultProps = {
    jsxprefixCls: "kuma-grid",
    showHeader:true,
    width:1000,
    height:"100%",
    mode: "EDIT",
    headerHeight:40,
    actionBarHeight:40,
    showPager:true,
    showColumnPicker: true,
    showMask: false,
    showSearch:false,
    pageSize:10,
    rowHeight: 76,
    fetchParams:'',
    currentPage:1,
    queryKeys:[],
    searchTxt:'',
    processData: (data) => {return data},
    beforeFetch: (obj) => {return obj}
}

// http://facebook.github.io/react/docs/reusable-components.html
Grid.propTypes = {
    processData: React.PropTypes.func,
    beforeFetch: React.PropTypes.func
}

Grid.displayName = Grid;

module.exports = Grid;
