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
    //TODO:add scroller feature for tbody
    render() {

        console.log("+++++tbody+++++");
        
        let _props= this.props, _columns= _props.columns, _data= _props.data;

        return (<div className={this.props.jsxprefixCls}>
           { _data.map(function(item,index) {
                let renderProps={
                    columns: _columns,
                    index: index,
                    data:_data,
                    onModifyRow: _props.onModifyRow
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