/**
 * Created by xy on 15/4/13.
 */

import deepcopy from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { hasClass } from 'rc-util/lib/Dom/class';
import EmptyData from 'uxcore-empty-data';
import Collapse from 'uxcore-collapse';
import Row from './Row';
import util from './util';
import Footer from './Footer';


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
    this.adjustMultilineFixedRowHeight();
    this.ieVer = util.getIEVer();
  }

  componentDidUpdate(prevProps) {
    const isFixedTable = ['fixed', 'rightFixed'].indexOf(this.props.fixedColumn) !== -1;
    if (isFixedTable && !isEqual(prevProps.data, this.props.data)) {
      this.adjustMultilineFixedRowHeight();
    }
  }


  componentWillUnmount() {
    const me = this;
    me.scrollListener.remove();
    me.removeScrollTimer();
  }


  onScroll() {
    const me = this;
    const { fixedColumn } = me.props;
    me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop, fixedColumn);
    me.removeScrollTimer();
    me.scrollEndTimer = setTimeout(() => {
      me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop, fixedColumn);
    }, 50);
  }

  getDom() {
    return this.root;
  }

  getRow(index) {
    return this[`row${index}`];
  }

  getRowGroupName(name) {
    const { rowGroupColumn = {}, localePack } = this.props;
    const data = this.rowGroupMap[name];
    if (name === '__others__') {
      return localePack[name];
    }
    return rowGroupColumn.render ? rowGroupColumn.render(name, deepcopy(data)) : name;
  }

  removeScrollTimer() {
    const me = this;
    if (me.scrollEndTimer) {
      clearTimeout(me.scrollEndTimer);
      me.scrollEndTimer = null;
    }
  }

  adjustRowsHeight(index) {
    const mainBody = this.props.root.getMainBody();
    const mainTableRow = mainBody.getRow(index);
    if (mainTableRow) {
      const mainTableRowNode = mainTableRow.getDom();

      if (hasClass(mainTableRowNode, 'multiline')) {
        const height = mainTableRowNode.clientHeight;
        const row = this.getRow(index);
        const rowNode = row.getInnerBox();
        rowNode.style.height = `${height}px`;
      }
    }
  }

  adjustMultilineFixedRowHeight() {
    const isFixedTable = ['fixed', 'rightFixed'].indexOf(this.props.fixedColumn) !== -1;
    if (isFixedTable) {
      const mainBody = this.props.root.getMainBody();
      if (mainBody) {
        if (!this.props.rowGroupKey) {
          this.props.data.forEach((item, index) => {
            this.adjustRowsHeight(index);
          });
        } else {
          this.rowGroupArr.forEach((rowGroupName, i) => {
            this.rowGroupMap[rowGroupName].items.forEach((item, j) => {
              const index = `${i}-${j}`;
              this.adjustRowsHeight(index);
            });
          });
        }
      }
    }
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
      const defaultEmptyText = (
        <div style={{ lineHeight: 2 }}>
          {this.props.localePack.default_empty_text}
        </div>
      );
      return (
        <EmptyData style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.emptyText || defaultEmptyText}
        </EmptyData>
      );
    }
    return null;
  }

  renderRowGroupFooter(rowGroupData) {
    const {
      hasFooter, showRowGroupFooter, data, columns, footer, fixedColumn,
    } = this.props;
    if (!hasFooter || !showRowGroupFooter) {
      return null;
    }
    const footerProps = {
      data,
      columns,
      footer,
      rowGroupData,
      from: 'rowGroup',
      fixedColumn,
    };
    return <Footer {...footerProps} />;
  }

  render() {
    const me = this;
    const { props } = me;
    const { data } = props;
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

      if (props.leftFixedMaxWidth) {
        style = {
          ...style,
          overflowX: 'auto',
        };
      }
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
      if (props.hasFooter) {
        style = {
          ...style,
          marginBottom: `-${scrollBarWidth}px`,
          overflowX: 'scroll',
        };
      }
    } else {
      bodyWrapClassName = 'kuma-uxtable-body-no';
    }
    let rows = [];
    const commonProps = {
      columns,
      data,
      toggleSubCompOnRowClick: props.toggleSubCompOnRowClick,
      toggleTreeExpandOnRowClick: props.toggleTreeExpandOnRowClick,
      root: props.root,
      locale: props.locale,
      localePack: props.localePack,
      subComp: props.subComp,
      actions: props.actions,
      mode: props.mode,
      renderModel: props.renderModel,
      fixedColumn: props.fixedColumn,
      level: 1,
      treeLoadingIds: props.treeLoadingIds,
      levels: props.levels,
      expandedKeys: props.expandedKeys,
      renderSubComp: props.renderSubComp,
      changeSelected: props.changeSelected,
      checkboxColumnKey: props.checkboxColumnKey,
      addRowClassName: props.addRowClassName,
      rowSelection: props.rowSelection,
      handleDataChange: props.handleDataChange,
      attachCellField: props.attachCellField,
      detachCellField: props.detachCellField,
      prefixCls: `${props.tablePrefixCls}-row`,
      tablePrefixCls: props.tablePrefixCls,
      visible: true,
      bodyNode: this.root,
      getTooltipContainer: props.getTooltipContainer,
      expandIconType: props.expandIconType
    };
    // let needEmptyIconIntree = false;
    // if (props.renderModel === 'tree') {
    //   needEmptyIconIntree = !!data.filter(rowData => {console.log(setTimeout(0));return rowData.data}).length;
    // }

    if (!this.props.rowGroupKey) {
      rows = data.map((item, index) => {
        const isLastItem = index === data.length - 1;

        // 如果是树形模式并且当前行有子行且子行属于展开状态，不要加 last 样式
        let last = isLastItem;
        if ({}.hasOwnProperty.call(item, 'data') && Array.isArray(item.data) && item.data.length > 0) {
          last = false;
        }

        const renderProps = {
          ...commonProps,
          index,
          rowIndex: item.jsxid, // tree mode, rowIndex need think more, so use jsxid
          rowData: item,
          isHover: props.currentHoverRow === index,
          key: `row${index}`,
          ref: (c) => {
            this[`row${index}`] = c;
          },
          last,
          isParentLast: last,
          allowActionEventDefault: props.allowActionEventDefault
        };
        return <Row {...renderProps} />;
      });
    } else {
      this.rowGroupMap = {};
      this.rowGroupArr = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let rowGroupName = item[this.props.rowGroupKey];
        if (!rowGroupName) {
          rowGroupName = '__others__';
        }
        if (typeof rowGroupName !== 'string') {
          console.error('Table: the corresponding data\'s type of rowGroupKey should be a string!');
          this.rowGroupMap = {};
          this.rowGroupArr = [];
          break;
        }
        if (!Object.prototype.hasOwnProperty.call(this.rowGroupMap, rowGroupName)) {
          this.rowGroupMap[rowGroupName] = {
            data: item,
            items: [],
          };
          this.rowGroupArr.push(rowGroupName);
        }
        this.rowGroupMap[rowGroupName].items.push(item);
      }

      let defaultKeys = ['0']
      let ds = props.defaultRowGroupActiveKeys
      if (ds) {
        if (typeof ds === 'number' && ds > 0) {
          defaultKeys = [...Array(ds)].map((item, index) => `${index}`)
        } else if (ds.length && ds.splice) {
          defaultKeys = ds.map(item => `${item}`)
        }
      }

      rows = (
        <Collapse activeKey={props.rowGroupActiveKey || defaultKeys} className={`${props.prefixCls}-collapse`} onChange={(key, activeKey) => {props.onCollapseChange(activeKey, key, props.root); }}>
          {this.rowGroupArr.map((rowGroupName, i) => (
            <Collapse.Panel header={this.getRowGroupName(rowGroupName)} key={i}>
              {this.rowGroupMap[rowGroupName].items.map((item, j) => {
                const isLastItem = i === this.rowGroupArr.length - 1 && j === this.rowGroupMap[rowGroupName].items.length - 1;

                // 如果是树形模式并且当前行有子行且子行属于展开状态，不要加 last 样式
                let last = isLastItem;
                if ({}.hasOwnProperty.call(item, 'data') && Array.isArray(item.data) && item.data.length > 0) {
                  last = false;
                }

                const index = `${i}-${j}`;
                const renderProps = {
                  ...commonProps,
                  index,
                  rowIndex: item.jsxid, // tree mode, rowIndex need think more, so use jsxid
                  rowData: item,
                  isHover: props.currentHoverRow === index,
                  key: `row${index}`,
                  ref: (c) => {
                    this[`row${index}`] = c;
                  },
                  last,
                  isParentLast: isLastItem,
                };
                return <Row {...renderProps} />;
              })}
              {this.renderRowGroupFooter(this.rowGroupMap[rowGroupName])}
            </Collapse.Panel>
          ))}
        </Collapse>
      );
    }

    return (
      <div className={bodyWrapClassName} ref={this.saveRef('root')} style={style}>
        {this.renderEmptyData()}
        {data.length > 0 ? (
          <ul className={this.props.prefixCls}>
            {rows}
          </ul>
        ) : null}
      </div>
    );
  }
}

Tbody.propTypes = {
  columns: PropTypes.any,
  prefixCls: PropTypes.string,
  fixedColumn: PropTypes.string,
  locale: PropTypes.string,
  data: PropTypes.array,
  emptyText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  mask: PropTypes.bool,
  onScroll: PropTypes.func,
  root: PropTypes.any,
  rowGroupKey: PropTypes.string,
  hasFooter: PropTypes.bool,
  showRowGroupFooter: PropTypes.bool,
  footer: PropTypes.func,
  rowGroupColumn: PropTypes.object,
  localePack: PropTypes.object,
};

Tbody.defaultProps = {
  prefixCls: 'kuma-uxtable-body',
  onScroll: () => { },
  columns: undefined,
  fixedColumn: undefined,
  locale: undefined,
  data: undefined,
  emptyText: '',
  height: undefined,
  mask: undefined,
  root: undefined,
  rowGroupKey: undefined,
  hasFooter: undefined,
  showRowGroupFooter: undefined,
  footer: undefined,
  rowGroupColumn: undefined,
  localePack: {},
};

export default Tbody;
