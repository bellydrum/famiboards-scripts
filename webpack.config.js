const path = require('path');
const webpack = require('webpack');

const stylesHandler = 'style-loader';

const config = {
    entry: ['@babel/polyfill', './tmp/main.es6'],
    output: {
        filename: 'main.es6',
        path: path.resolve(__dirname, 'tmp'),
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.FAMIFEED_RSS_API_KEY': JSON.stringify('hky3ft9yw7mfystbg4u9nxwynvfdoheq0en1unuu'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    experiments: {
      topLevelAwait: true,
    },
};

module.exports = () => {
    config.mode = 'none';
    return config;
};
