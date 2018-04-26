const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('webpack-assets-manifest');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const AutoPrefixer = require('autoprefixer');

const production = process.env.NODE_ENV === 'production';

const browserConfig = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    main: './src/browser/index.js'
  },
  devtool: "sourcemap",
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: !production ? 'js/[name].js' : 'js/[name]-[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: !production ? 'js/[name].js' : 'js/[name]-[chunkHash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: { presets: ['react'] }
      },
      {
        test: /\.s?[ac]ss$/,      
          use: [
            {
              loader: ExtractTextPlugin.loader
            },
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: { plugins: [AutoPrefixer()] }
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [
                  path.resolve(__dirname, "node_modules"),
                  path.resolve(__dirname, "./src/styles"),
                ]
              }
            }
          ]
        
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: true,
      cacheGroups: {
        default: {
          reuseExistingChunk: true,
        },
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
      __isBrowser__: "true"
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true
    }),
    new ExtractTextPlugin({
      filename: !production ? "styles/[name].css" : "styles/[name]-[hash].css"
    }),
    new AssetsPlugin({
      output: 'assets.json',
      writeToDisk: true,
      customize: (entry, original, manifest, asset) => {        
        entry.type = entry.key.slice(entry.key.lastIndexOf('.') + 1);
        entry.key = entry.key.slice(0, entry.key.lastIndexOf('.'));
        const { key, value, type } = entry;
        return {
          key: `${entry.key}.${entry.type}`,
          value: {
            key: entry.key,
            type: entry.type,
            asset: entry.value
          }
        }
      },
      transform: (assets, manifest) => {      
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
        }
      }
    })    
  ]
};

const serverConfig = {
  entry: './src/server/index.js',
  devtool: "inline-sourcemap",
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: [/\.(js)$/, /\.(jsx)$/], loader: 'babel-loader', query: { presets: ['react'] } },
      { test: /\.scss$/, loader: "css-loader/locals" }    
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
};

module.exports = [browserConfig, serverConfig]