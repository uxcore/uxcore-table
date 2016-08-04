/**
 * Created by xy on 15/4/13.
 */

const Row = require('./Row');
const Mask = require('./Mask');
const util = require('./util');
const deepcopy = require('deepcopy');
const React = require('react');
const ReactDOM = require('react-dom');
const addEventListener = require('rc-util/lib/Dom/addEventListener');
const throttle = require('lodash/throttle');


class Tbody extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const me = this;
    me.rootEl = me.refs.root;
    me.scrollHandler = throttle(me.onScroll.bind(me), 20);
    me.scrollListener = addEventListener(me.rootEl, 'scroll', me.scrollHandler);
  }

  componentWillUnmount() {
    const me = this;
    me.scrollHandler.remove();
  }

  getDomNode() {
    return this.refs.root;
  }

  renderEmptyData() {
    if (this.props.data.length === 0 && !this.props.mask) {
      const style = {
        lineHeight: `${this.props.height - 10}px`,
      };
      return (
        <div className="kuma-uxtable-body-emptyword" style={style}>
          {this.props.root.props.emptyText}
        </div>
      );
    }
  }

  onScroll(e) {
    const me = this;
    const { fixedColumn } = me.props;
    if (fixedColumn !== 'fixed') {
      if (me.scrollEndTimer) {
        clearTimeout(me.scrollEndTimer);
      }
      me.scrollEndTimer = setTimeout(() => {
        me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop);
      }, 500);
      me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop);
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
          last: (index === _data.length - 1),
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