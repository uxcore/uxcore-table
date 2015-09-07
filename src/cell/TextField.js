/**
 * A editable  plain text field
 */
import React from 'react';

class TextField extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
        };
    }
    componentDidMount() {
        this.focus();
    }
    componentDidUpdate() {

    }
    focus() {
        this.refs.txtfield.getDOMNode().focus();
    }
    componentWillUnmount () {
       
    }
    render() {
        let props= this.props,
        renderProps= {
            className:"kuma-input",
            ref:'txtfield',
            defaultValue: props.value,
            onBlur: props.onblur.bind(this),
            onChange:props.onchange.bind(this)
        }
        return <input  type="text" {...renderProps}/>
    }

};

TextField.propTypes= {
};

TextField.defaultProps = {

};

export default TextField;
