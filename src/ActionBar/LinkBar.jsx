import React from 'react';
import PropTypes from 'prop-types';

class LinkBar extends React.Component {
  renderActionBtn(item, index, last) {
    const me = this;
    const itemProps = {
      onClick: item.callback || (() => {}),
    };
    let action;
    const cutOff = <div className={`${me.props.prefixCls}-cutoff`} />;
    if (!!item.render && typeof item.render === 'function') {
      action = <div {...itemProps}>{item.render(item.title)}</div>;
    } else {
      action = <a {...itemProps}>{item.title}</a>;
    }

    return (
      <div className={`${me.props.prefixCls}-item`} key={index}>
        {action}
        {last ? null : cutOff}
      </div>
    );
  }


  render() {
    const me = this;
    const { config, prefixCls } = me.props;
    return (
      <div className={prefixCls}>
        {config.map((item, index) => me.renderActionBtn(item, index, index === config.length - 1))}
      </div>
    );
  }
}

LinkBar.propTypes = {
  prefixCls: PropTypes.string,
  config: PropTypes.array,
};
LinkBar.defaultProps = {
  prefixCls: 'kuma-uxtable-linkbar',
  config: [],
};
LinkBar.displayName = 'LinkBar';

export default LinkBar;

