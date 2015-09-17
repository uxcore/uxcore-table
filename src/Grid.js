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

class Grid extends React.Component {

    constructor(props) {
        super(props);

        this.state= {
            data: this.props.jsxdata,
            columns: this.processColumn(),
            showMask: this.props.showMask,
            passedData:null,
            params:null,
        };
    }


    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        console.log("showMask:",this.props.showMask);
    }

    // notEmpty seems useless;
    // notEmpty(obj) {
    //     var hasOwnProperty = Object.prototype.hasOwnProperty;
    //     // null and undefined are "empty"
    //     if (obj == null) return true;

    //     // Assume if it has a length property with a non-zero value
    //     // that that property is correct.
    //     if (obj.length > 0)    return false;
    //     if (obj.length === 0)  return true;
    //     // Otherwise, does it have any properties of its own?
    //     // Note that this doesn't handle
    //     // toString and valueOf enumeration bugs in IE < 9
    //     for (var key in obj) {
    //         if (hasOwnProperty.call(obj, key)) return false;
    //     }
    //     return true;
    // }

    // pagination 
    // column order 
    // filter 

    getQueryObj() {

       let ctx = this, queryObj = {};
        //passedData right now use as subComp row data, if has passedData
        //that means subComp it is

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
            pageSize: ctx.props.pageSize,
            currentPage: ctx.props.currentPage
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

        return ctx.props.beforeFetch(queryObj);
    }
    // pagination 
    // column order 
    // filter 
    fetchData(obj) {

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
                data: ctx.getQueryObj(),
                success: function(result) {
                    let _data = result.content;
                    if(result.success) {
                        let updateObj= {
                          data: ctx.props.processData(_data),
                          showMask: false
                        };
                        ctx.setState(updateObj)
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
                console.log(data);
                ctx.setState({
                    data: ctx.props.processData(data)
                });
            }
        }
        else {
            ctx.setState({
                "data": {
                    datas: []
                },
                "currentPage": 1,
                "totalCount": 0
            })
        }

    }
    

    processColumn() {

        let props=this.props, columns= props.jsxcolumns,hasCheckedColumn;

        columns=columns.map(function(item,index){
            if(item.hidden==undefined) {
                item.hidden=false;
            }
            if(item.dataKey =='jsxchecked') {
                hasCheckedColumn=true;
            }
            return item;
        });

        //if has rowSelection, also attach checked column
        //{ dataKey: 'jsxchecked', width: 30,type:'checkbox'}
        if(props.rowSelection && !hasCheckedColumn) {
           if(props.subComp) {
                columns= [{ dataKey: 'jsxchecked', width: 60,type:'checkbox', align:'right'}].concat(columns)
           }else {
                columns= [{ dataKey: 'jsxchecked', width: 30,type:'checkbox'}].concat(columns)
           }
        }

        return columns;
    }

    //just call once when init
    // processData() {

    //     if(!this.props.jsxdata) {
    //         this.fetchData();
    //     }

    // }

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

    onPageChange (index) {

      this.props.currentPage=index;
      this.fetchData();

    }

    renderPager() {
        if(this.props.showPager && this.state.data) {
            return (<div className="kuma-grid-pagination"><Pagination className="mini" total={this.state.data.totalCount} onChange={this.onPageChange.bind(this)} current={this.props.currentPage} pageSize={this.props.pageSize} /></div>)
        }
    }

    handleOrderColumnCB(type, column) {

       this.props.activeColumn=column;
       this.fetchData();

    }

    actionBarCB(type,txt) {
        if(type == 'SEARCH') {
           // TODO: Don't set props 
           this.props.searchTxt=txt;
           this.fetchData();
        }else {
            let _actionCofig= this.props.actionBar;
            _actionCofig[type]?_actionCofig[type].apply():"";
        }
       
    }

    getData() {
       return this.state.data;
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

       let _data=$.extend(true,{},this.state.data),_newArr;
       if(Object.prototype.toString.call(objAux)!=="[object Array]") {
          objAux=[objAux];
       }

        objAux.map(function(item) {
            let index= _data.datas.indexOf(item);
            if(index!=-1) {
                _data.datas.splice(index,1);
            }
        })

        this.setState({
          data: _data
        });

    }

    render() {

        console.log("++++grid render+++",this.props.showMask);
        let props= this.props,
            _style= {
                width: props.width,
                height: props.height
            },
            renderBodyProps={
                columns: this.state.columns,
                data: this.state.data?this.state.data.datas:[],
                width: props.width=="100%"?props.width:(props.width-props.headerHeight),
                height: props.height=="100%"?props.height:(props.height-props.headerHeight-props.actionBarHeight-(props.showPager?50:0)),
                onModifyRow: props.onModifyRow?props.onModifyRow: function(){},
                rowSelection: props.rowSelection,
                subComp: props.subComp,
                mask: this.state.showMask,
                rowHeight: this.props.rowHeight,
                key:'grid-body'
            },
            renderHeaderProps={
                columns:  this.state.columns,
                activeColumn: this.props.activeColumn,
                checkAll: this.selectAll.bind(this),
                columnPicker: props.showColumnPicker,
                //fixed: props.fixed,
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

        if(props.actionBar) {
            let renderActionProps={
                actionBarConfig: this.props.actionBar,
                actionBarCB: this.actionBarCB.bind(this),
                key:'grid-actionbar'
            };
            actionBar=<ActionBar {...renderActionProps}/>
        }

        return (<div className={props.jsxprefixCls} style={_style}>
            {actionBar}
            {gridHeader}
            <Tbody  {...renderBodyProps}/>
            {this.renderPager()}
        </div>);

    }
    

};

Grid.defaultProps = {
    showHeader:true,
    width:"100%",
    height:"100%",
    headerHeight:50,
    actionBarHeight:40,
    showPager:true,
    showColumnPicker: true,
    showMask: false,
    pageSize:10,
    rowHeight: 76,
    fetchParams:'',
    currentPage:1,
    //like subComp, we have fetchUrl, but also need query key like id to 
    //query data
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
