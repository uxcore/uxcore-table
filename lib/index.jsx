/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import Header from "./header"
import Tbody  from "./tbody"

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            data: this.props.jsxdata
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    

    componentWillUnmount () {
       
    }
    checkAll(checked) {

        var _data=this.state.data.map(function(item,index){
            item.checked=checked;
            item.country=item.country;
            return item;
        });
        this.setState({
            data:_data
        })
    }
    render() {

        let props= this.props;

        return (<div className={props.jsxprefixCls}>
            <Header columns={props.jsxcolumns} checkAll={this.checkAll.bind(this)} />
            <Tbody columns={props.jsxcolumns} data={this.state.data}/>
        </div>);

    }

};

Grid.propTypes= {
};

Grid.defaultProps = {
    jsxprefixCls: "kuma-grid"
};

export default Grid;