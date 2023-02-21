/**
 * Created by xy on 15/4/13.
 */
import assign from 'object-assign';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import util from '../util';
import HeaderCell from './HeaderCell';

const leftFixedType = ['checkboxSelector', 'radioSelector', 'treeIcon'];


class Header extends React.Component {
  static isFixedColumn = item => item.fixed || leftFixedType.indexOf(item.type) !== -1

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

  getScroller() {
    return this.scroller;
  }

  getFixedColumnsWidth() {
    let width = 0;
    const cellKeys = Object.keys(this).filter(item => /fixedCell\d/.test(item));
    cellKeys.forEach((key) => {
      if (this[key]) {
        width += this[key].getWidth();
      }
    });
    return width;
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  handleColumnOrder(column) {
    const me = this;
    const { orderColumnCB, activeColumn, orderType } = me.props;
    let type = 'desc';
    const typeMap = {
      desc: 'asc',
      asc: 'none',
      none: 'desc',
    };
    if (activeColumn && column.dataKey === activeColumn.dataKey && orderType) {
      type = typeMap[orderType];
    }
    if (orderColumnCB) {
      orderColumnCB(type, column);
    }
  }

  handleCheckBoxChange(e) {
    const v = e.target.checked;
    this.props.selectAll.apply(null, [v]);
  }

  handleColumnFilter(filterKeys, column) {
    this.props.onColumnFilter(filterKeys, column);
  }

  renderColumn(item, index, hasGroup, last) {
    const me = this;
    const {
      renderModel,
      checkboxColumnKey,
      prefixCls,
      orderType,
      activeColumn,
      checkStatus,
      filterColumns,
      tablePrefixCls,
      columnResizeable,
      handleColumnResize,
      isStickyHeader,
      fixedColumn,
      size,
      tooltipPlacement,
      localePack
    } = me.props;
    const cellProps = {
      localePack,
      column: item,
      index,
      hasGroup,
      last,
      renderModel,
      checkboxColumnKey,
      prefixCls,
      orderType,
      activeColumn,
      filterSelectedKeys: filterColumns[item.dataKey],
      checkStatus,
      tablePrefixCls,
      isStickyHeader,
      tooltipPlacement,
      ref: (c) => { if (Header.isFixedColumn(item)) { this[`fixedCell${index}`] = c; } },
      onCheckboxChange: (e) => { this.handleCheckBoxChange(e); },
      onColumnOrder: () => { this.handleColumnOrder(item); },
      onFilter: (filterKeys) => { this.handleColumnFilter(filterKeys, item); },
      columnResizeable: columnResizeable,
      handleColumnResize: handleColumnResize,
      isFixedHeader: fixedColumn === 'fixed' || fixedColumn === 'rightFixed',
      size
    };
    return (
      <HeaderCell {...cellProps} key={index} />
    );
  }

  renderColumns(_columns) {
    const me = this;
    const { prefixCls, hasGroup, size } = this.props;
    const columns = _columns.map((item, index) => {
      const last = (index === _columns.length - 1);
      if ({}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object') {
        // First determine whether the group should be rendered, if all columns
        // is hidden, the column group should not be rendered.
        const shouldRenderGroup = item.columns.some(column => !column.hidden);
        if (shouldRenderGroup) {
          return (
            <div
              className={`${prefixCls}-column-group`}
              key={index}
            >
              <div
                className={classnames(`${prefixCls}-group-name`, {
                  last,
                })}
                style={{
                  lineHeight: size === 'small' ? '40px' : '50px'
                }}
              >
                {item.group}
              </div>
              {item.columns.map((column, i) => {
                const shouldHideBorderRight = i === item.columns.length - 1 && last && me.props.fixedColumn !== 'fixed';
                return me.renderColumn(column, i, false, shouldHideBorderRight);
              })}
            </div>
          );
        }
        return null;
      }
      return me.renderColumn(item, index, hasGroup, last);
    });
    return columns;
  }

  render() {
    const { props } = this;
    const me = this;
    const headerStyle = {};
    const scrollBarWidth = util.measureScrollbar();
    let width = 0;
    let headerWrapClassName;
    let columns;


    if (props.fixedColumn === 'fixed') {
      columns = props.columns.filter((item) => {
        if (!item.hidden && Header.isFixedColumn(item)) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      headerWrapClassName = `${props.prefixCls}-fixed`;
      if (props.leftFixedMaxWidth) {
        assign(headerStyle, {
          marginBottom: `-${scrollBarWidth}px`,
          overflowX: scrollBarWidth ? 'scroll' : 'hidden',
        });
      }
    } else if (props.fixedColumn === 'rightFixed') {
      columns = props.columns.filter((item) => {
        if (item.rightFixed && !item.hidden) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      headerWrapClassName = `${props.prefixCls}-right-fixed`;
    } else if (props.fixedColumn === 'scroll') {
      const leftFixedColumns = [];
      const normalColumns = [];
      const rightFixedColumns = [];
      props.columns.forEach((item) => {
        if (!item.hidden) {
          if (Header.isFixedColumn(item)) {
            leftFixedColumns.push(item);
          } else if (item.rightFixed) {
            rightFixedColumns.push(item);
          } else {
            normalColumns.push(item);
          }
        }
      });

      columns = leftFixedColumns.concat(normalColumns, rightFixedColumns);

      assign(headerStyle, {
        marginBottom: `-${scrollBarWidth}px`,
        overflowX: scrollBarWidth ? 'scroll' : 'hidden',
      });
      headerWrapClassName = `${props.prefixCls}-scroll`;
    } else {
      ({ columns } = props);
      headerWrapClassName = `${props.prefixCls}-no`;
    }
    return (
      <div className={headerWrapClassName} style={headerStyle} ref={me.saveRef('root')}>
        <div className={props.prefixCls} ref={(c) => { this.scroller = c; }}>
          {me.renderColumns(columns)}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  handleColumnPickerChange: PropTypes.func,
  selectAll: PropTypes.func,
  prefixCls: PropTypes.string,
  onColumnFilter: PropTypes.func,
  filterColumns: PropTypes.object,
  isStickyHeader: PropTypes.bool,
  localePack: PropTypes.object,
};

Header.defaultProps = {
  handleColumnPickerChange: () => {},
  selectAll: () => {},
  prefixCls: 'kuma-uxtable-header',
  onColumnFilter: () => {},
  filterColumns: {},
  isStickyHeader: false,
  localePack: {}
};

export default Header;
