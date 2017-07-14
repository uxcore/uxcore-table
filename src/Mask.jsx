/**
 * @author: zhouquan.yezq
 * @time : 8/12 2015
 */

import classnames from 'classnames';
import React from 'react';

const Mask = (props) => {
  const { visible, text } = props;
  const className = classnames({
    [props.prefixCls]: true,
    [`${props.prefixCls}-hide`]: !visible,
  });
  return (
    <div className={className}>
      <div className={`${props.prefixCls}-centerblk`}>
        <span className="kuma-loading" />
        <span className={`${props.prefixCls}-text`}>{text}</span>
      </div>
    </div>
  );
};

Mask.propTypes = {
  prefixCls: React.PropTypes.string,
  visible: React.PropTypes.bool,
  text: React.PropTypes.string,
};

Mask.defaultProps = {
  prefixCls: 'kuma-uxmask',
  text: '加载中',
};

export default Mask;
