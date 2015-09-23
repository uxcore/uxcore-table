/**
 * Grid Component for uxcore
 * @author zhouquan.yezq
 *
 * Copyright 2014-2015, UXCore Team, Alinw.
 * All rights reserved.
 */

let Select = require("uxcore-select2");
let Option = Select.Option;

class SelectField extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            value: this.props.value
        }
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    
    componentWillUnmount () {
       
    }
    componentWillReceiveProps(nextProps) {

        this.setState({
            value: nextProps.value
        })
    }
    handleChange(value) {

        this.setState({
            value: value
        })
        this.props.handleChange.apply(null,[value]);
    }

    renderOptions(config) {
        let _arr=[];
        for(let key in config.options) {
            _arr.push(<Option value={key} key={key}>{config.options[key]}</Option>) 
        }
        return _arr;
    }

    render() {
       let  config= this.props.config;
        return ( <Select  value={this.state.value} optionLabelProp="children" showSearch={false} style={{width:config.width-10}}  onChange={this.handleChange.bind(this)}>
                {
                    this.renderOptions(config).map(function(item){
                        return item;
                    })
                }
                </Select>);
    }

};

SelectField.propTypes= {
};

SelectField.defaultProps = {

};

export default SelectField;
