/**
 * @author: zhouquan.yezq
 * @time : 8/12 2015
 */

import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

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
        <span className={`${props.prefixCls}-text`}>
          {text}
        </span>
      </div>
    </div>
  );
};

Mask.propTypes = {
  prefixCls: PropTypes.string,
  visible: PropTypes.bool,
  text: PropTypes.string,
};

Mask.defaultProps = {
  prefixCls: 'kuma-uxmask',
  text: '加载中',
  visible: false,
};

export default Mask;
