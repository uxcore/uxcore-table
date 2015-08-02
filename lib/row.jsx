/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import Cell from './cell/index';
class Row extends React.Component {

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
    handleClick() {
        console.log("+++++handleClick row+++");
    }
    render() {
        let props= this.props,_columns=props.columns,_style={},_data=props.data;

        return (<div className={this.props.jsxprefixCls} onClick={this.handleClick.bind(this)}>
            {
                _columns.map(function(item){
                   let renderProps={
                        column: item,
                        index: props.index,
                        data:_data
                    };
                   return <Cell {...renderProps} />
                })
            }
            
        </div>);
    }

};

Row.propTypes= {
};

Row.defaultProps = {
    jsxprefixCls: "kuma-grid-row"
};

export default Row;
