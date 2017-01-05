/**
 * Created by xy on 15/4/13.
 */

const Row = require('./Row');
const util = require('./util');
const deepcopy = require('lodash/cloneDeep');
const React = require('react');
const addEventListener = require('rc-util/lib/Dom/addEventListener');
const throttle = require('lodash/throttle');
const EmptyData = require('uxcore-empty-data');


class Tbody extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const me = this;
    me.rootEl = me.root;
    me.scrollHandler = throttle(me.onScroll.bind(me), 20);
    me.scrollListener = addEventListener(me.rootEl, 'scroll', me.scrollHandler);
  }

  componentWillUnmount() {
    const me = this;
    me.scrollListener.remove();
  }

  onScroll() {
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

  getDomNode() {
    return this.root;
  }

  saveRef(name) {
    const me = this;
    return function func(c) {
      me[name] = c;
    };
  }

  renderEmptyData() {
    if (this.props.data.length === 0 && !this.props.mask) {
      const style = {};
      if (typeof this.props.height === 'number') {
        style.lineHeight = `${this.props.height - 10}px`;
      }
      return (
        <EmptyData style={{ marginTop: '20px' }}>
          {this.props.emptyText}
        </EmptyData>
      );
    }
    return null;
  }

  render() {
    const me = this;
    const props = me.props;
    const data = props.data.length > 0 ? props.data : [];
    let style = {};
    let columns = deepcopy(props.columns);
    let width = 0;
    let bodyWrapClassName;

    if (props.fixedColumn === 'fixed') {
      columns = props.columns.filter((item) => {
        if (item.fixed && !item.hidden) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      style = {
        width,
        minWidth: width,
      };
      bodyWrapClassName = 'kuma-uxtable-body-fixed';
    } else if (props.fixedColumn === 'scroll') {
      columns = props.columns.filter((item) => {
        if (!item.fixed) {
          return true;
        } else if (!item.hidden) {
          width = parseInt(item.width, 10) + width;
        }
        return false;
      });

      let delta = 2;

      // change 2 to 3, fix ie8 issue
      if (util.getIEVer() === 8) {
        delta = 3;
      }
      const bodyWidth = typeof props.width === 'number'
        ? (props.width - width - delta)
        : props.width;
      style = {
        width: bodyWidth,
        minWidth: bodyWidth,
      };
      bodyWrapClassName = 'kuma-uxtable-body-scroll';
    } else {
      bodyWrapClassName = 'kuma-uxtable-body-no';
    }
    return (
      <div className={bodyWrapClassName} ref={this.saveRef('root')} style={style}>
        <ul className={this.props.jsxprefixCls}>
          {this.renderEmptyData()}
          {data.map((item, index) => {
            const renderProps = {
              columns,
              index,
              data,
              rowIndex: item.jsxid, // tree mode, rowIndex need think more, so use jsxid
              rowData: deepcopy(data[index]),
              root: props.root,
              locale: props.locale,
              subComp: props.subComp,
              actions: props.actions,
              key: `row${index}`,
              mode: props.mode,
              renderModel: props.renderModel,
              fixedColumn: props.fixedColumn,
              level: 1,
              levels: props.levels,
              expandedKeys: props.expandedKeys,
              renderSubComp: props.renderSubComp,
              changeSelected: me.props.changeSelected,
              checkboxColumnKey: props.checkboxColumnKey,
              addRowClassName: props.addRowClassName,
              rowSelection: props.rowSelection,
              handleDataChange: props.handleDataChange,
              attachCellField: props.attachCellField,
              detachCellField: props.detachCellField,
              visible: true,
              last: (index === data.length - 1),
            };
            return <Row {...renderProps} />;
          })}
        </ul>
      </div>
    );
  }
}

Tbody.propTypes = {
  jsxprefixCls: React.PropTypes.string,
  data: React.PropTypes.array,
  emptyText: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  height: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  mask: React.PropTypes.bool,
};

Tbody.defaultProps = {
  jsxprefixCls: 'kuma-uxtable-body',
};

export default Tbody;
