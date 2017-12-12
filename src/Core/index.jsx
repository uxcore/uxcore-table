import React from 'react';
import propTypes from 'prop-types';
import Body from './Body';
import Header from './Header';

class Core extends React.Component {
  static propTypes = {
    columns: propTypes.array,
    data: propTypes.array,
  }

  render() {
    const { columns, data } = this.props;
    const commonProps = {
      columns,
    };
    const headerProps = {
      ...commonProps,
    };
    const bodyProps = {
      ...commonProps,
      data,
    };
    return (
      <div>
        <Header {...headerProps} />
        <Body {...bodyProps} />
      </div>
    );
  }
}

export default Core;
