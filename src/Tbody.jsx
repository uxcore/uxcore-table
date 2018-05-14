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
import i18n from './i18n';
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
    // if (this.scrollRafer) {
    //   raf.cancel(this.scrollRafer);
    //   this.scrollRafer = null;
    // }
  }


  onScroll() {
    const me = this;
    const { fixedColumn } = me.props;
    me.props.onScroll(me.rootEl.scrollLeft, me.rootEl.scrollTop, fixedColumn);
    // this.scrollRafer = requestAnimationFrame(() => {
    // });
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
    if (name === '__others__') {
      return i18n[this.props.locale][name];
    }
    return name;
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
            this.rowGroupMap[rowGroupName].forEach((item, j) => {
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
      const defaultEmptyText = <div style={{ lineHeight: 2 }}>{i18n[this.props.locale]['default-empty-text']}</div>;
      return (
        <EmptyData style={{ marginTop: '20px', marginBottom: '20px' }}>
          {this.props.emptyText || defaultEmptyText}
        </EmptyData>
      );
    }
    return null;
  }

  renderRowGroupFooter(rowGroupData) {
    const { hasFooter, showRowGroupFooter, data, columns, footer, fixedColumn } = this.props;
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
      root: props.root,
      locale: props.locale,
      subComp: props.subComp,
      actions: props.actions,
      mode: props.mode,
      renderModel: props.renderModel,
      fixedColumn: props.fixedColumn,
      level: 1,
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
      visible: true,
      bodyNode: this.root,
    };
    if (!this.props.rowGroupKey) {
      rows = data.map((item, index) => {
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
          last: (index === data.length - 1),
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
          this.rowGroupMap[rowGroupName] = [];
          this.rowGroupArr.push(rowGroupName);
        }
        this.rowGroupMap[rowGroupName].push(item);
      }
      rows = (
        <Collapse activeKey={props.rowGroupActiveKey || '0'} className={`${props.jsxprefixCls}-collapse`} onChange={(key, activeKey) => { props.onCollapseChange(activeKey); }}>
          {this.rowGroupArr.map((rowGroupName, i) => (
            <Collapse.Panel header={this.getRowGroupName(rowGroupName)} key={i}>
              {this.rowGroupMap[rowGroupName].map((item, j) => {
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
                  last: i === this.rowGroupArr.length - 1
                    && j === this.rowGroupMap[rowGroupName].length - 1,
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
        {data.length > 0 ? <ul className={this.props.jsxprefixCls}>
          {rows}
        </ul> : null}
      </div>
    );
  }
}

Tbody.propTypes = {
  columns: PropTypes.any,
  jsxprefixCls: PropTypes.string,
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
};

Tbody.defaultProps = {
  jsxprefixCls: 'kuma-uxtable-body',
  onScroll: () => {},
};

export default Tbody;
