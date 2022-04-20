const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPrefixer = require('autoprefixer');

const browserConfig = env => {
    const mode = env.NODE_ENV;
    return {
        entry: {
            main: './src/browser/index.js'
        },
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'public/js/[name]-[fullhash].js',
            sourceMapFilename: '[file].map',
            chunkFilename: 'public/js/[name]-[chunkHash].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(s[ac]|c)ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [AutoPrefixer()]
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [
                                        path.resolve(__dirname, 'node_modules'),
                                        path.resolve(__dirname, './src/styles'),
                                    ]
                                }
                            }
                        }
                    ]

                }
            ],
        },
        resolve: {
            extensions: [
                '.js',
                '.jsx'
            ]
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendor: {
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
            new AssetsPlugin({
                output: 'assets.json',
                writeToDisk: true,
                customize: (entry) => {
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
            }),
            new MiniCssExtractPlugin({
                filename: mode === 'development' ? 'public/styles/[name].css' : 'public/styles/[name]-[fullhash].css'
            })
        ]
    };
};


const serverConfig = {
    externalsPresets: { node: true },
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
            { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.scss$/, loader: 'css-loader/locals' }
        ]
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom',
        'react-router-dom': 'react-router-dom'
    },
    resolve: {
        aliasFields: []
    },
};


module.exports = [browserConfig, serverConfig];
