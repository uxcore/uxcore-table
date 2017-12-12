import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Cell from './Cell';

/* eslint-disable class-methods-use-this */

class Header extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
  }
  renderColumn({ item, style, className, index }) {
    const content = (typeof item.title === 'function') ? item.title() : item.title;
    const title = (typeof item.title === 'function') ? undefined : item.title;
    const v = <span title={title}>{content}</span>;
    const cellProps = {
      className,
      key: index,
      style: {
        width: item.width,
      },
    };
    return (
      <Cell {...cellProps}>
        {v}
      </Cell>
    );
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
              {item.columns.map((column, i) => me.renderColumn(column, i))}
            </div>
          );
        }
        return null;
      }
      return me.renderColumn({ item, index });
    });
    return columns;
  }
  render() {
    return (
      <div className="kuma-uxtable-header-wrapper">
        <div className={'kuma-uxtable-header'}>
          {this.renderColumns(this.props.columns)}
        </div>
      </div>
    );
  }
}

export default Header;
