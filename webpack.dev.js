var fs = require('fs');
var webpack = require('webpack');

// 扫描uxcore组件目录下的所有module
function getUxcoreModuleAlias() {
    var alias = {};

    // 判断是否存在uxcore目录
    if (!fs.existsSync('./uxcore')) return alias;

    var modules = fs.readdirSync('./uxcore');
    modules.forEach(function (name) {
        alias[name] = [process.cwd(), 'uxcore', name, 'src'].join('/');
    });
    return alias;
}

module.exports = {
    cache: false,
    entry: {
        demo: './demo/index'
    },
    output: {
        path: './dist',
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    devtool: '#source-map', // 这个配置要和output.sourceMapFilename一起使用
    module: {
        loaders: [
            {
                test: /\.js(x)*$/,
                // uxcore以外的modules都不需要经过babel解析
                exclude: function (path) {
                    var isNpmModule = !!path.match(/node_modules/);
                    var isUxcore = !!path.match(/node_modules[\/\\](@ali[\/\\])?uxcore/);
                    return isNpmModule & !isUxcore;
                },
                loader: 'es3ify-loader'
            },
            {

                test: /\.js(x)*$/,
                // uxcore以外的modules都不需要经过babel解析
                exclude: function (path) {
                    var isNpmModule = !!path.match(/node_modules/);
                    var isUxcore = !!path.match(/node_modules[\/\\](@ali[\/\\])?uxcore/);
                    return isNpmModule & !isUxcore;
                },
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015-loose', 'stage-1'],
                    plugins: [
                        'add-module-exports'
                    ]
                }
            }
        ]
    },
    resolve: {
       alias: getUxcoreModuleAlias()
    },
    externals: {
        react: 'var React', // 相当于把全局的React作为模块的返回 module.exports = React;
        'react-dom': 'var ReactDOM'
    },
    plugins: [
        new webpack.DefinePlugin({
          __LOCAL__: true, // 本地环境
          __DEV__:   true, // 日常环境
          __PRO__:   false // 生产环境
        }),
        new webpack.optimize.DedupePlugin()
    ]
};