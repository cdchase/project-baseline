const path = require('path');

// Webpack and its plugins
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: "[name].css",
  disable: process.env.NODE_ENV === "development"
});

const ENV = process.env.NODE_ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  baseUrl: '/',
  ENV: ENV,
  host: HOST,
  port: PORT,
  dashboardPort: 2995
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'source-map',
  entry: {
    'main': ['./index.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 1,
                sourceMap: true,
                url: false
              }
            },
            'postcss-loader?sourceMap=inline'
          ]
        }),
      },
      {
        test: /\.scss$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                importLoaders: 2,
                sourceMap: true,
                url: false
              }
            },
            'postcss-loader?sourceMap=inline',
            'sass-loader?sourceMap'
          ]
        }),
      },
      {
        test: /\.html$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [{
          loader: 'raw-loader'
        }]
      },

// Load images
      {
        test: /\.jpg/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      }
      ,
      {
        test: /\.gif/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      }
      ,
      {
        test: /\.png/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      }
      ,
      {
        test: /\.svg/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      }
      ,

// Load fonts
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      }
      ,
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader?name=[path][name].[ext]&emitFile=false']
      },

// Ignore Moment Locale files
      {
        test: /moment\/locale\/.*\.js$/,
        use: ['ignore-loader']

      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {modules: false}]
            ]
          }
        }]
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: '/media/',
    libraryTarget: 'var',
    library: 'crm'
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    'jquery': 'jQuery'
  },
  plugins: [
//    new CommonsChunkPlugin({name: 'hobsons', filename: 'hobsons.bundle.js', minChunks: Infinity}),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new ProvidePlugin({jQuery: 'jquery', jquery: 'jquery', $: 'jquery', 'window.jQuery': 'jquery'}),
    new UglifyJSPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),
//    new webpack.LoaderOptionsPlugin({debug: true}),
    extractCSS
  ]
};
