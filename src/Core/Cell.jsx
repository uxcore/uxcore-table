import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Cell extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
  }
  static defaultProps = {
    prefixCls: 'kuma-uxtable-cell',
  }
  render() {
    const { prefixCls, className, children, style } = this.props;
    return (
      <div
        className={classnames({
          [prefixCls]: true,
          [className]: !!className,
        })}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Cell;
