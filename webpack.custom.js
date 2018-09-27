const modifyVars = require('kuma-base/jsvars/orange');

/* eslint-disable no-param-reassign */
module.exports = (config) => {
  config.module.rules.forEach((rule) => {
    if (rule.test.toString() === /\.less$/.toString()) {
      rule.use = [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            modifyVars: {
              ...modifyVars,
              // '@__tablePrefixCls': 'aaa',
            },
          },
        },
      ];
    }
  });
};
