/**
 * @file    develop webpack config
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

/* eslint-disable global-require */

// Load the environment configuration.
require('dotenv-extended').config(
  {
    path      : '.env.local',
    defaults  : '.env',
  }
);

const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports          = require('./webpack.base')({
  // Add hot reloading in development.
  entry : [
    'eventsource-polyfill', // Necessary for hot reloading with IE.
    'webpack-hot-middleware/client',
    './entry/client',
  ],

  // Don't use hashes in dev mode for better performance.
  output : {
    filename      : '[name].js',
    chunkFilename : '[name].chunk.js',
    path          : path.resolve(process.cwd(), 'build', 'public'),
    publicPath    : '/',
  },

  // Load the CSS in a style tag in development.
  loaders : [
    {
      // Transform our own .css files with PostCSS and CSS-modules.
      test    : /\.css$/,
      exclude : /node_modules/,
      loader  : 'style-loader!css-loader?localIdentName=[local]__[path][name]__[hash:base64:5]&modules&' +
                'importLoaders=1&sourceMap!postcss-loader',
    }, {
      // Do not transform vendor's CSS with CSS-modules. The point is that they
      // remain in global scope. Since we require these CSS files in our JS or
      // CSS files, they will be a part of our compilation either way. So, no
      // need for ExtractTextPlugin here.
      test    : /\.css$/,
      include : /node_modules/,
      loaders : ['style-loader', 'css-loader'],
    }, {
      test    : /\.font$/,
      exclude : /node_modules/,
      loaders : ['style-loader', 'css-loader'],
    }, {
      // auth0:lock loader
      test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
      loaders: [
        'transform-loader/cacheable?brfs',
        'transform-loader/cacheable?packageify',
      ],
    }, {
      // auth0:lock loader
      test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
      loader: 'transform-loader/cacheable?ejsify',
    },
  ],

  // Add hot reloading
  plugins : [
    new HtmlWebpackPlugin({
      template  : 'html!./app/index.ejs',
      filename  : path.resolve(process.cwd(), 'build', 'views', 'index.ejs'),
      inject    : true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__      : true,
      __SERVER__      : false,
      __DEVELOPMENT__ : true,
      __PRODUCTION__  : false,
      __MOCK__        : false,
    }),
  ],

  babelQuery : {

    // Load the babel relay plugin and initialize it with the GraphQL schema
    // from our server.
    plugins : [path.resolve(process.cwd(), 'internals', 'webpack', 'relay')],
  },

  // Emit a source map for easier debugging.
  // devtool: 'inline-eval-cheap-source-map',
  devtool: 'eval',
});
