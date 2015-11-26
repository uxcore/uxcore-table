/**
 * Created by xy on 15/4/13.
 */

let Const = require('uxcore-const');
let CheckBox = require('./CheckBox');
let TextField = require('./TextField');
let SelectField = require("./SelectField");
let CellField = require('./CellField');
let util = require('./Util');
let classnames = require('classnames');
let assign = require('object-assign');

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            'mode':Const.MODE.VIEW,
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

    doAction(rowData,actions,e) {
        let me = this;
        let el = $(e.target);
        if (el.hasClass('action')) {
            actions[el.data('type')].apply(null,[rowData, me.props.root]);
        }
    }

    /**
    * @param {JSON}
    */
    getActionItems(actions) {
       let items=[];
       for(let i  in actions) {
          if(actions.hasOwnProperty(i)) {
             items.push(i);
          }
       }

      let props = this.props,_column = props.column,beforeRender= _column.beforeRender;
      if(beforeRender) {
         return beforeRender.apply(null,[props.rowData,items])
      }
      return items;
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
        
        let props = this.props,
            me   = this,
            _column = props.column, 
            _width = _column.width, 
            _style = {
                width: _width ? _width : 100,
                textAlign: props.align ? props.align : "left"
            },
            _v = assign({}, props.rowData),
            renderProps;

        if (_column.render) {
           _v = _column.render.apply(null,[this.getCellData(),_v]);
        }
        else if (_column.type=='action' && props.mode == Const.MODE.EDIT) {

            _v = <div className="action-container" onClick={this.doAction.bind(this,_v,_column.actions)}>
                    { 
                        me.getActionItems(_column.actions).map(function(action, index) {
                            return <span className="action" key={index} data-type={action}>{action}</span>
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
            _v = <CheckBox disable={_column.disable} mode={props.mode} align={props.align} jsxchecked={checked} ref="checkbox" onchange={this.handleCheckChange.bind(this)}/>

        }
        else if (_column.type == 'treeIcon') {
            _v = me.renderTreeIcon();
        }
        else if (_column.type=='text') {
            // renderProps={
            //     value: this.getCellData(),
            //     mode: props.mode,
            //     onchange:this.handleTxtChange.bind(this),
            //     onblur:this.onblur.bind(this)
            // }
            // _v = <TextField {...renderProps}/>
            renderProps = {
                value: this.getCellData(),
                mode: props.mode,
                rowData: props.rowData,
                column: _column,
                handleDataChange: props.handleDataChange
            }
            _v = <CellField {...renderProps} />
        }
        else if (_column.type=='select') {
            renderProps={
                value: this.getCellData(),
                mode: props.mode,
                config:_column,
                handleChange:this.handleChange.bind(this)
            }
            _v = <SelectField {...renderProps} />
        }
        else if (_column.type == 'money' || _column.type == "card" || _column.type == "cnmobile") {
            _v = <div title={this.getCellData()}>{util.formatValue(this.getCellData(), _column.type, _column.delimiter)}</div>;
        }
        else {
            _v = <div title={this.getCellData()}>{this.getCellData()}</div>;
        }

        let child=this.props.children;
        return (
            <div className={props.jsxprefixCls} style={_style} onClick={this.handleClick.bind(this)}>
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
