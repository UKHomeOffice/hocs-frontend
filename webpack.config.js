const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('webpack-assets-manifest');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const AutoPrefixer = require('autoprefixer');

const browserConfig = env => {
    const mode = env.NODE_ENV;
    return {
        entry: {
            vendor: [
                'react',
                'react-dom',
                'react-router-dom'
            ],
            main: './src/browser/index.js'
        },
        devtool: 'sourcemap',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: mode === 'development' ? 'public/js/[name].js' : 'public/js/[name]-[hash].js',
            sourceMapFilename: '[file].map',
            chunkFilename: mode === 'development' ? 'public/js/[name].js' : 'public/js/[name]-[chunkHash].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        {
                            loader: ExtractTextPlugin.loader
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: { plugins: [AutoPrefixer()] }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    path.resolve(__dirname, 'node_modules'),
                                    path.resolve(__dirname, './src/styles'),
                                ]
                            }
                        }
                    ]

                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: true,
                cacheGroups: {
                    default: false,
                    vendors: {
                        chunks: 'all',
                        name: 'vendor',
                        test: /[\\/]node_modules[\\/]/,
                    }
                }
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                __isBrowser__: 'true'
            }),
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true
            }),
            new ExtractTextPlugin({
                filename: mode === 'development' ? 'public/styles/[name].css' : 'public/styles/[name]-[hash].css'
            }),
            new AssetsPlugin({
                output: 'assets.json',
                writeToDisk: true,
                customize: (entry) => {
                    /* eslint-disable-next-line no-console */
                    console.log(entry);
                    entry.type = entry.key.slice(entry.key.lastIndexOf('.') + 1);
                    entry.key = entry.key.slice(0, entry.key.lastIndexOf('.'));
                    entry.value = entry.value.slice(entry.value.lastIndexOf('/') + 1);
                    const { key, value, type } = entry;
                    return {
                        key: `${key}.${type}`,
                        value: {
                            key,
                            type,
                            asset: value
                        }
                    };
                },
                transform: (assets) => {
                    const js = Object.keys(assets).reduce((r, a) => {
                        if (assets[a].type === 'js') {
                            const { key, asset } = assets[a];
                            r[key] = asset;
                        }
                        return r;
                    }, {});
                    const css = Object.keys(assets).reduce((r, a) => {
                        if (assets[a].type === 'css') {
                            const { key, asset } = assets[a];
                            r[key] = asset;
                        }
                        return r;
                    }, {});
                    return {
                        js, css
                    };
                }
            })
        ]
    };
};


const serverConfig = {
    entry: {
        app: './src/shared/index.jsx'
    },
    output: {
        path: __dirname,
        filename: 'build/server/[name].server.js',
        libraryTarget: 'commonjs'
    },
    module: {
        rules: [
            { test: [/\.(js)$/, /\.(jsx)$/], loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.scss$/, loader: 'css-loader/locals' }
        ]
    },
    // resolve: {
    //     alias: {
    //         react: path.resolve(__dirname, 'node_modules/react'),
    //         'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    //     }
    // },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom'
    }
};


module.exports = [browserConfig, serverConfig];