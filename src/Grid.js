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
        };
    }


    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        // console.log("showMask:",this.props.showMask);
        $(".kuma-grid-body-wrapper").on("scroll", function(e) {
            let scrollLeft = this.scrollLeft;
            $(".kuma-grid-header-wrapper")[0].scrollLeft = scrollLeft;
        })
    }

    componentWillUnmount() {
        $(".kuma-grid-body-wrapper").off("scroll");
    }



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
                ctx.setState({
                    data: ctx.props.processData(data)
                });
            }
        }
        else if(!!this.props.jsxdata) {
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

        // calculate the total width of columns, if less than the form width, add an empty column
        let totalWidth = 0;
        columns.forEach((item, index) => {
            if (!item.hidden) {
                totalWidth += item.width || 100;
            }
        });

        let deltaWidth = props.width - totalWidth;

        if (deltaWidth > 0) {
            columns = columns.concat([{dataKey: 'jsxwhite', width: (deltaWidth - 2),type: 'empty'}])
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

    onPageChange (index) {

      this.props.currentPage=index;
      this.fetchData();

    }

    renderPager() {
        if(this.props.showPager && this.state.data && this.state.data.totalCount) {
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
            _style= {
                width: props.width,
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

        if(props.actionBar) {
            let renderActionProps={
                actionBarConfig: this.props.actionBar,
                actionBarCB: this.actionBarCB.bind(this),
                key:'grid-actionbar'
            };
            actionBar=<ActionBar {...renderActionProps}/>
        }

        return (
            <div className={props.jsxprefixCls} style={_style}>
                {actionBar}
                <div className="kuma-grid-content" style={{
                    width: props.width
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
    headerHeight:40,
    actionBarHeight:40,
    showPager:true,
    showColumnPicker: true,
    showMask: false,
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
