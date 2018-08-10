/**
 * Created by xy on 15/4/13.
 */
import classnames from 'classnames';
import assign from 'object-assign';
import deepEqual from 'lodash/isEqual';
import deepcopy from 'lodash/cloneDeep';
import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'uxcore-animate';
import Icon from 'uxcore-icon';
import Cell from './Cell';
import CheckBox from './Cell/CheckBox';
import util from './util';

class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    // 需要考虑的 prop 包括
    // columns, rowIndex(s => simple), rowData, index(s),
    // addRowClassName(f => function), rowSelection, subComp(no support), renderSubComp(f), actions
    // mode(s), renderModel(s), fixedColumn(s), levels(s),
    // visible(s), expandedKeys, checkboxColumnKey(s)
    const me = this;
    let shouldUpdate = false;

    ['rowIndex', 'index', 'mode', 'renderModel', 'fixedColumn',
      'levels', 'addRowClassName', 'renderSubComp', 'visible',
      'checkboxColumnKey', 'locale', 'isHover', 'treeLoadingIds'].forEach((item) => {
      if (me.props[item] !== nextProps[item]) {
        shouldUpdate = true;
      }
    });
    if (!shouldUpdate) {
      ['columns', 'rowData', 'rowSelection', 'actions', 'expandedKeys'].forEach((item) => {
        if (!deepEqual(me.props[item], nextProps[item])) {
          shouldUpdate = true;
        }
      });
    }
    return shouldUpdate;
  }

  getDom() {
    return this.root;
  }

  getInnerBox() {
    return this.container;
  }

  handleClick() {
    this.props.onClick();
  }

  handleMouseEnter() {
    this.props.root.handleRowHover(this.props.index, true);
  }

  handleMouseLeave() {
    this.props.root.handleRowHover(this.props.index, false);
  }

  handleDoubleClick(rowData) {
    const table = this.props.root;
    if (table.props.doubleClickToEdit) {
      table.editRow(deepcopy(rowData));
    }
  }

  handleTreeCheckChange(e) {
    const me = this;
    me.props.root.changeTreeSelected(e.target.checked, me.props.dataIndex || me.props.index);
  }

  showSubCompFunc() {
    const me = this;
    me.props.root.toggleSubComp(me.props.rowData);
  }

  toggleExpanded(e) {
    e.stopPropagation();
    const me = this;
    const { rowData } = me.props;
    me.props.root.toggleTreeExpanded(rowData);
  }

  renderSubComp() {
    const props = this.props;

    let sub;

    if (props.renderModel === 'tree') {
      return null;
    }
    if (props.subComp) {
      if (props.rowData.showSubComp) {
        const subComp = React.cloneElement(props.subComp, {
          passedData: this.props.rowData,
          parentHasCheckbox: !!this.props.rowSelection,
          parentHasCheck: !!this.props.rowSelection,
        });
        sub = (
          <div className="kuma-uxtable-subrow">
            {subComp}
                    </div>
        );
      }
    } else if (props.renderSubComp) {
      const subComp = props.renderSubComp(deepcopy(props.rowData));
      if (subComp && props.rowData.showSubComp) {
        sub = (
          <div className="kuma-uxtable-subrow">
            {subComp}
                    </div>
        );
      }
    }
    if (sub) {
      return sub;
    }
    return null;
  }

  renderChild() {
    const props = this.props;
    const me = this;
    let children = [];

    if (props.renderModel !== 'tree') {
      return children;
    }
    if (props.rowData.data) {
      props.rowData.data.forEach((node, index) => {
        const renderProps = assign({}, props, {
          level: me.props.level + 1,
          index,
          dataIndex: `${(me.props.dataIndex ? me.props.dataIndex : me.props.index)}-${index}`,
          rowData: node,
          rowIndex: node.jsxid,
          key: node.jsxid,
          showSubComp: false,
          visible: (props.expandedKeys.indexOf(props.rowData.jsxid) !== -1),
        });
        children.push(<Row {...renderProps} />);
      });

      const renderProps = {
        key: `treeRow${this.props.rowData.jsxid}`,
        className: 'kuma-uxtable-tree-row',
      };

      children = (
        <ul {...renderProps}>
          {children}
                </ul>
      );
    }

    return children;
  }

  renderExpandIcon(rowIndex, treeId) {
    let expandCollapseIcon;
    let _expandIconClass;
    const props = this.props;

    if (props.renderModel !== 'tree') {
      return false;
    }
    if (props.treeLoadingIds.indexOf(treeId) > -1) {
      expandCollapseIcon = (
        <span
          className="kuma-uxtable-expand-icon"
          data-index={rowIndex}
        >
          <Icon name="loading-icon-round" className={`${props.prefixCls}-tree-loading-icon`} usei />
        </span>
      );
    } else if (props.rowData.data) {
      _expandIconClass = {
        'kuma-icon': true,
        'kuma-icon-triangle-right': true,
        expanded: (props.expandedKeys.indexOf(props.rowData.jsxid) !== -1),
      };
      expandCollapseIcon = (
        <span
          className="kuma-uxtable-expand-icon"
          data-type={props.fixedColumn}
          data-index={rowIndex}
          onClick={this.toggleExpanded.bind(this)}
        >
          <i className={classnames(_expandIconClass)} />
        </span>
      );
    } else {
      expandCollapseIcon = (
        <span className="kuma-uxtable-emptyicon" />
      );
    }
    return expandCollapseIcon;
  }

  renderIndent() {
    const indents = [];
    if (this.props.renderModel === 'tree') {
      for (let i = 0; i < this.props.level - 1; i++) {
        const renderProps = {
          className: 'indent',
          key: `indent${i}`,
        };
        indents.push(<span {...renderProps} />);
      }
    }

    return indents;
  }

  renderTreeRowSelector() {
    if (this.props.renderModel !== 'tree' || !this.props.checkboxColumnKey) {
      return false;
    }
    const me = this;
    const { rowData, checkboxColumnKey, prefixCls } = me.props;
    const isChecked = rowData[checkboxColumnKey];
    let isHalfChecked = false;
    if (!isChecked) {
      isHalfChecked = util.isRowHalfChecked(rowData, checkboxColumnKey);
    }
    return (
      <CheckBox
        checked={isChecked}
        halfChecked={isHalfChecked}
        className={`${prefixCls}-tree-selector`}
        onChange={me.handleTreeCheckChange.bind(me)}
      />
    );
  }

  render() {
    const me = this;
    const props = this.props;
    let _columns = [];
    let _style = {};
    const otherCls = props.addRowClassName(deepcopy(props.rowData));

    if (!this.props.visible) {
      _style = {
        display: 'none',
      };
    }

    props.columns.forEach((column) => {
      if ('group' in column) {
        _columns = _columns.concat(column.columns);
      } else {
        _columns.push(column);
      }
    });

    let firstVisableColumn = 0;

    return (
      <li
        className={classnames({
          [this.props.prefixCls]: true,
          [`${this.props.prefixCls}-hover`]: props.isHover,
          [otherCls]: !!otherCls,
          even: (props.index % 2 === 1),
          last: props.last,
        })}
        style={_style}
        onClick={() => {
          this.handleClick(props.rowData);
        }}
        onDoubleClick={() => {
          this.handleDoubleClick(props.rowData);
        }}
        onMouseEnter={() => {
          this.handleMouseEnter();
        }}
        onMouseLeave={() => {
          this.handleMouseLeave();
        }}
        ref={(c) => { this.root = c; }}
      >
        <div
          className={`${this.props.prefixCls}-cells`}
          ref={(c) => { this.container = c; }}
          style={{
            cursor: (props.toggleSubCompOnRowClick || props.toggleTreeExpandOnRowClick) ? 'pointer' : 'default',
          }}
          onClick={(e) => {
            if (props.toggleSubCompOnRowClick) {
              this.showSubCompFunc(props.rowData);
            }
            if (props.toggleTreeExpandOnRowClick) {
              this.toggleExpanded(e);
            }
          }}
        >
          {_columns.map((item, index) => {
            const rowSelectorInTreeMode = (['checkboxSelector', 'radioSelector'].indexOf(item.type) !== -1)
              && (props.renderModel === 'tree');
            if (item.hidden || rowSelectorInTreeMode) {
              return null;
            }
            firstVisableColumn += 1;
            let hasSubComp = !!props.subComp;
            if (!hasSubComp) {
              hasSubComp = props.renderSubComp
                ? !!props.renderSubComp(deepcopy(props.rowData))
                : false;
            }
            const renderProps = {
              key: `cell${index}`,
              column: item,
              root: props.root,
              locale: props.locale,
              rowData: props.rowData,
              rowIndex: props.rowIndex,
              index: props.index,
              changeSelected: props.changeSelected,
              rowSelection: props.rowSelection,
              actions: props.actions,
              mode: props.mode,
              bodyNode: props.bodyNode,
              handleDataChange: props.handleDataChange,
              toggleSubCompOnRowClick: props.toggleSubCompOnRowClick,
              attachCellField: props.attachCellField,
              detachCellField: props.detachCellField,
              last: (index === _columns.length - 1),
              cellIndex: index,
              hasSubComp,
              showSubCompCallback: me.showSubCompFunc.bind(me),
            };

            if (firstVisableColumn === 1) {
              return (<Cell {...renderProps} >
                {me.renderIndent()}
                {me.renderExpandIcon(props.rowIndex, props.rowData.__treeId__)}
                {me.renderTreeRowSelector()}
              </Cell>);
            }
            // if have vertical data structure, how to process it
            return <Cell {...renderProps} />;
          })}
        </div>
        {me.renderChild()}
        <Animate
          component=""
          animation={{
            enter: (node, done) => { util.toggleHeightAnim(node, true, done); },
            leave: (node, done) => { util.toggleHeightAnim(node, false, done); },
          }}
        >
          {this.renderSubComp()}
        </Animate>
      </li>
    );
  }
}


Row.propTypes = {
  prefixCls: PropTypes.string,
  renderModel: PropTypes.string,
  checkboxColumnKey: PropTypes.string,
  root: PropTypes.any,
  rowData: PropTypes.object,
  rowSelection: PropTypes.object,
  showSubComp: PropTypes.bool,
  last: PropTypes.bool,
  visible: PropTypes.bool,
  isHover: PropTypes.bool,
  level: PropTypes.number,
  levels: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  index: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  height: PropTypes.number,
};

Row.defaultProps = {
  prefixCls: 'kuma-uxtable-row',
  showSubComp: false,
  onClick: () => {},
  onMouseEnter: () => {},
  addRowClassName: () => {},
};

export default Row;
