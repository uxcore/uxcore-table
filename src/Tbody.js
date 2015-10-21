/**
 * Created by xy on 15/4/13.
 */

let Row = require("./Row");
let Mask = require("./Mask");

class Tbody extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
        };
    }

    renderEmptyData() {
       if(this.props.data.length==0) {
           let _style={
             lineHeight: this.props.height-10+"px",
           }
          return (<div className="kuma-gird-body-emptyword" style={_style}>暂无数据.</div>);
       }
    }

    render() {
        
        let _props = this.props,
            me = this, 
            _columns = _props.columns, 
            _data = _props.data.length > 0 ? _props.data : [];

        return (
            <ul className={this.props.jsxprefixCls}>
                {this.renderEmptyData()}
                {_data.map(function(item,index) {
                    let renderProps={
                        columns: _columns,
                        rowIndex: item.jsxid,
                        rowData: _data[index],
                        data: _data,
                        root: _props.root,
                        onModifyRow: _props.onModifyRow,
                        addRowClassName: _props.addRowClassName,
                        rowSelection: _props.rowSelection,
                        changeSelected: me.props.changeSelected,
                        subComp: _props.subComp,
                        actions: _props.actions,
                        key: 'row'+index,
                        rowHeight: _props.rowHeight,
                        mode: _props.mode,
                        renderModel: _props.renderModel,
                        level:1,
                        levels: _props.levels,
                        visible:true
                    };
                    return <Row {...renderProps} />
                })}
                <Mask visible={_props.mask}/>
            </ul>
        );
    }

};

Tbody.propTypes= {
};

Tbody.defaultProps = {
    jsxprefixCls: "kuma-grid-body"
};

export default Tbody;
