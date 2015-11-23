/**
 * Created by xy on 15/4/13.
 */
let Cell = require('./Cell');
let classnames = require('classnames');
let assign = require('object-assign');

class Row extends React.Component {

    constructor(props) {
        super(props);
        this.state=  {
          expanded: (this.state && this.state.hasOwnProperty('expanded')) ?
                      this.state.expanded :
                        (this.props.level < this.props.levels) ?
                          true :
                          false
        }
    }

    handleClick() {

    }

    showSubCompFunc() {
        let props = this.props, showSubComp=props.rowData.showSubComp;
        props.rowData.showSubComp=!showSubComp;
        this.forceUpdate();
    }

    renderSubComp() {

        let props= this.props;

        if(props.subComp && props.level==1  && props.renderModel!=='tree') {
          if(props.rowData.showSubComp) {
            let subComp = React.cloneElement(props.subComp,{
              passedData: this.props.rowData,
              parentHasCheckbox: !!this.props.rowSelection
            });
            return (<div className="kuma-uxtable-subrow" ref="subRow">{subComp}</div>)
          }
          return false;

        }else {
            return false;
        }
    }

    renderChild() {

        let props  = this.props,me=this, children = [];

        if(props.renderModel!=='tree') {
           return children;
        }
        if (props.rowData.datas) {
          props.rowData.datas.forEach(function (node) {

            let renderProps= assign({}, props,{
              level: me.props.level+1,
              rowData:node,
              rowIndex:node.jsxid,
              key: node.jsxid,
              showSubComp:false,
              visible: me.state.expanded && me.props.visible
            });
            children.push(<Row  {...renderProps} />);

          });

          let renderProps={
            key: "treeRow"+this.props.rowData.jsxid,
            className:"kuma-uxtable-tree-row"
          }

          children=<ul {...renderProps}>{children}</ul>;
        }
        return children;
    }

    renderExpendIcon(rowIndex) {

        let expandCollapseIcon,props  = this.props,_expandIconClass;
        if(props.renderModel!=='tree') {
           return false;
        }

        if (props.rowData.datas) {
          if (!this.state.expanded) {

            _expandIconClass={
              "kuma-icon": true,
              "kuma-icon-tree-open-2": false,
              "kuma-icon-tree-close-2": true
            };
            _expandIconClass["kuma-uxtable-expandIcon-"+props.fixedColumn+"-"+rowIndex]=true;

            expandCollapseIcon = (
              <span className="kuma-uxtable-tree-icon" data-type={props.fixedColumn} data-index={rowIndex}
                    onClick={this.toggleExpanded.bind(this)}>
                    <i className={classnames(_expandIconClass)}></i>
              </span>
            );
          }
          else {

            _expandIconClass={
              "kuma-icon": true,
              "kuma-icon-tree-open-2": true,
              "kuma-icon-tree-close-2": false
            };
            _expandIconClass["kuma-uxtable-expandIcon-"+props.fixedColumn+"-"+rowIndex]=true;

            expandCollapseIcon = (
              <span className="kuma-uxtable-tree-icon" data-type={props.fixedColumn} data-index={rowIndex}
                    onClick={this.toggleExpanded.bind(this)}>
                  <i className={classnames(_expandIconClass)}></i>
              </span>
            );
          }
        }
        else {
          expandCollapseIcon = (
            <span className="kuma-uxtable-emptyicon"></span>
          );
        }
        return expandCollapseIcon;
    }

    renderIndent() {
        let indents = [];
        if(this.props.renderModel=='tree') {
          for (var i = 0; i < this.props.level-1; i++) {
            let renderProps={
               className:"indent",
               key: 'indent'+i
            }
            indents.push(<span {...renderProps} ></span>);
          }
        }
        
        return indents;
    }

    toggleExpanded(e) {
        this.setState({ expanded: !this.state.expanded });
        e.stopPropagation();
        let t=$(e.target);
        if(!t.hasClass('kuma-uxtable-tree-icon')) {
            t= t.parents('.kuma-uxtable-tree-icon');
        }
        if(t.data('type')=='fixed') {
           $(".kuma-uxtable-expandIcon-scroll"+"-"+t.data('index')).trigger('click');
        }else if(t.data('type')=='scroll') {
          $(".kuma-uxtable-expandIcon-fixed"+"-"+t.data('index')).trigger('click');
        }
    }

    render() {

        let props = this.props,
            _columns = props.columns,
            _style = {},
            _data = props.data,
            me = this,
            otherCls = props.addRowClassName(_data[props.rowIndex]);

        if (!this.props.visible) {

          _style = {
            display: 'none' 
          };
        }

        let firstVisableColumn=0;

        return (
            <li className={classnames({
                [this.props.jsxprefixCls]: true,
                [otherCls]: !!otherCls
            })} style={_style} onClick={this.handleClick.bind(this)}>
                {_columns.map(function(item,index){
                    if(item.hidden) return;
                    firstVisableColumn++;
                    let renderProps={
                        column: item,
                        root: props.root,
                        align:item.align,
                        rowData: props.rowData,
                        rowIndex: props.rowIndex,
                        cellIndex:index,
                        hasSubComp: props.subComp ? true : false,
                        data:_data,
                        changeSelected: me.props.changeSelected,
                        showSubCompCallback:me.showSubCompFunc.bind(me),
                        onModifyRow: props.onModifyRow,
                        rowSelection: props.rowSelection,
                        actions: props.actions,
                        mode: props.mode,
                        handleDataChange: props.handleDataChange,
                        key:"cell" + index
                    };

                    if(firstVisableColumn==1) {
                       return  <Cell {...renderProps} >{me.renderIndent()}{me.renderExpendIcon(props.rowIndex)}</Cell>
                    }
                    //if have vertical data structure, how to process it
                    return <Cell {...renderProps} ></Cell>
                })}
                {me.renderChild()}
                {this.renderSubComp()}
            </li>
        );
    }

};            

Row.propTypes= {
    jsxprefixCls: React.PropTypes.string,
    showSubComp: React.PropTypes.bool
};

Row.defaultProps = {
    jsxprefixCls: "kuma-uxtable-row",
    showSubComp: false
};

export default Row;
