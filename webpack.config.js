const path = require('path');

// Webpack and its plugins
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
});

const ENV = process.env.NODE_ENV = 'development';
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
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, './src'),
    historyApiFallback: true,
    host: metadata.host,
    port: metadata.port,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8000',
        secure: false
      }
    }
  },
  devtool: 'source-map',
  entry: {
    'main': ['./js/app.js']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          extractCSS.extract({loader: 'style-loader'}),
          {
            loader: 'css-loader?sourceMap',
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          {loader: 'postcss-loader?sourceMap=inline'}
        ]
      },
      {
        test: /\.html$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {loader: 'raw-loader'}
        ]
      },

      // Load images
      {
        test: /\.jpg/,
        use: ['url-loader?limit=10000&mimetype=image/jpg']
      },
      {
        test: /\.gif/,
        use: ['url-loader?limit=10000&mimetype=image/gif']
      },
      {
        test: /\.png/,
        use: ['url-loader?limit=10000&mimetype=image/png']
      },
      {
        test: /\.svg/,
        use: ['url-loader?limit=10000&mimetype=image/svg']
      },

      // Load fonts
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=10000&mimetype=application/font-woff']
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
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
    publicPath: '/media/js/crm/',
    libraryTarget: 'var',
    library: 'crm'
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    'jquery': 'jQuery'
  },
  plugins: [
//        new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity}),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new ProvidePlugin({jQuery: 'jquery', jquery: 'jquery', $: 'jquery', 'window.jQuery': 'jquery'}),
//        new UglifyJSPlugin({sourceMap: true}),
    new DashboardPlugin({port: metadata.dashboardPort}),
    new webpack.LoaderOptionsPlugin({debug: true}),
    new extractCSS('style.css', {allChunks: false})
  ]
};
