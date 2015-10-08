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
            _columns = _props.columns, 
            _data = _props.data.length > 0 ? _props.data : [];

        return (
            <div className={this.props.jsxprefixCls}>
                {this.renderEmptyData()}
                {_data.map(function(item,index) {
                    let renderProps={
                        columns: _columns,
                        rowIndex: index,
                        data: _data,
                        onModifyRow: _props.onModifyRow,
                        rowSelection: _props.rowSelection,
                        subComp: _props.subComp,
                        actions: _props.actions,
                        key: 'row'+index,
                        rowHeight: _props.rowHeight,
                        mode: _props.mode,
                        ts: new Date().getTime()
                    };
                    return <Row {...renderProps} />
                })}
                <Mask visible={_props.mask}/>
            </div>
        );
    }

};

Tbody.propTypes= {
};

Tbody.defaultProps = {
    jsxprefixCls: "kuma-grid-body"
};

export default Tbody;
