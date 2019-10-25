/**
 * Created by xy on 15/4/13.
 */

const Row = require('./Row');
const util = require('./util');
const deepcopy = require('lodash/cloneDeep');
const React = require('react');
let addEventListener = require('rc-util/lib/Dom/addEventListener');
// const throttle = require('lodash/throttle');
const EmptyData = require('uxcore-empty-data');
// const QueueAnim = require('rc-queue-anim');

addEventListener = addEventListener.default || addEventListener

class Tbody extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const me = this;
    me.rootEl = me.root;
    me.scrollHandler = me.onScroll.bind(me);
    me.scrollListener = addEventListener(me.rootEl, 'scroll', me.scrollHandler);
  }

  componentWillUnmount() {
    const me = this;
    me.scrollListener.remove();
  }

  onScroll() {
    const me = this;
    const { fixedColumn } = me.props;
    if (me.scrollEndTimer) {
      clearTimeout(me.scrollEndTimer);
    }
    me.scrollEndTimer = setTimeout(() => {
      me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop, fixedColumn);
    }, 500);
    me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop, fixedColumn);
  }

  getDom() {
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
        <EmptyData style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.emptyText}
        </EmptyData>
      );
    }
    return null;
  }

  render() {
    const me = this;
    const props = me.props;
    const data = props.data;
    const leftFixedType = ['checkboxSelector', 'radioSelector', 'treeIcon'];
    let style = {
      height: props.bodyHeight,
    };
    let columns = deepcopy(props.columns);
    let width = 0;
    let bodyWrapClassName;

    const scrollBarWidth = util.measureScrollbar();

    if (props.fixedColumn === 'fixed') {
      columns = props.columns.filter((item) => {
        if ((item.fixed && !item.hidden) || (leftFixedType.indexOf(item.type) !== -1)) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      style = {
        ...style,
        // paddingBottom: `${scrollBarWidth}px`,
        // marginBottom: `-${scrollBarWidth}px`,
        height: props.bodyHeight === 'auto' ? props.bodyHeight : `${props.bodyHeight - scrollBarWidth}px`,
      };

      bodyWrapClassName = 'kuma-uxtable-body-fixed';
    } else if (props.fixedColumn === 'rightFixed') {
      columns = props.columns.filter((item) => {
        if (item.rightFixed && !item.hidden) {
          return true;
        }
        return false;
      });
      bodyWrapClassName = 'kuma-uxtable-body-right-fixed';
      style = {
        ...style,
        // paddingBottom: `${scrollBarWidth}px`,
        // marginBottom: `-${scrollBarWidth}px`,
        height: props.bodyHeight === 'auto' ? props.bodyHeight : `${props.bodyHeight - scrollBarWidth}px`,
      };
    } else if (props.fixedColumn === 'scroll') {
      const leftFixedColumns = [];
      const normalColumns = [];
      const rightFixedColumns = [];
      props.columns.forEach((item) => {
        if (!item.hidden) {
          if (item.fixed || leftFixedType.indexOf(item.type) !== -1) {
            leftFixedColumns.push(item);
          } else if (item.rightFixed) {
            rightFixedColumns.push(item);
          } else {
            normalColumns.push(item);
          }
        }
      });

      columns = leftFixedColumns.concat(normalColumns, rightFixedColumns);
      bodyWrapClassName = 'kuma-uxtable-body-scroll';
    } else {
      bodyWrapClassName = 'kuma-uxtable-body-no';
    }
    const rows = data.map((item, index) => {
      const renderProps = {
        columns,
        index,
        data,
        rowIndex: item.jsxid, // tree mode, rowIndex need think more, so use jsxid
        rowData: deepcopy(data[index]),
        isHover: props.currentHoverRow === index,
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
    });
    // const content = util.getIEVer() >= 8 ? rows : <QueueAnim>{rows}</QueueAnim>;
    return (
      <div className={bodyWrapClassName} ref={this.saveRef('root')} style={style}>
        {this.renderEmptyData()}
        {data.length > 0 ? <ul className={this.props.jsxprefixCls}>
          {rows}
        </ul> : null}
      </div>
    );
  }
}

Tbody.propTypes = {
  jsxprefixCls: React.PropTypes.string,
  fixedColumn: React.PropTypes.string,
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
  onScroll: React.PropTypes.func,
};

Tbody.defaultProps = {
  jsxprefixCls: 'kuma-uxtable-body',
  onScroll: () => {},
};

export default Tbody;
