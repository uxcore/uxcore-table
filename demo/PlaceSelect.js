let Select = require("uxcore-select2");
let Table = require('../src');

let Option = Select.Option;

let CellField = Table.CellField;;
let classnames = require('classnames');
let assign = require('object-assign');
/**
 * 继承CellField 扩展单元格
 */
class CellPlaceSelect extends CellField {

    constructor(props) {
        super(props);
    }


    /**
     * 查询地点数据
     * @param  {[type]} data [请求数据]
     * @param  {[type]} kind [查询类别，起点、终点]
     * @return {[type]}      [description]
     */
    fetchData(data, kind) {
        let me = this;
        $.ajax({
            url: 'http://10.218.142.49/' + 'travel/searchTravelSite.jsonp',
            dataType: 'jsonp',
            data: data,
            success: function(result) {
                if (!result.hasError) {
                    if (kind == 'from') {
                        me.setState({
                            from: [{siteName: '北京'}, {siteName: '上海'}, {siteName: '广州'}, {siteName: '深圳'}]
                        });
                    } else {
                        me.setState({
                            to: [{siteName: '北京'}, {siteName: '上海'}, {siteName: '广州'}, {siteName: '深圳'}]
                        });
                    }

                } else {
                    console.error("responce data don't have sucess")
                }
            }
        });
    }

    renderContent() {
        let me = this;
        //起点配置
        let {value} = me.props;
        value = value ? value.split(' - '): [];
        let fieldProps1 = {
            onChange: (result) => {
                me.handleDataChange({
                    jsxid: me.props.rowData['jsxid'],
                    column: me.props.column,
                    value: result + ' - ' + (value[1] || ""),
                    text: result + ' - ' + (value[1] || "") 
                });
                
            },
            value: value[0],
            key : 'place1',
            filterOption: false,
            onSearch: (data) => {
                me.fetchData({keyword:data,limit:10},'from');
            }
        };

        // 终点配置
        let fieldProps2 = {
            onChange: (result) => {
                
                me.handleDataChange({
                    jsxid: me.props.rowData['jsxid'],
                    column: me.props.column,
                    value: (value[0] || "") + ' - ' + result,
                    text: (value[0] || "") + ' - ' + result
                });
                
            },
            value: value[1],
            key : 'place2',
            filterOption: false,
            onSearch: (data) => {
                me.fetchData({keyword:data,limit:10},'to');
            }
        }
        
        let arr = [];
        arr.push(
            <div className='city-continer' key="cityFrom">
                <Select {...fieldProps1}>
                    {me.state.from && me.state.from.map(function(item,index){
                   
                        return(
                                <Option key={item.siteName}>
                                    <span>{item.siteName}</span>
                                </Option>

                            );

                        })
                    }
                </Select>
            </div>
        );

        arr.push(<span key="split" className="kuma-uxform-split">-</span>);

        arr.push(
            <div className='city-continer' key="cityTo">
                <Select {...fieldProps2}>
                    {me.state.to && me.state.to.map(function(item,index){
                   
                        return(
                                <Option key={item.siteName}>
                                    <span>{item.siteName}</span>
                                </Option>

                            );

                        })
                    }
                </Select>
            </div>
        );

        return (<div className='place-div'>{arr}</div>);
    }

}

CellPlaceSelect.propTypes = assign({}, CellField.propTypes);
CellPlaceSelect.defaultProps = assign({}, CellField.defaultProps);

module.exports = CellPlaceSelect;