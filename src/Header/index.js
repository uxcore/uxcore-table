/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('../Cell/CheckBox');
let assign = require('object-assign');
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

    componentWillUnmount () {
        $(document).off('click.uxcore-grid-header');
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
        let me = this,
        _style = {
            display: this.state.display
        };

        return (
            <div className="kuma-column-picker-container">
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
            </div>
        )
    }

    handleColumnOrder(type,column) {
        column.orderType=type;
        this.props.orderColumnCB.apply(null, [type, column]);
    }

   
    renderOrderIcon(column) {
        let me = this;
        if(column.ordered) {
            let desc = "sort-down", 
                asc="sort-up";
            if(this.props.activeColumn  && column.dataKey== this.props.activeColumn.dataKey) {
                if(column.orderType=="desc") {
                    desc="sort-down-active";
                }
                else {
                    asc ="sort-up-active";
                }
            }
            return (
                <span className="kuma-uxtable-h-sort">
                    <i className={asc} onClick={this.handleColumnOrder.bind(me,'asc', column)}/>
                    <i className={desc} onClick={this.handleColumnOrder.bind(me,'desc',column)}/>
                </span>
            )
        }
    }

    renderColumn(item, index, hasGroup) {

        if (item.hidden) return;
        let me = this;
        let _style = {
            width: item.width ? item.width : 100,
            textAlign: item.align ? item.align : "left"
        };
        let _v;

        if (hasGroup) {
            assign(_style, {
                height: 80,
                lineHeight: 80 + 'px'
            })
        }

        if (item.type == 'checkbox') {
            assign(_style, {
                paddingRight: 32,
                paddingLeft: 12,
                width: item.width ? item.width : 92
            });

            let checkBoxProps = {
                ref: 'checkbox',
                disable: ((me.props.mode !== Const.MODE.VIEW) ? item.disable : true),
                onchange: me.handleCheckBoxChange.bind(me)
            }

             _v = <CheckBox {...checkBoxProps} />
        } 
        else {
            _v = <span title={item.title}>{item.title}</span>;
        }

        return (
            <div key={index} className="kuma-uxtable-cell" style={_style}>
                {_v}
                {me.renderOrderIcon(item)}
            </div>
        )
    }

    renderItems(_columns, hasGroup) {
        let me = this;
        
        let columns = _columns.map((item, index) => {
            if ('group' in item) {
                return <div className="kuma-uxtable-header-column-group" key={index}>
                    <div className="kuma-uxtable-header-group-name">{item.group}</div>
                    {item.columns.map((column, i) => {
                        return me.renderColumn(column, i);
                    })}
                </div>
            }
            else {
                return me.renderColumn(item, index, hasGroup)
            }
        });
        return columns;
    }

    render() {

        let props = this.props, 
            me = this,
            _picker,
            _width = 0,
            headerWrapClassName,
            _columns;

        if (props.columnPicker && (props.fixedColumn == 'no' || props.fixedColumn == 'scroll')) {
             _picker = this.renderPicker();
        }

        if (props.fixedColumn == 'fixed') {
            _columns= props.columns.filter((item)=>{
              if (item.fixed && !item.hidden) {
                   if (!item.width) {
                      item.width = 100;
                   }
                   _width = item.width * 1 + _width;
                   return true
              }
            })
            assign(_headerStyle, {
                width: _width,
                minWidth: _width
            });
            headerWrapClassName = "kuma-uxtable-header-fixed";
        } 
        else if (props.fixedColumn == 'scroll') {
            _columns = props.columns.filter( (item) => {
                if(!item.fixed) {
                   return true
                }
                else if (!item.hidden) {
                   if (!item.width) {
                      item.width = 100;
                   }
                   _width = item.width*1 + _width;
                }
            });
            assign(_headerStyle, {
                width: props.width - _width - 3,
                minWidth:props.width - _width - 3
            });
            headerWrapClassName="kuma-uxtable-header-scroll";
        }
        else {
            _columns = props.columns;
            headerWrapClassName = "kuma-uxtable-header-no";
        }


        let hasGroup = false;
        for (let i = 0; i < _columns.length; i++) {
            if ('group' in _columns[i]) {
                hasGroup = true;
                break;
            }
        }

        let _headerStyle = { 
            height: props.headerHeight ? props.headerHeight : (hasGroup ? 80 : 40),
            lineHeight: (props.headerHeight ? props.headerHeight : 40) + "px"
        }


        return (
          <div className={headerWrapClassName} style={_headerStyle}>
            <div className={props.jsxprefixCls} >
                {me.renderItems(_columns, hasGroup)}
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
