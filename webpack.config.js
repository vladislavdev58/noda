const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const filename = ext => `[name].${ext}`

const cssLoaders = extra => {
    const loaders = [MiniCssExtractPlugin.loader, 'css-loader']

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `js/${filename('js')}`
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    optimization: optimization(),
    devServer: {
        watchFiles: [path.resolve(__dirname, 'src')],
        port: 8080,
        open: true,
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: false
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/static'),
                    to: path.resolve(__dirname, 'dist/static'),
                    noErrorOnMissing: true,
                    globOptions: {
                        dot: true,
                        ignore: ['**/*.md']
                    },
                },
                // {
                //     from: path.resolve(__dirname, 'src/assets'),
                //     to: path.resolve(__dirname, 'dist/assets'),
                //     noErrorOnMissing: true,
                //     globOptions: {
                //         dot: true,
                //         ignore: ['**/*.md']
                //     },
                // }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: `css/${filename('css')}`
        }),
        new ESLintPlugin({
            extensions: ['js', 'css']
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript']
                    }
                }
            }
        ]
    }

}