import Icon from 'uxcore-icon';
import Tooltip from 'uxcore-tooltip';
import React from 'react';
import PropTypes from 'prop-types';

const MessageIcon = (props) => {
  if (!props.message) {
    return <noscript />;
  }
  return (
    <Tooltip
      overlay={<div className="kuma-uxtable-column-message">
        {props.message}
      </div>}
      placement="top"
    >
      <Icon usei name="xinxitishicopy" className={`${props.prefixCls}-icon`} />
    </Tooltip>
  );
};

MessageIcon.propTypes = {
  message: PropTypes.string,
  prefixCls: PropTypes.string,
};


export default MessageIcon;
