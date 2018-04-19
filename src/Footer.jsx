import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

export default class Footer extends React.Component {
  static displayName = 'Footer';
  static propTypes = {
    columns: PropTypes.array,
    footer: PropTypes.func,
    data: PropTypes.any,
    onScroll: PropTypes.func,
    from: PropTypes.string,
    rowGroupData: PropTypes.array,
  }

  static defaultProps = {
    onScroll: () => {},
  }

  componentDidMount() {
    const me = this;
    const { fixedColumn } = me.props;
    if (fixedColumn === 'scroll') {
      me.rootEl = me.root;
      me.scrollHandler = me.onScroll.bind(me);
      me.scrollListener = addEventListener(me.rootEl, 'scroll', me.scrollHandler);
    }
  }

  componentWillUnmount() {
    if (this.scrollListener) {
      this.scrollListener.remove();
    }
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

  processColumns() {
    const props = this.props;
    let columns;
    let width = 0;
    let footerWrapClassName;
    const leftFixedType = ['checkboxSelector', 'radioSelector', 'treeIcon'];
    if (props.fixedColumn === 'fixed') {
      columns = props.columns.filter((item) => {
        if ((item.fixed && !item.hidden) || (leftFixedType.indexOf(item.type) !== -1)) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      footerWrapClassName = 'kuma-uxtable-footer-fixed';
    } else if (props.fixedColumn === 'rightFixed') {
      columns = props.columns.filter((item) => {
        if (item.rightFixed && !item.hidden) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      footerWrapClassName = 'kuma-uxtable-footer-right-fixed';
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

      footerWrapClassName = 'kuma-uxtable-footer-scroll';
    } else {
      columns = props.columns;
      footerWrapClassName = 'kuma-uxtable-footer-no';
    }

    return { columns, footerWrapClassName, width };
  }

  renderColumn(item, index, last) {
    const { footer, data, from, rowGroupData } = this.props;
    let style = {
      width: item.width ? item.width : '100px',
      textAlign: item.align ? item.align : 'left',
    };
    if (['checkbox', 'checkboxSelector', 'radioSelector'].indexOf(item.type) !== -1) {
      style = {
        ...style,
        paddingRight: '4px',
        paddingLeft: '12px',
      };
    }
    return (
      <div
        key={index}
        className={classnames({
          'kuma-uxtable-cell': true,
        })}
        style={style}
      >
        {footer({ data, column: item, from, rowGroupData })}
      </div>
    );
  }


  renderColumns(_columns) {
    const me = this;
    const columns = _columns.map((item, index) => {
      const last = (index === _columns.length - 1);
      return me.renderColumn(item, index, last);
    });
    return columns;
  }

  render() {
    const { footerWrapClassName, columns } = this.processColumns();
    return (
      <div className={footerWrapClassName} ref={(c) => { this.root = c; }}>
        <div className="kuma-uxtable-footer">
          {this.renderColumns(columns)}
        </div>
      </div>
    );
  }
}

