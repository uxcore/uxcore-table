/**
 * Created by xy on 15/4/13.
 */
import React from 'react';

import Row from "./row"

class Tbody extends React.Component {

    constructor(props) {
        super(props);
        this.state= {

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

    render() {
        
        let _props= this.props, _columns= _props.columns, _data= _props.data;
        let _style={
            width: _props.width,
            height: _props.height,
            overflowY:'scroll'
        }
        return (<div className={this.props.jsxprefixCls} style={_style}>
           { _data.map(function(item,index) {
                let renderProps={
                    columns: _columns,
                    index: index,
                    data:_data,
                    onModifyRow: _props.onModifyRow,
                    rowSelection: _props.rowSelection
                };
                return <Row {...renderProps} />
            })}
        </div>);
    }

};

Tbody.propTypes= {
};

Tbody.defaultProps = {
    jsxprefixCls: "kuma-grid-body"
};

export default Tbody;