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

    }
    render() {
        let props= this.props,_columns=props.columns,_style={},_data=props.data;

        return (<div className={this.props.jsxprefixCls} onClick={this.handleClick.bind(this)}>
            {
                _columns.map(function(item){

                    if(item.hidden) return;
                
                   let renderProps={
                        column: item,
                        index: props.index,
                        data:_data,
                        onModifyRow: props.onModifyRow
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
