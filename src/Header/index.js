/**
 * Created by xy on 15/4/13.
 */
let CheckBox = require('../Cell/CheckBox');
let assign = require('object-assign');


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
            <ul className="kuma-grid-colmnpicker" style={_style} ref="columnpicker">
                {
                    this.props.columns.map(function(item,index) {
                        if(item.dataKey=='jsxchecked') return;
                        if(item.hidden) {
                            return <li ref="" key={index} onClick={me.handleColumns.bind(me,index)}>{item.title}</li>
                        }else {
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
          return (<span className="kuma-grid-h-sort">
            <i className={asc} onClick={this.handleColumnOrder.bind(ctx,'asc', column)}/>
            <i className={desc} onClick={this.handleColumnOrder.bind(ctx,'desc',column)}/>
            </span>)
      }
    }

    render() {

        let props= this.props, 
            ctx = this,
            _picker;

        if (this.props.columnPicker) {
             _picker = this.renderPicker();
        }

        let _style={ 
            height: props.headerHeight ? props.headerHeight : 40,
            lineHeight: (props.headerHeight ? props.headerHeight : 40) + "px"
        }

        return (
            <div className={props.jsxprefixCls} style={_style}>

                {props.columns.map(function (item, index) {

                    if (item.hidden) return;

                    let _style={
                        width: item.width ? item.width : 100,
                        textAlign: item.align ? item.align : "left"
                    },_v;

                    if (item.type=='checkbox') {
                        assign(_style, {
                            paddingRight: 32,
                            paddingLeft: 12,
                            width: item.width ? item.width : 92
                        });

                        _v = <CheckBox  ref="checkbox" onchange={ctx.handleCheckBoxChange.bind(ctx)}/>
                    } 
                    else {
                        _v = item.title;
                    }

                    return <div key={index} className="kuma-grid-cell" style={_style}>
                                <span>{_v}</span>
                                {ctx.renderOrderIcon(item)}
                           </div>
                })}
                {_picker}
            </div>
        );
    }

};

Header.propTypes= {
};

Header.defaultProps = {
    jsxprefixCls: "kuma-grid-header"
};

export default Header;
