/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('../Cell/CheckBox');
let assign = require('object-assign');
let Const = require('uxcore-const');
let Menu = require('uxcore-menu');
let Dropdown = require('uxcore-dropdown');
let Tooltip = require('uxcore-tooltip');
let classnames = require('classnames');
let React = require('react');
let ReactDOM = require('react-dom');


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pickerDisplay: false
        };
    }

    handleCheckBoxChange() {
        let v = this.refs.checkbox.getValue();
        this.props.selectAll.apply(null, [v]);
    }

    handlePickerSelect(info) {
        this.props.handleColumnPickerChange(info.selectedKeys);
    }

    handlePickerDeselect(info) {
        this.props.handleColumnPickerChange(info.selectedKeys);
    }

    handlePickerVisibleChange(visible) {
        this.setState({
          pickerDisplay: visible
        })
    }

    handleColumnOrder(column) {
        let me = this;
        let {orderColumnCB, activeColumn, orderType} = me.props;
        let type = 'desc';
        let typeMap = {
            desc: 'asc',
            asc: 'none',
            none: 'desc'
        };
        if (activeColumn && column.dataKey == activeColumn.dataKey && orderType) {
            type = typeMap[orderType];
        }
        orderColumnCB && orderColumnCB(type, column);
    }

    getSelectedKeys() {
        let me = this;
        let {columns} = me.props;
        let _columns = [];
        let selectedKeys = [];
        columns.forEach((item, index) => {
            if ('group' in item) {
                _columns = _columns.concat(item.columns);
            } else {
                _columns.push(item);
            }
        });
        _columns.forEach((item, index) => {
            if (!item.hidden) {
                selectedKeys.push(item.dataKey);
            }
        })
        return selectedKeys;
    }

    renderColumnSelect() {
        let me = this;
        let {columns} = me.props;
        let notRenderColumns = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
        notRenderColumns.push(me.props.checkboxColumnKey);
        let options = [];
        columns.forEach((item, index) => {
            if (notRenderColumns.indexOf(item.dataKey) == -1) {
                options.push(<Menu.Item key={item.dataKey}>
                               {item.title}
                             </Menu.Item>)
            }
        });
        return <Menu multiple={true} selectedKeys={me.getSelectedKeys()} onSelect={me.handlePickerSelect.bind(me)} onDeselect={me.handlePickerDeselect.bind(me)}>
                 {options}
               </Menu>
    }

    renderPicker() {
        let me = this;
        let {pickerDisplay} = me.state;

        let dropdownAlign = {
            bottomRight: {
                points: ['br', 'tr'],
                overflow: {
                    adjustX: 1,
                    adjustY: 1,
                },
                offset: [0, -4],
                targetOffset: [0, 0],
            }
        };

        return (
            <div className={classnames({
                    "kuma-column-picker-container": true,
                    "hasGroup": me.hasGroup
                })}>
              <Dropdown trigger={['click']} overlay={me.renderColumnSelect()} visible={pickerDisplay} overlayClassName="kuma-uxtable-column-picker-dropdown"
                align={dropdownAlign} onVisibleChange={me.handlePickerVisibleChange.bind(me)}>
                <i className="kuma-icon kuma-icon-target-list kuma-column-picker"></i>
              </Dropdown>
            </div>
        )
    }

    renderOrderIcon(column) {
        let me = this;
        let {orderType, activeColumn} = me.props;
        if (column.ordered) {
            let desc = "iconfontdown",
                asc = "iconfontup";
            return (
                <span className="kuma-uxtable-h-sort" onClick={me.handleColumnOrder.bind(me, column)}>
                    <i className={classnames({
                                      [`kuma-icon kuma-icon-${asc}`]: true,
                                      'active': activeColumn && activeColumn.dataKey === column.dataKey && orderType == 'asc'
                                  })} />
                    <i className={classnames({
                                      [`kuma-icon kuma-icon-${desc}`]: true,
                                      'active': activeColumn && activeColumn.dataKey === column.dataKey && orderType == 'desc'
                                  })}/>
                </span>
            )
        }
    }

    renderMessageIcon(column) {
        if (!column.message) return;
        return <Tooltip overlay={<div className="kuma-uxtable-column-message">
                    {column.message}
                  </div>}>
                 <i className="kuma-icon kuma-icon-information"></i>
               </Tooltip>
    }

    renderColumn(item, index, hasGroup, last) {
        const me = this;
        const {data, renderModel} = me.props;
        const rowSelectorInTreeMode = (['checkboxSelector', 'radioSelector'].indexOf(item.type) !== -1) && (renderModel == 'tree');
        if (item.hidden || rowSelectorInTreeMode) {
            me.firstIndex = index + 1;
            return ;
        }
        const noBorderColumn = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
        let _style = {
            width: item.width ? item.width : 100,
            textAlign: item.align ? item.align : "left"
        };
        let _v;

        if (hasGroup) {
            assign(_style, {
                height: 100,
                lineHeight: 100 + 'px'
            })
        }

        if (item.type == 'checkbox' || item.type == 'checkboxSelector') {
            assign(_style, {
                paddingRight: 4,
                paddingLeft: 12,
                width: item.width ? item.width : 92,
                // borderRight: 'none'
            });

            let checkBoxProps = {
                ref: 'checkbox',
                checked: me.props.isSelectAll,
                disable: ((me.props.mode !== Const.MODE.VIEW) ? item.disable : true),
                onChange: me.handleCheckBoxChange.bind(me)
            }

            _v = <CheckBox {...checkBoxProps} />
        } else {
            const title = (typeof item.title === 'function') ? item.title() : item.title;
            _v = <span title={title}>{title}</span>;
        }

        if (noBorderColumn.indexOf(item.dataKey) !== -1 || last) {
            assign(_style, {
                borderRight: 'none'
            })
        }

        return (
            <div 
                key={index} 
                className={classnames({
                    "kuma-uxtable-cell": true,
                    "show-border": me.props.showHeaderBorder
                })}
                style={_style}
            >
              {me.renderIndent(index)}
              {_v}
              {me.renderMessageIcon(item)}
              {me.renderOrderIcon(item)}
            </div>
        )
    }

    renderIndent(index) {
        if (this.firstIndex !== index) {
            return;
        }
        const me = this;
        const {renderModel, checkboxColumnKey} = me.props;
        if (renderModel == "tree") {
            return <span className={classnames({
                "indent": true,
                "hasCheck": checkboxColumnKey
            })}></span>
        }
    }


    renderColumns(_columns) {
        let me = this;
        let columns = _columns.map((item, index) => {
            let last = (index == _columns.length - 1);
            if ('group' in item) {
                // First determine whether the group should be rendered, if all columns
                // is hidden, the column group should not be rendered.
                let shouldRenderGroup = item.columns.some((column, i) => {
                    return !column.hidden;
                });
                if (shouldRenderGroup) {
                    return <div className="kuma-uxtable-header-column-group" key={index}>
                             <div className="kuma-uxtable-header-group-name">
                               {item.group}
                             </div>
                             {item.columns.map((column, i) => {
                                  return me.renderColumn(column, i, false, last);
                              })}
                           </div>
                }
            } else {
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

        if (props.showColumnPicker && (props.fixedColumn == 'no' || props.fixedColumn == 'scroll')) {
            _picker = this.renderPicker();
        }

        if (props.fixedColumn == 'fixed') {
            _columns = props.columns.filter((item) => {
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
        } else if (props.fixedColumn == 'scroll') {
            _columns = props.columns.filter((item) => {
                if (!item.fixed) {
                    return true
                } else if (!item.hidden) {
                    if (!item.width) {
                        item.width = 100;
                    }
                    _width = item.width * 1 + _width;
                }
            });
            assign(_headerStyle, {
                width: props.width - _width - 3,
                minWidth: props.width - _width - 3
            });
            headerWrapClassName = "kuma-uxtable-header-scroll";
        } else {
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
            height: props.headerHeight ? props.headerHeight : (me.hasGroup ? 100 : 50),
            lineHeight: (props.headerHeight ? props.headerHeight : 50) + "px"
        });
        return (
            <div className={headerWrapClassName} style={_headerStyle}>
              <div className={props.jsxprefixCls}>
                {me.renderColumns(_columns)}
                {_picker}
              </div>
            </div>
        );
    }

}
;

Header.propTypes = {
};

Header.defaultProps = {
    jsxprefixCls: "kuma-uxtable-header"
};

module.exports = Header;
