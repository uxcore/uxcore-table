/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('./CheckBox');
let TextField = require('./TextField');
let SelectField = require("./SelectField");
let util = require('./Util');
let classnames = require('classnames');

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
        this.props.showSubCompCallback.apply();
    }

    renderTreeIcon() {
        if (this.props.cellIndex == 0 && this.props.hasSubComp) {
            let open = this.props.rowData.showSubComp;
            return <span className="kuma-grid-tree-icon" onClick={this.showSubComp.bind(this)}><i className={classnames({
                "kuma-icon": true,
                "kuma-icon-tree-open-2": open,
                "kuma-icon-tree-close-2": !open
            })}></i></span>
        }
    }

    doAction(rowData,actions,e) {

        let el = $(e.target);
        if (el.hasClass('action')) {
            actions[el.data('type')].apply(null,[rowData]);
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

    getCellData() {
      let props = this.props,_column = props.column,beforeRender= _column.beforeRender;
      let cellData=props.rowData[_column.dataKey];
      if(beforeRender) {
         return beforeRender.apply(null, [props.rowData,cellData])
      }
      return cellData;
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

        if (_column.render) {
           _v = _column.render.apply(null,[this.getCellData(),_v]);
        }
        else if (_column.type=='action' && props.mode =='EDIT') {

            _v = <div className="action-container" onClick={this.doAction.bind(this,_v,_column.actions)}>
                    { 
                      ctx.getActionItems(_column.actions).map(function(action, index) {
                        return <span className="action" key={index} data-type={action}>{action}</span>
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
                value: this.getCellData(),
                mode: props.mode,
                onchange:this.handleTxtChange.bind(this),
                onblur:this.onblur.bind(this)
            }
            _v = <TextField {...renderProps}/>
        }
        else if(_column.type=='select') {
            renderProps={
                value: this.getCellData(),
                mode: props.mode,
                config:_column,
                handleChange:this.handleChange.bind(this)
            }
            _v=<SelectField {...renderProps} />
        }
        else if (_column.type == 'money' || _column.type == "card" || _column.type == "cnmobile") {
            _v = <div title={this.getCellData()}>{util.formatValue(this.getCellData(), _column.type, _column.delimiter)}</div>;
        }
        else if (_column.type == "person" && !!_column.plugin && _column.token) {
            try {
                let Hovercard = _column.plugin;
                _v = <Hovercard emplId={this.getCellData()} placement="right" token={_column.token}>
                        <div>{this.getCellData()}</div>
                     </Hovercard>
            }
            catch(e) {
                console.log(e)
            }
        }
        else {
            _v = <div title={this.getCellData()}>{this.getCellData()}</div>;
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
