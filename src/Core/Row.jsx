import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Animate from 'uxcore-animate';
import Cell from './Cell';
import util from '../util';

class Row extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    isHover: PropTypes.bool,
    index: PropTypes.number,
    last: PropTypes.bool,
    style: PropTypes.object,
    columns: PropTypes.array,
    data: PropTypes.object,
    renderSubComp: PropTypes.func,
  }
  static defaultProps = {
    prefixCls: 'kuma-uxtable-row',
    renderSubComp: () => {},
  }

  getDom() {
    return this.root;
  }

  renderSubComp() {
    const { renderSubComp, data } = this.props;
    const sub = renderSubComp(data);
    if (sub) {
      return sub;
    }
    return null;
  }

  render() {
    const { style, prefixCls, isHover, index, last, columns, data } = this.props;
    return (
      <li
        className={classnames({
          [prefixCls]: true,
          [`${prefixCls}-hover`]: isHover,
          even: (index % 2 === 1),
          last,
        })}
        style={style}
        ref={(c) => { this.root = c; }}
      >
        <div className={`${this.props.prefixCls}-cells`} ref={(c) => { this.container = c; }}>
          {columns.map((item, i) => {
            const renderProps = {
              children: data[item.dataKey],
              key: i,
              style: {
                width: item.width,
              },
            };
            return <Cell {...renderProps} />;
          })}
        </div>
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

export default Row;
