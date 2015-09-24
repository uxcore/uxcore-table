/**
 * A editable  plain text field
 */

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

    componentWillReceiveProps(nextProps) {
       this.setState({
          value: nextProps.value
       })
    }

    handleChange(newValue) {
       this.setState({value: newValue});
    }

    render() {

        let props= this.props,renderProps ;
        if (props.mode !== 'VIEW') {
            renderProps= {
                className:"kuma-input",
                ref:'txtfield',
                onBlur: props.onblur.bind(this)
            };

            let valueLink = {
              value: this.state.value,
              requestChange: this.handleChange.bind(this)
            };
            return <input  type="text" {...renderProps} valueLink={valueLink} />
        }else {
            return <span key="text">{this.state.value}</span>;
        }

    }

};

TextField.propTypes= {};

TextField.defaultProps = {};

export default TextField;
