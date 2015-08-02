module.exports = [
    {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: [
            // 'react-hot',
            'babel-loader'
        ]
    },
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
            // 'react-hot',
            'babel-loader'
        ]
    },
    {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }
]