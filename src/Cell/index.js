/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('./CheckBox');
let TextField = require('./TextField');
let SelectField = require("./SelectField");
let util = require('./Util');

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            'mode':'view',
            'fold':1   // 1- fold  0-unfold
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount () {
       
    }

    prepareStyle() {

    }
    handleClick(e) {
       /* this.setState({
            mode:"edit"
        })*/
    }

    getSelectionRows() {
        var _props= this.props;
        return _props.data.filter(function(item) {
            return item.jsxchecked
        });
    }
    handleCheckChange(e) {
        var _props= this.props,v=_props.rowData;
        v.jsxchecked=e.target.checked;
        this.setState({});
        if( _props.rowSelection) {
            _props.rowSelection.onSelect.apply(null,[v.jsxchecked,v,this.getSelectionRows()])
        }
    }
    handleTxtChange(e){
        var _props= this.props;
        _props.rowData[_props.column.dataKey] = e.target.value;
    }
    handleChange(v) {
       var _props= this.props;
       _props.rowData[_props.column.dataKey]=v;
    }
    onblur(e) {

       var _props= this.props;
        _props.rowData[_props.column.dataKey]=e.target.value;

        return ;
        var _props= this.props,record=_props.rowData,value=record[_props.column.dataKey]       
        var isValid=_props.onModifyRow.apply(null,[value,_props.column.dataKey,record]);
        if(isValid) {
            this.setState({
                mode:"view"
            });
        } else {
           e.target.focus ? e.target.focus() : "";
        }
    }

    showSubComp() {
        this.props.showSubCompCallback.call(this.props.ctx);
    }

    renderTreeIcon() {
        if (this.props.cellIndex == 0 && this.props.hasSubComp) {
            if (this.props.st_showSubComp) {
                return (<span className="kuma-grid-tree-icon" onClick={this.showSubComp.bind(this)}><i className="kuma-icon kuma-icon-tree-open-2"></i></span>);
            }
            else {
                return (<span className="kuma-grid-tree-icon" onClick={this.showSubComp.bind(this)}><i className="kuma-icon kuma-icon-tree-close-2"></i></span>);
            }
        }
    }

    doAction(rowData,items,e) {

        let el=$(e.target);
          if(el.hasClass('action')) {
             if( el.data('type') == 'inlineEdit') {
                this.showSubComp();
                return ;
             }else if(el.data('type') =='addRow') {
                 this.props.actions['addRow'].apply();

             }else if(el.data('type') =='delRow') {
                 this.props.actions['delRow'].apply(null,[rowData]);
             }
             items.map(function(item){
                if(item.type ==el.data('type')) {
                    item.cb?item.cb.apply(null,[rowData]):'';
                }
             })
          }
    }

    render() {
        
        let props = this.props,
            ctx = this,
            _column = props.column, 
            _width = _column.width, 
            _style = {
                width: _width ? _width : 100,
                textAlign: props.align ? props.align : "left"
            },
            _v = props.rowData,renderProps;

        if(_column.render) {
           _v = _column.render.apply(null,[_v]);
        }
        else if (_column.type=='action' && props.mode =='EDIT') {

            _v = <div className="action-container" onClick={this.doAction.bind(this,_v,_column.items)}>
                    { 
                      _column.items.map(function(child, index) {
                        return <span className="action" key={index} data-type={child.type} >{child.title}</span>
                      })
                    }
                 </div>
        }
        else if (_column.type=='checkbox') {

            _style.paddingRight = 32;
            _style.paddingLeft = 12;

            let checked;
            if (_v.jsxchecked) {
                checked='checked'
            } else {
                checked="";
            }
            _v = <CheckBox mode={props.mode} align={props.align} jsxchecked={checked} ref="checkbox" onchange={this.handleCheckChange.bind(this)}/>

        }
        else if (_column.type == 'treeIcon') {
            _v = ctx.renderTreeIcon();
        }
        else if(_column.type=='text') {
            renderProps={
                value: _v[_column.dataKey],
                mode: props.mode,
                onchange:this.handleTxtChange.bind(this),
                onblur:this.onblur.bind(this)
            }
            _v = <TextField {...renderProps}/>
        }
        else if(_column.type=='select') {
            renderProps={
                value: _v[_column.dataKey],
                mode: props.mode,
                config:_column,
                handleChange:this.handleChange.bind(this)
            }
            _v=<SelectField {...renderProps} />
        }
        else if (_column.type == 'money' || _column.type == "card" || _column.type == "cnmobile") {
            _v = <div title={props.rowData[_column.dataKey]}>{util.formatValue(props.rowData[_column.dataKey], _column.type, _column.delimiter)}</div>;
        }
        else if (_column.type == "person" && !!_column.plugin && _column.token) {
            try {
                let Hovercard = _column.plugin;
                _v = <Hovercard emplId={props.rowData[_column.dataKey]} placement="right" token={_column.token}>
                        <div>{props.rowData[_column.dataKey]}</div>
                     </Hovercard>
            }
            catch(e) {
                console.log(e)
            }
        }
        else {
            _v = <div title={props.rowData[_column.dataKey]}>{props.rowData[_column.dataKey]}</div>;
        }

        return (<div className={props.jsxprefixCls} style={_style} onClick={this.handleClick.bind(this)}>
            {_v}
        </div>);   
    }
};

Cell.propTypes= {
};

Cell.defaultProps = {
    jsxprefixCls: "kuma-grid-cell"
};

export default Cell;
