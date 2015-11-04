/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('../Cell/CheckBox');
let Assign = require('object-assign');
let Const = require('uxcore-const');


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
           display:'none'
        };
    }

    componentDidMount() {
        $(document).on('click.uxcore-grid-header',this.handleGlobalClick.bind(this));
    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
        $(document).off('click.uxcore-grid-header');
    }

    prepareStyle() {

    }

    handleGlobalClick(e) {
        if(this.props.columnPicker) {
            this.hideColumnPick(e);
        }
    }
    handleCheckBoxChange() {
        let v=this.refs.checkbox.getValue();
        this.props.checkAll.apply(null,[v]);
    }

    handleColumnPicker(e) {

        e.stopPropagation();
        if(this.state.display=='block') {
           this.setState({
              display:'none'
           });
        }else {
           this.setState({
              display:'block'
           });
        }
    }

    hideColumnPick(e) {
       if(!$(e.target).hasClass('kuma-column-picker')) {
          this.setState({
              display:'none'
          });
       } 
    }

    handleColumns(index) {
        this.props.handleCP.apply(null,[index]);
    }

    //prepare the column picker html fragement

    renderPicker() {
        let me= this,
        _style= {
            display: this.state.display
        };

        return (<div className="kuma-column-picker-container">
            <i className="kuma-icon kuma-icon-target-list kuma-column-picker" onClick={this.handleColumnPicker.bind(this)}></i>
            <ul className="kuma-uxtable-colmnpicker" style={_style} ref="columnpicker">
                {
                    this.props.columns.map(function(item,index) {
                        if (item.dataKey=='jsxchecked' || item.dataKey == "jsxtreeIcon" || item.dataKey == "jsxwhite") return;
                        if (item.hidden) {
                            return <li ref="" key={index} onClick={me.handleColumns.bind(me,index)}>{item.title}</li>
                        }
                        else {
                            return <li ref="" key={index} onClick={me.handleColumns.bind(me,index)}><i className="kuma-icon kuma-icon-choose"></i>{item.title}</li>
                        }
                    })
                }
             </ul>
        </div>)
    }

    handleColumnOrder(type,column) {

      column.orderType=type;
      this.props.orderColumnCB.apply(null, [type, column]);

    }

   
    renderOrderIcon(column) {
      let ctx= this;
      if(column.ordered) {
          let desc="sort-down", asc="sort-up";
          if(this.props.activeColumn  && column.dataKey== this.props.activeColumn.dataKey) {
             if(column.orderType=="desc") {
                desc="sort-down-active";
             }else {
                asc ="sort-up-active";
             }
          }
          return (<span className="kuma-uxtable-h-sort">
            <i className={asc} onClick={this.handleColumnOrder.bind(ctx,'asc', column)}/>
            <i className={desc} onClick={this.handleColumnOrder.bind(ctx,'desc',column)}/>
            </span>)
      }
    }

    render() {

        let props= this.props, 
            ctx = this,
            _picker,
            _width=0,
            headerWrapClassName,
            _columns;

        if (props.columnPicker && (props.fixedColumn=='no')) {
             _picker = this.renderPicker();
        }

        let _style={ 
            height: props.headerHeight ? props.headerHeight : 40,
            lineHeight: (props.headerHeight ? props.headerHeight : 40) + "px"
        }



        if(props.fixedColumn=='fixed') {
           _columns= props.columns.filter((item)=>{
              if(item.fixed) {
                   if(!item.width) {
                      item.width=100;
                   }
                   _width=item.width*1+_width;
                   return true
              }
           })
           _style={
             width:_width,
             minWidth:_width
           }
          headerWrapClassName="kuma-uxtable-header-fixed";

        }else if(props.fixedColumn=='scroll') {
           _columns= props.columns.filter( (item) =>{
                if(!item.fixed) {
                   return true
                }else {
                   if(!item.width) {
                      item.width=100;
                   }
                   _width=item.width*1+_width;
                }
            })
            _style={
              width: props.width-_width-3,
              minWidth:props.width-_width-3
            }
            headerWrapClassName="kuma-uxtable-header-scroll";
        }else {
            _columns= props.columns;
            headerWrapClassName="kuma-uxtable-header-no";
        }

        return (
          <div className={headerWrapClassName} style={_style}>

            <div className={props.jsxprefixCls} >

                {_columns.map(function (item, index) {

                    if (item.hidden) return;

                    let _style={
                        width: item.width ? item.width : 100,
                        textAlign: item.align ? item.align : "left"
                    },_v;

                    if (item.type=='checkbox') {
                        Assign(_style, {
                            paddingRight: 32,
                            paddingLeft: 12,
                            width: item.width ? item.width : 92
                        });
                         _v = <CheckBox ref="checkbox" disable={item.disable} onchange={ctx.handleCheckBoxChange.bind(ctx)}/>

                        if(ctx.props.mode !== Const.MODE.VIEW) {
                            _v = <CheckBox ref="checkbox" disable={item.disable} onchange={ctx.handleCheckBoxChange.bind(ctx)}/>
                        }else {
                            _v = <CheckBox ref="checkbox" disable={true} onchange={ctx.handleCheckBoxChange.bind(ctx)}/>
                        }

                    } 
                    else {
                        _v = item.title;
                    }

                    return <div key={index} className="kuma-uxtable-cell" style={_style}>
                                <span>{_v}</span>
                                {ctx.renderOrderIcon(item)}
                           </div>
                })}
                {_picker}
            </div>
          </div>
        );
    }

};

Header.propTypes= {
};

Header.defaultProps = {
    jsxprefixCls: "kuma-uxtable-header"
};

export default Header;
