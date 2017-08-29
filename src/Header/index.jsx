/**
 * Created by xy on 15/4/13.
 */
import assign from 'object-assign';
import classnames from 'classnames';
import React from 'react';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import CheckBox from '../Cell/CheckBox';
import util from '../util';
import MessageIcon from './MessageIcon';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pickerDisplay: false,
    };
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

  getScroller() {
    return this.scroller;
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

  renderOrderIcon(column) {
    const me = this;
    const { orderType, activeColumn } = me.props;
    if (column.ordered) {
      const desc = 'triangle-down';
      const asc = 'triangle-up';
      const isActive = activeColumn && activeColumn.dataKey === column.dataKey;
      return (
        <span className="kuma-uxtable-h-sort" onClick={me.handleColumnOrder.bind(me, column)}>
          <i
            className={classnames({
              [`kuma-icon kuma-icon-${asc}`]: true,
              active: isActive && orderType === 'asc',
            })}
          />
          <i
            className={classnames({
              [`kuma-icon kuma-icon-${desc}`]: true,
              active: isActive && orderType === 'desc',
            })}
          />
        </span>
      );
    }
    return null;
  }

  renderRequired(item) {
    const { prefixCls } = this.props;
    if (item.required) {
      return <span className={`${prefixCls}-item-required`}>* </span>;
    }
    return null;
  }

  renderColumn(item, index, hasGroup, last) {
    const me = this;
    const { renderModel, prefixCls } = me.props;
    const rowSelectorInTreeMode = (['checkboxSelector', 'radioSelector'].indexOf(item.type) !== -1)
      && (renderModel === 'tree');
    if (item.hidden || rowSelectorInTreeMode) {
      me.firstIndex = index + 1;
      return null;
    }
    const noBorderColumn = ['jsxchecked', 'jsxtreeIcon', 'jsxwhite'];
    const style = {
      width: item.width ? item.width : 100,
      maxWidth: item.width ? item.width : 100,
      minWidth: item.width ? item.width : 100,
      textAlign: item.align ? item.align : 'left',
    };
    let v;
    if (hasGroup) {
      assign(style, {
        height: 100,
        lineHeight: '100px',
      });
    }

    if (item.type === 'checkbox' || item.type === 'checkboxSelector') {
      assign(style, {
        paddingRight: 4,
        paddingLeft: 12,
        width: item.width ? item.width : 92,
      });

      const checkBoxProps = {
        ref: me.saveRef('checkbox'),
        checked: me.props.checkStatus.isAllChecked,
        halfChecked: me.props.checkStatus.isHalfChecked,
        disable: me.props.checkStatus.isAllDisabled,
        onChange: me.handleCheckBoxChange.bind(me),
      };

      v = <CheckBox {...checkBoxProps} />;
    } else {
      const content = (typeof item.title === 'function') ? item.title() : item.title;
      const title = (typeof item.title === 'function') ? undefined : item.title;
      v = <span title={title}>{content}</span>;
    }

    if (noBorderColumn.indexOf(item.dataKey) !== -1 || last) {
      assign(style, {
        borderRight: 'none',
      });
    }

    return (
      <div
        key={index}
        className={classnames({
          'kuma-uxtable-cell': true,
          'show-border': me.props.showHeaderBorder,
        })}
        style={style}
      >
        <div className="default-cell">
          {me.renderIndent(index)}
          {me.renderRequired(item)}
          {v}
          <MessageIcon message={item.message} prefixCls={`${prefixCls}-msg`} />
          {me.renderOrderIcon(item)}
        </div>
      </div>
    );
  }

  renderIndent(index) {
    if (this.firstIndex !== index) {
      return null;
    }
    const me = this;
    const { renderModel, checkboxColumnKey } = me.props;
    if (renderModel === 'tree') {
      return (
        <span
          className={classnames({
            indent: true,
            hasCheck: checkboxColumnKey,
          })}
        />
      );
    }
    return null;
  }


  renderColumns(_columns) {
    const me = this;
    const columns = _columns.map((item, index) => {
      const last = (index === _columns.length - 1);
      if ({}.hasOwnProperty.call(item, 'columns') && typeof item.columns === 'object') {
        // First determine whether the group should be rendered, if all columns
        // is hidden, the column group should not be rendered.
        const shouldRenderGroup = item.columns.some(column => !column.hidden);
        if (shouldRenderGroup) {
          return (
            <div
              className="kuma-uxtable-header-column-group"
              key={index}
            >
              <div
                className={classnames('kuma-uxtable-header-group-name', {
                  last,
                })}
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
      return me.renderColumn(item, index, me.hasGroup, last);
    });
    return columns;
  }

  render() {
    const props = this.props;
    const me = this;
    const headerStyle = {};
    const leftFixedType = ['checkboxSelector', 'radioSelector', 'treeIcon'];
    const scrollBarWidth = util.measureScrollbar();
    let width = 0;
    let headerWrapClassName;
    let columns;


    if (props.fixedColumn === 'fixed') {
      columns = props.columns.filter((item) => {
        if ((item.fixed && !item.hidden) || (leftFixedType.indexOf(item.type) !== -1)) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      headerWrapClassName = 'kuma-uxtable-header-fixed';
    } else if (props.fixedColumn === 'rightFixed') {
      columns = props.columns.filter((item) => {
        if (item.rightFixed && !item.hidden) {
          width = parseInt(item.width, 10) + width;
          return true;
        }
        return false;
      });
      headerWrapClassName = 'kuma-uxtable-header-right-fixed';
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

      assign(headerStyle, {
        marginBottom: `-${scrollBarWidth}px`,
        overflowX: scrollBarWidth ? 'scroll' : 'hidden',
        // width: typeof props.width === 'number' ? props.width - 3 : props.width,
        // minWidth: typeof props.width === 'number' ? props.width - 3 : props.width,
      });
      headerWrapClassName = 'kuma-uxtable-header-scroll';
    } else {
      columns = props.columns;
      headerWrapClassName = 'kuma-uxtable-header-no';
    }
    me.hasGroup = false;
    for (let i = 0; i < columns.length; i++) {
      if ('group' in columns[i]) {
        me.hasGroup = true;
        break;
      }
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
  handleColumnPickerChange: React.PropTypes.func,
  selectAll: React.PropTypes.func,
  prefixCls: React.PropTypes.string,
};

Header.defaultProps = {
  prefixCls: 'kuma-uxtable-header',
};

export default Header;
