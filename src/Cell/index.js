/**
 * Created by xy on 15/4/13.
 */

let Const = require('uxcore-const');
let CheckBox = require('./CheckBox');
let TextField = require('./TextField');
let SelectField = require("./SelectField");
let util = require('./Util');
let classnames = require('classnames');
let assign = require('object-assign');
let deepcopy = require('deepcopy');
let fieldsMap = {
    "select": SelectField,
    "text": TextField
};

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            'fold':1,   // 1- fold  0-unfold
            'checked': !!this.getCellData()
        };
    }

    handleClick(e) {
       /* this.setState({
            mode:"edit"
        })*/
    }

    componentWillReceiveProps(nextProps) {
        let me = this;
        if (me.props.column.type == "checkbox") {
            me.setState({
                checked: !!me.getCellData(nextProps)
            }) 
        }
    }

    componentDidMount() {
        let me = this;
        if (me.props.column.type == "checkbox") {
            me.props.changeSelected(me.state.checked, me.props.rowIndex, true);
        }
    }

    getSelectionRows() {
        var _props = this.props;
        return _props.data.filter(function(item) {
            return item.jsxchecked
        });
    }
    handleCheckChange(e) {
        var me = this,
            _props = this.props,
            v = _props.rowData;
            me.props.changeSelected(e.target.checked, _props.rowIndex, false);
    }
    handleTxtChange(e){
        var _props= this.props;
        _props.rowData[_props.column.dataKey] = e.target.value;
    }
    handleChange(v) {
       var _props = this.props;
       _props.rowData[_props.column.dataKey] = v;
    }
    onblur(e) {

       var _props = this.props;
        _props.rowData[_props.column.dataKey] = e.target.value;

        return ;
        var _props= this.props,record=_props.rowData,value=record[_props.column.dataKey]       
        var isValid=_props.onModifyRow.apply(null,[value,_props.column.dataKey,record]);
        if(isValid) {
            this.setState({
                mode: Const.MODE.VIEW
            });
        } else {
           e.target.focus ? e.target.focus() : "";
        }
    }

    showSubComp() {
        this.props.showSubCompCallback.apply();
    }

    renderTreeIcon() {
        if (this.props.cellIndex == 0 && this.props.hasSubComp) {
            let open = this.props.rowData.showSubComp;
            return <span className="kuma-uxtable-tree-icon" onClick={this.showSubComp.bind(this)}><i className={classnames({
                "kuma-icon": true,
                "kuma-icon-tree-open-2": open,
                "kuma-icon-tree-close-2": !open
            })}></i></span>
        }
    }

    // doAction(rowData, actions ,e) {
    //     let me = this;
    //     let el = $(e.target);
    //     if (el.hasClass('action')) {
    //         for (let i = 0; i < me.items.length; i++) {
    //             if (me.items[i].title == el.data('type')) {
    //                 me.items[i].callback.apply(null, [rowData, me.props.root])
    //                 break;
    //             }
    //         }
    //     }
    // }

   /**
    * @param {JSON}
    */
    getActionItems(actions) {
        if (typeof actions !== "object") {
            console.error("Table: Actions should be an object or array");
            return [];
        }
        else {
            let me = this;
            me.items = [];
            if (actions instanceof Array) {
                me.items = actions;
            } 
            else {
                for (let i in actions) {
                    if (actions.hasOwnProperty(i)) {
                        me.items.push({
                            title: i,
                            callback: actions[i]
                        });
                    }
                }
            }

            let props = this.props,
                _column = props.column,
                beforeRender = _column.beforeRender;

            if (beforeRender) {
                return beforeRender.apply(null,[props.rowData,me.items])
            }
            return me.items;
        }
    }

    getCellData(nextProps) {
        let props = nextProps || this.props,
            _column = props.column,
            beforeRender = _column.beforeRender,
            cellData = props.rowData[_column.dataKey];
      if (beforeRender) {
         return beforeRender.apply(null, [props.rowData,cellData])
      }
      return cellData;
    }

    render() {
        
        let me = this,
            props = me.props,
            _column = props.column, 
            _width = _column.width,
            _mode =  props.rowData['__mode__'],
            _style = {
                width: _width ? _width : 100,
                textAlign: props.align ? props.align : "left"
            },
            _v = deepcopy(props.rowData),
            renderProps;

        if (_column.render) {
           _v = _column.render.apply(null,[me.getCellData(),_v]);
        }
        else if (_column.type == 'action') {

            _v = <div className="action-container">
                    { 
                        me.getActionItems(_column.actions).map(function(item, index) {

                            // There are two cases in which Table will render the action.
                            // One is that 'mode' is not defined in action, which means it will be rendered in any mode.
                            // The other is that 'mode' is defined & 'mode' is equal to the Cell mode, 
                            // which means this action is rendered in the user-specified mode.

                            if (!('mode' in item) || item.mode == _mode) {
                                return <a href="javascript:void(0);" className="action" key={index} onClick={item.callback.bind(me, _v, me.props.root)}>{!!item.render ? item.render(item.title) : item.title}</a>
                            }

                        })
                    }
                 </div>
        }
        else if (_column.type=='checkbox') {

            _style.paddingRight = 32;
            _style.paddingLeft = 12;

            let checked;
            if (me.state.checked) {
                checked='checked'
            } else {
                checked="";
            }
            _v = <CheckBox disable={_column.disable} mode={props.mode} align={props.align} jsxchecked={checked} ref="checkbox" onchange={me.handleCheckChange.bind(me)}/>

        }
        else if (_column.type == 'treeIcon') {
            _v = me.renderTreeIcon();
        }
        else if (_column.type in fieldsMap && _mode == Const.MODE.EDIT) {
            renderProps = {
                value: me.getCellData(),
                rowData: props.rowData,
                index: props.index,
                column: _column,
                handleDataChange: props.handleDataChange,
                attachCellField: props.attachCellField,
                detachCellField: props.detachCellField
            }
            let Field = fieldsMap[_column.type];
            _v = <Field {...renderProps} />
        }
        else if (_column.type == 'money' || _column.type == "card" || _column.type == "cnmobile") {
            _v = <div title={me.getCellData()}>{util.formatValue(me.getCellData(), _column.type, _column.delimiter)}</div>;
        }
        else {
            _v = <div title={me.getCellData()}>{me.getCellData()}</div>;
        }

        let child=me.props.children;
        return (
            <div className={props.jsxprefixCls} style={_style} onClick={me.handleClick.bind(me)}>
                {child}
                {_v}
            </div>
        );   
    }
};

Cell.propTypes= {
};

Cell.defaultProps = {
    jsxprefixCls: "kuma-uxtable-cell"
};

export default Cell;
