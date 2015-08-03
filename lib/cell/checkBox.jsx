/**
 * A checkbox field
 */
import React from 'react';

class CheckBox extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
       
    }

    prepareStyle() {

    }
    handleChange(e) {
        let v= this.getValue();
        v=v?'checked':'';
        this.props.onchange.apply(null,[e])
        /*this.setState({
            checked: v
        })*/
    }
    
    getValue () {
        return this.refs.checkbox.getDOMNode().checked;
    }

    render() {
        let renderProps= {
            className: "kuma-checkbox",
            checked: this.props.checked,
            onChange: this.handleChange.bind(this)
        }
        return <label><input  type="checkbox" ref="checkbox" {...renderProps}/><s></s></label>
    }

};

CheckBox.propTypes= {
};

CheckBox.defaultProps = {

};

export default CheckBox;