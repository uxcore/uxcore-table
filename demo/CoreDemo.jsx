import React from 'react';
import Core from '../src/Core';

class CoreDemo extends React.Component {
  render() {
    const coreProps = {
      columns: [
        {
          title: '姓名',
          dataKey: 'name',
          width: 200,
        },
        {
          title: '城市',
          dataKey: 'city',
          width: 200,
        },
        {
          title: '邮箱',
          dataKey: 'email',
          width: 200,
        },
      ],
      data: [
        {
          name: 'jack',
          city: 'beijing',
          email: 'jack@163.com',
        },
        {
          name: 'john',
          city: 'new york',
          email: 'john@hotmail.com',
        },
      ],
    };
    return (
      <Core {...coreProps} />
    );
  }
}

export default CoreDemo;
