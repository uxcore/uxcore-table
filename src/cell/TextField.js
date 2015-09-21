/**
 * A editable  plain text field
 */
import React from 'react';
import reactMixin  from 'react-mixin';


class TextField extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            value: this.props.value
        }

    }
    componentDidMount() {
        //this.focus();
    }
    componentDidUpdate() {

    }
    focus() {
        this.refs.txtfield.getDOMNode().focus();
    }
    componentWillUnmount () {
       
    }

    componentWillReceiveProps() {
       this.setState({
          value: this.props.value
       })
    }

    render() {
        let props= this.props,
        renderProps= {
            className:"kuma-input",
            ref:'txtfield',
            onBlur: props.onblur.bind(this)
        }
        return <input  type="text" {...renderProps} valueLink={this.linkState('value')} />
    }

};

TextField.propTypes= {
};

TextField.defaultProps = {

};

reactMixin.onClass(TextField,React.addons.LinkedStateMixin);

export default TextField;
