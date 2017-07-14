import Icon from 'uxcore-icon';
import Tooltip from 'uxcore-tooltip';
import React from 'react';

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
      <Icon name="tishi-full" />
    </Tooltip>
    );
};

MessageIcon.propTypes = {
  message: React.PropTypes.string,
};


export default MessageIcon;
