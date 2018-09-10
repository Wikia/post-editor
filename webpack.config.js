const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const browsers = [
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 2 safari versions',
    'last 2 edge versions',
    'last 2 ios versions',
    'last 2 chromeandroid versions',
];
const isDevelopment = process.env.NODE_ENV === 'development';
const plugins = [];
let additionalOptions = {};

if (isDevelopment) {
    plugins.push(
        new HtmlWebpackPlugin({
            inject: 'head',
            template: 'index.html',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
    );

    additionalOptions = {
        serve: {
            port: 3000,
            hot: {
                port: 3001,
            },
        },
    };
}

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
        path: `${__dirname}/dist`,
        filename: isDevelopment ? 'post-editor.js' : 'post-editor.min.js',
        library: 'postEditor',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: `${__dirname}/src`,
                use: 'babel-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: isDevelopment,
                            hmr: isDevelopment,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDevelopment,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDevelopment,
                            plugins: () => [
                                autoprefixer({
                                    cascade: false,
                                    browsers: browsers.join(', '),
                                }),
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: 'preact-svg-loader',
            },
        ],
    },
    plugins,
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    ...additionalOptions,
};
