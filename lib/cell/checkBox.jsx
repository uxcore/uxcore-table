/**
 * A checkbox field
 */
import React from 'react';

class CheckBox extends React.Component {

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
    handleClick(e) {

    }
    getValue () {
        return this.refs.checkbox.getDOMNode().checked;
    }
    // why defaultChecked not work, 
    render() {
        return <div><input type="checkbox" defaultChecked={this.props.checked}  onChange={this.props.onchange.bind(this)} ref="checkbox"/></div>
    }

};

CheckBox.propTypes= {
};

CheckBox.defaultProps = {

};

export default CheckBox;