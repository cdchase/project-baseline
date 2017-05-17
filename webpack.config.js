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
  filename: '[name].css',
//  disable: process.env.NODE_ENV === 'development'
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
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
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
                importLoaders: 2,
                sourceMap: true,
                url: false
              }
            },
            'postcss-loader?sourceMap=inline',
            'resolve-url-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        }),
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
        use: ['file-loader?emitFile=false']
      },
      {
        test: /\.gif/,
        use: ['file-loader?emitFile=false']
      },
      {
        test: /\.png/,
        use: ['file-loader?emitFile=false']
      },
      {
        test: /\.svg/,
        use: ['file-loader?emitFile=false']
      },

      // Load fonts
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader?emitFile=false']
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader?emitFile=false']
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
    publicPath: '/static/',
    libraryTarget: 'var',
    library: 'crm'
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    'jquery': 'jQuery'
  },
  plugins: [
//        new CommonsChunkPlugin({name: 'hobsons', filename: 'hobsons.bundle.js', minChunks: Infinity}),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new ProvidePlugin({jQuery: 'jquery', jquery: 'jquery', $: 'jquery', 'window.jQuery': 'jquery'}),
//        new UglifyJSPlugin({compress: true, sourceMap: true}),
    new DashboardPlugin({port: metadata.dashboardPort}),
    new webpack.LoaderOptionsPlugin({debug: true}),
    new webpack.HotModuleReplacementPlugin(),
    extractCSS
  ]
};
