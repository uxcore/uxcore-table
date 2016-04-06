/**
 * Created by xy on 15/4/13.
 */

let React = require('react');
let ReactDOM = require('react-dom');
let Const = require('uxcore-const');
let Dropdown = require('uxcore-dropdown');
let Menu = require('uxcore-menu');

let CheckBox = require('./CheckBox');
let Radio = require('./Radio');
let TextField = require('./TextField');
let SelectField = require("./SelectField");
let RadioField = require("./RadioField");
let util = require('./Util');
let classnames = require('classnames');
let assign = require('object-assign');
let deepcopy = require('deepcopy');
let fieldsMap = {
    "select": SelectField,
    "text": TextField,
    "radio": RadioField
};

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'fold': 1, // 1- fold  0-unfold
            'checked': !!this.getCellData()
        };
    }

    componentWillReceiveProps(nextProps) {
        let me = this;
        if (me.props.column.type == "checkbox" || me.props.column.type == "checkboxSelector" || me.props.column.type == "radioSelector") {
            me.setState({
                checked: !!me.getCellData(nextProps)
            })
        }
    }

    componentDidMount() {
        let me = this;
        if (me.props.column.type == "checkbox" || me.props.column.type == "checkboxSelector" || me.props.column.type == "radioSelector") {
            me.props.changeSelected(me.state.checked, me.props.rowIndex, true);
        }
    }


    handleCheckChange(e) {
        var me = this,
            _props = this.props,
            v = _props.rowData;
        me.props.changeSelected(e.target.checked, _props.rowIndex, false);
    }

    handleDropdownVisibleChange(visible) {
        let me = this;
        me.setState({
            dropdownVisible: visible
        });
    }

    showSubComp() {
        this.props.showSubCompCallback.apply();
    }


    /**
     * @param actions {Array or Object}
     */
    getActionItems(actions) {
        if (typeof actions !== "object") {
            console.error("Table: Actions should be an object or array");
            return [];
        } else {
            let me = this;
            me.items = [];
            if (actions instanceof Array) {
                me.items = actions;
            } else {
                for (let i in actions) {
                    if (actions.hasOwnProperty(i)) {
                        me.items.push({
                            title: i,
                            callback: actions[i]
                        });
                    }
                }
            }

            return me.items;
        }
    }

    getEditData() {
        let me = this;
        let column = me.props.column;
        let editKey = column.editKey || column.dataKey;
        return me.props.rowData[editKey];
    }

    getCellData(nextProps) {

        let props = nextProps || this.props,
            _column = props.column,
            cellData = props.rowData[_column.dataKey];

        return cellData;
    }

    handleActionClick(cb, e) {
        e.stopPropagation();
        let me = this;
        me.setState({
            dropdownVisible: false
        })
        cb && cb();
    }

    render() {

        let me = this,
            props = me.props,
            _column = props.column,
            _width = _column.width,
            _mode = props.rowData['__mode__'],
            _style = {
                width: _width ? _width : 100,
                textAlign: props.align ? props.align : "left"
            },
            _v = deepcopy(props.rowData),
            renderProps;

        if (_column.type == 'action') {
            _v = <div className="action-container">
                    {me.renderActionItems(_column, _v, _mode)}
                 </div>
        } else if (_column.type == 'checkbox' || _column.type == 'checkboxSelector') {

            _style.paddingRight = 4;
            _style.paddingLeft = 12;

            let checked;
            if (me.state.checked) {
                checked = 'checked'
            } else {
                checked = "";
            }

            let disable = false;
            if ('disable' in _column) {
                disable = _column.disable;
            } else if ('isDisable' in _column) {
                disable = !!_column.isDisable(props.rowData);
            }
            _v = <CheckBox disable={disable} mode={props.mode} align={props.align} jsxchecked={checked} ref="checkbox" onchange={me.handleCheckChange.bind(me)}/>

        } else if (_column.type == 'radioSelector') {
            _style.paddingRight = 4;
            _style.paddingLeft = 12;

            let checked;
            if (me.state.checked) {
                checked = 'checked'
            } else {
                checked = "";
            }

            let disable = false;
            if ('disable' in _column) {
                disable = _column.disable;
            } else if ('isDisable' in _column) {
                disable = !!_column.isDisable(props.rowData);
            }
            _v = <Radio disable={disable} mode={props.mode} align={props.align} jsxchecked={checked} onchange={me.handleCheckChange.bind(me)}/>
        } else if (_column.type == 'treeIcon') {
            _v = me.renderTreeIcon();
        }

        // inline edit mode
        else if ((_column.type == 'custom' || _column.type in fieldsMap) && _mode == Const.MODE.EDIT && (!('canEdit' in _column) || _column.canEdit(props.rowData))) {
            renderProps = {
                value: me.getEditData(),
                rowData: props.rowData,
                index: props.index,
                column: _column,
                handleDataChange: props.handleDataChange,
                attachCellField: props.attachCellField,
                detachCellField: props.detachCellField
            }
            let Field;

            if (_column.type == 'custom') {
                Field = props.column.customField;
            } else {
                Field = fieldsMap[_column.type];
            }
            _v = <Field {...renderProps} />
        } else if (_column.type == 'money' || _column.type == "card" || _column.type == "cnmobile") {
            _v = <div title={me.getCellData()}>{util.formatValue(me.getCellData(), _column.type, _column.delimiter)}</div>;
        } else if (_column.render) {
            _v = _column.render.apply(null, [me.getCellData(), _v]);
        } else {
            _v = <div title={me.getCellData()}>{me.getCellData()}</div>;
        }

        let child = me.props.children;
        return (
            <div className={props.jsxprefixCls} style={_style}>
                {child}
                {_v}
            </div>
            );
    }

    /**
     * @param {Object} column current column config
     * @param {Object} rowData current row data
     * @param {String} mode current row mode: edit or view, same as rowData['__mode__'] 
     */

    renderActionItems(column, rowData, mode) {
        let me = this;
        let actions = me.getActionItems(column.actions).filter((item) => {
            return !('mode' in item) || item.mode == mode;
        });
        if (actions.length <= 2) {
            return actions.map((item, index) => {
                return <a href="javascript:void(0);" key={index} className="action" onClick={me.handleActionClick.bind(me, item.callback.bind(me, rowData, me.props.root))}>
                    {!!item.render ? item.render(item.title, me.props.rowData) : item.title}
                </a>
            })
        } else {
            let arr = [];
            arr.push(<a href="javascript:void(0);" className="action" key='action' onClick={me.handleActionClick.bind(me, actions[0].callback.bind(me, rowData, me.props.root))}>
                {!!actions[0].render ? actions[0].render(actions[0].title, me.props.rowData) : actions[0].title}
            </a>);
            let menu = <Menu>
                {actions.slice(1).map((action, index) => {
                    return <Menu.Item key={index}>
                                <a href="javascript:void(0);" className="action" key='action' onClick={me.handleActionClick.bind(me, action.callback.bind(me, rowData, me.props.root))}>
                                    {!!action.render ? action.render(action.title, me.props.rowData) : action.title}
                                </a>
                            </Menu.Item>
                })}
            </Menu>;
            arr.push(
                <i  className="kuma-icon kuma-icon-triangle-down" key="icon"></i>
            )
            let dropdownOptions = {
                key: 'icon',
                overlay: menu,
                trigger: ['click'],
                visible: me.state.dropdownVisible,
                onVisibleChange: me.handleDropdownVisibleChange.bind(me)
            }
            return <Dropdown {...dropdownOptions}><span>{arr}</span></Dropdown>;

        }
    }

    renderTreeIcon() {
        if (this.props.cellIndex == 0 && this.props.hasSubComp) {
            let open = this.props.rowData.showSubComp;
            return <span className="kuma-uxtable-tree-icon" onClick={this.showSubComp.bind(this)}><i className={classnames({
                    "kuma-icon": true,
                    "kuma-icon-tree-open": open,
                    "kuma-icon-tree-close": !open
                })}></i></span>
        }
    }
}
;

Cell.propTypes = {
};

Cell.defaultProps = {
    jsxprefixCls: "kuma-uxtable-cell"
};

export default Cell;
