/**
 * Created by xy on 15/4/13.
 */

let Row = require("./Row");
let Mask = require("./Mask");
let util = require("./util");
let deepcopy = require('deepcopy');

let React = require('react');
let ReactDOM = require('react-dom');

class Tbody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        let me = this;
        me.rootEl = ReactDOM.findDOMNode(me.refs.root);
        me.scrollHandler = me.onScroll.bind(me);
        $(me.rootEl).on("scroll", me.scrollHandler)
    }

    componentWillUnmount() {
        let me = this;
        $(me.rootEl).off("scroll", me.scrollHandler);
    }

    renderEmptyData() {

        if (this.props.data.length == 0 && !this.props.mask) {
            let _style = {
                lineHeight: this.props.height - 10 + "px",
            }
            return (<div className="kuma-uxtable-body-emptyword" style={_style}>
                      {this.props.root.props.emptyText}
                    </div>);
        }
    }

    onScroll(e) {
        // TODO: remove jquery animation
        //       merge classname scroll/no/fixed

        this.el = ReactDOM.findDOMNode(this);
        let $tableEl = $(this.el).parents(".kuma-uxtable");
        if (this.props.fixedColumn == 'no') {
            $tableEl.find('.kuma-uxtable-header-no').animate({
                scrollLeft: $tableEl.find('.kuma-uxtable-body-no').scrollLeft()
            }, 0)
            return;
        }

        let target = $(e.target);
        if (target.hasClass('kuma-uxtable-body-scroll')) {

            $tableEl.find('.kuma-uxtable-body-fixed').animate({
                scrollTop: $tableEl.find('.kuma-uxtable-body-scroll').scrollTop()
            }, 0)
            $tableEl.find('.kuma-uxtable-header-scroll').animate({
                scrollLeft: $tableEl.find('.kuma-uxtable-body-scroll').scrollLeft()
            }, 0)
        } else {
            $tableEl.find('.kuma-uxtable-body-scroll').animate({
                scrollTop: $tableEl.find('.kuma-uxtable-body-fixed').scrollTop()
            }, 0)
        }
    }

    render() {

        let me = this,
            _props = me.props,
            _columns = _props.columns,
            _data = _props.data.length > 0 ? _props.data : [],
            _style = {},
            _width = 0,
            bodyWrapClassName;

        if (_props.fixedColumn == 'fixed') {
            _columns = _props.columns.filter((item) => {
                if (item.fixed && !item.hidden) {
                    if (!item.width) {
                        item.width = 100;
                    }
                    _width = item.width * 1 + _width;
                    return true
                }
            })
            _style = {
                width: _width,
                minWidth: _width
            }
            bodyWrapClassName = "kuma-uxtable-body-fixed";

        } else if (_props.fixedColumn == 'scroll') {
            let fixedWidth = 0
            _columns = _props.columns.filter((item) => {
                if (!item.fixed) {
                    return true;
                } else if (!item.hidden) {
                    if (!item.width) {
                        item.width = 100;
                    }
                    _width = item.width * 1 + _width;
                }
            })

            // content-box: border-box
            let delta = 2;
            if (util.getIEVer() === 8) {
                delta = 3
            }
            _style = {
                width: _props.width - _width - delta, //change 2 to 3, fix ie8 issue
                minWidth: _props.width - _width - delta
            }
            bodyWrapClassName = "kuma-uxtable-body-scroll";
        } else {
            bodyWrapClassName = "kuma-uxtable-body-no";
        }
        return (
            <div className={bodyWrapClassName} ref="root" style={_style}>
              <ul className={this.props.jsxprefixCls}>
                {this.renderEmptyData()}
                {_data.map(function(item, index) {
                     let renderProps = {
                         columns: _columns,
                         rowIndex: item.jsxid, //tree mode, rowIndex need think more, so use jsxid
                         rowData: deepcopy(_data[index]),
                         index: index,
                         data: _data,
                         root: _props.root,
                         subComp: _props.subComp,
                         actions: _props.actions,
                         key: 'row' + index,
                         mode: _props.mode,
                         renderModel: _props.renderModel,
                         fixedColumn: _props.fixedColumn,
                         level: 1,
                         levels: _props.levels,
                         expandedKeys: _props.expandedKeys,
                         renderSubComp: _props.renderSubComp,
                         changeSelected: me.props.changeSelected,
                         checkboxColumnKey: _props.checkboxColumnKey,
                         addRowClassName: _props.addRowClassName,
                         rowSelection: _props.rowSelection,
                         handleDataChange: _props.handleDataChange,
                         attachCellField: _props.attachCellField,
                         detachCellField: _props.detachCellField,
                         visible: true,
                         last: (index === _data.length -1),
                     };
                     return <Row {...renderProps} />
                 })}
                <Mask visible={_props.mask} text={_props.loadingText}/>
              </ul>
            </div>
            );
    }
}
;

Tbody.propTypes = {
};

Tbody.defaultProps = {
    jsxprefixCls: "kuma-uxtable-body"
};

export default Tbody;
