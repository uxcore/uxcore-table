/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('../Cell/CheckBox');
let assign = require('object-assign');
let Const = require('uxcore-const');
let Tree = require('uxcore-tree');
let classnames = require('classnames');
let {TreeNode} = Tree;

let React = require('react');
let ReactDOM = require('react-dom');


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
           pickerDisplay:'none'
        };
    }

    componentDidMount() {
        let me = this;
        me.handleGlobalClick = this.handleGlobalClick.bind(this);
        $(document).on('click.uxcore-grid-header', me.handleGlobalClick);
    }

    componentWillUnmount () {
        let me = this;
        $(document).off('click.uxcore-grid-header', me.handleGlobalClick);
    }

    handleGlobalClick(e) {
        if (this.props.columnPicker) {
            this.hideColumnPicker(e);
        }
    }

    hideColumnPicker(e) {
        let target = e.target;

        if($(target).parents('.kuma-column-picker-container').length == 0 && !$(target).hasClass("kuma-column-picker-container")) {
            this.setState({
                pickerDisplay:'none'
            });
        } 
    }

    handleCheckBoxChange() {
        let v = this.refs.checkbox.getValue();
        this.props.checkAll.apply(null,[v]);
    }

    handleColumnPicker(e) {

        e.stopPropagation();
        if (this.state.pickerDisplay=='block') {
           this.setState({
              pickerDisplay:'none'
           });
        }
        else {
           this.setState({
              pickerDisplay:'block'
           });
        }
    }

    handlePickerCheck(info) {
        this.props.handleColumnPickerChange(info.checkedKeys)
    }

    getCheckedKeys() {
        let me = this;
        let {columns} = me.props;
        let _columns = [];
        let checkedKeys = [];
        columns.forEach((item, index) => {
            if ('group' in item) {
                _columns = _columns.concat(item.columns);
            }
            else {
                _columns.push(item);
            }
        });
        _columns.forEach((item, index) => {
            if (!item.hidden) {
                checkedKeys.push(item.dataKey);
            }
        })
        return checkedKeys;
    }

    renderColumnTree() {
        let me = this;
        let {columns} = me.props;
        let notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];

        let treeProps = {
            multiple: true,
            checkable: true,
            defaultCheckedKeys: me.getCheckedKeys(),
            onCheck: me.handlePickerCheck.bind(me)
        };

        return (
            <Tree {...treeProps}>
                {columns.map((item, index) => {
                    if (notRenderColumns.indexOf(item.dataKey) !== -1) return;
                    if ('group' in item) {
                        return <TreeNode key={item.group} title={item.group}>
                                    {item.columns.map((column, idx) => {
                                        return <TreeNode key={column.dataKey} title={column.title}></TreeNode>
                                    })}
                                </TreeNode>
                    }
                    else {
                        return <TreeNode key={item.dataKey} title={item.title}></TreeNode>
                    }
                }).filter((item, index) => {
                    return item != undefined
                })}
            </Tree>
        )
    }

    renderPicker() {
        let me = this;
        let _style = {
            display: this.state.pickerDisplay
        };

        return (
            <div className={classnames({
                "kuma-column-picker-container": true,
                "hasGroup": me.hasGroup
            })}>
                <i className="kuma-icon kuma-icon-target-list kuma-column-picker" onClick={this.handleColumnPicker.bind(this)}></i>
                <div className="kuma-uxtable-colmnpicker" style={_style} ref="columnpicker">
                    {me.renderColumnTree()}
                 </div>
            </div>
        )
    }

    handleColumnOrder(type, column) {
        column.orderType = type;
        this.props.orderColumnCB.apply(null, [type, column]);
    }

   
    renderOrderIcon(column) {
        let me = this;
        if (column.ordered) {
            let desc = "sort-down", 
                asc="sort-up";
            if (me.props.activeColumn  && column.dataKey == me.props.activeColumn.dataKey) {
                if (column.orderType == "desc") {
                    desc ="sort-down-active";
                }
                else {
                    asc ="sort-up-active";
                }
            }
            return (
                <span className="kuma-uxtable-h-sort">
                    <i className={asc} onClick={me.handleColumnOrder.bind(me,'asc', column)}/>
                    <i className={desc} onClick={me.handleColumnOrder.bind(me,'desc',column)}/>
                </span>
            )
        }
    }

    renderColumn(item, index, hasGroup, last) {

        if (item.hidden) return;
        let me = this;
        let noBorderColumn = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
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

        if (item.type == 'checkbox' || item.type == 'checkboxSelector') {
            assign(_style, {
                paddingRight: 18,
                paddingLeft: 12,
                width: item.width ? item.width : 92,
                borderRight: 'none'
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

        if (noBorderColumn.indexOf(item.dataKey) !== -1 || last) {
            assign(_style, {
               borderRight: 'none' 
            })
        }

        return (
            <div key={index} className={classnames({
              "kuma-uxtable-cell": true,
              "show-border": me.props.showHeaderBorder  
            })} style={_style}>
                {_v}
                {me.renderOrderIcon(item)}
            </div>
        )
    }

    renderItems(_columns) {
        let me = this;
        
        let columns = _columns.map((item, index) => {
            let last = (index == _columns.length - 1);
            if ('group' in item) {
                // First determine whether the group should be rendered, if all columns
                // is hidden, the column group should not be rendered.
                let shouldRenderGroup = item.columns.some((column, i) => {
                    return !column.hidden
                });
                if (shouldRenderGroup) {
                    return <div className="kuma-uxtable-header-column-group" key={index}>
                        <div className="kuma-uxtable-header-group-name">{item.group}</div>
                        {item.columns.map((column, i) => {
                            return me.renderColumn(column, i, false, last);
                        })}
                    </div>
                }
            }
            else {
                return me.renderColumn(item, index, me.hasGroup, last)
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
            _headerStyle = {},
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


        me.hasGroup = false;
        for (let i = 0; i < _columns.length; i++) {
            if ('group' in _columns[i]) {
                me.hasGroup = true;
                break;
            }
        }

        assign(_headerStyle, { 
            height: props.headerHeight ? props.headerHeight : (me.hasGroup ? 80 : 40),
            lineHeight: (props.headerHeight ? props.headerHeight : 40) + "px"
        });


        return (
            <div className={headerWrapClassName} style={_headerStyle}>
                <div className={props.jsxprefixCls} >
                    {me.renderItems(_columns)}
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

module.exports = Header;
