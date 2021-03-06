/**
 * @file    production webpack config
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
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin     = require('offline-plugin');
const WebpackMd5Hash    = require('webpack-md5-hash');

module.exports = [require('./webpack.base')({
  // In production, we skip all hot-reloading stuff.
  entry : [
    './entry/client',
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes)
  // to compiled assets.
  output : {
    filename      : '[name].[chunkhash].js',
    chunkFilename : '[name].[chunkhash].chunk.js',
    path          : path.resolve(process.cwd(), 'build', 'public'),
    publicPath    : '/',
  },

  // Load the CSS in a style tag in development.
  loaders : [
    {
      // Transform our own .css files with PostCSS and CSS-modules.
      test    : /\.css$/,
      exclude : /node_modules/,

      // We use ExtractTextPlugin so we get a seperate CSS file instead of the CSS
      // being in the JS and injected as a style tag.
      loader  : ExtractTextPlugin.extract(
        'style-loader',
        'css-loader?modules&importLoaders=1!postcss-loader'
      ),
    }, {
      test    : /\.font$/,
      exclude : /node_modules/,
      loaders : ExtractTextPlugin.extract(
        'style-loader',
        'css-loader'
      ),
    }, {
      // Do not transform vendor's CSS with CSS-modules. The point is that they
      // remain in global scope. Since we require these CSS files in our JS or
      // CSS files, they will be a part of our compilation either way. So, no
      // need for ExtractTextPlugin here.
      test    : /\.css$/,
      include : /node_modules/,
      loader  : ExtractTextPlugin.extract(
        'style-loader',
        'css-loader'
      ),
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

  plugins : [
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin('common'),

    // Merge all duplicate modules.
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript.
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        warnings : false,
      },
    }),

    // Minify and optimize the index.ejs
    new HtmlWebpackPlugin({
      template  : 'html!./app/index.ejs',
      filename  : path.resolve(process.cwd(), 'build', 'views', 'index.ejs'),
      minify    : {
        removeComments                : true,
        collapseWhitespace            : true,
        removeRedundantAttributes     : true,
        useShortDoctype               : true,
        removeEmptyAttributes         : true,
        removeStyleLinkTypeAttributes : true,
        keepClosingSlash              : true,
        minifyJS                      : true,
        minifyCSS                     : true,
        minifyURLs                    : true,
      },
      inject   : true,
    }),

    // Extract the CSS into a seperate file.
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks : true,
    }),

    // Set the process.env to production so React includes the production
    // version of itself.
    new webpack.DefinePlugin({
      __CLIENT__      : true,
      __SERVER__      : false,
      __DEVELOPMENT__ : false,
      __PRODUCTION__  : true,
      __MOCK__        : false,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's assets
    // manipulations and do leak its manipulations to HtmlWebpackPlugin.
    new OfflinePlugin({
      relativePaths : true, // Use generated relative paths by default
      caches        : {
        main       : [':rest:'],

        // All chunks marked as `additional`, loaded after main section and do
        // not prevent SW to install. Change to `optional` if do not want them
        // to be preloaded at all (cached only when first loaded).
        additional : ['**/*.chunk.js'],
      },

      AppCache : false,
    }),
  ],

  babelQuery : {

    // Load the babel relay plugin and initialize it with the GraphQL schema
    // from our server.
    plugins : [path.resolve(process.cwd(), 'internals', 'webpack', 'relay')],
  },
}), require('./webpack.base')({
  // No need for any of the hot-reloading stuff on the server side.
  entry : './entry/server',

  // Don't use hashes in dev mode for better performance.
  output : {
    filename      : 'render.js',
    libraryTarget : 'commonjs2',
    path          : path.resolve(process.cwd(), 'build'),
    publicPath    : '/public',
  },

  loaders : [
    {
      // Transform our own .css files with PostCSS and CSS-modules.
      test    : /\.css$/,
      exclude : /node_modules/,
      loader  : 'css-loader/locals?modules&importLoaders=1!postcss-loader',
    }, {
      // Do not transform vendor's CSS with CSS-modules. The point is that they
      // remain in global scope. Since we require these CSS files in our JS or
      // CSS files, they will be a part of our compilation either way. So, no
      // need for ExtractTextPlugin here.
      test    : /\.css$/,
      include : /node_modules/,
      loaders : ['css-loader/locals'],
    }, {
      test    : /\.font$/,
      exclude : /node_modules/,
      loaders : ['css-loader/locals'],
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
    }, {
      // webfonts loader
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      // webfonts loader
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    },
  ],

  plugins : [
    // Merge all duplicate modules.
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript.
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        warnings : false,
      },
    }),

    new webpack.DefinePlugin({
      __CLIENT__      : false,
      __SERVER__      : true,
      __DEVELOPMENT__ : false,
      __PRODUCTION__  : true,
      __MOCK__        : false,
    }),
  ],

  babelQuery : {

    // Load the babel relay plugin and initialize it with the GraphQL schema
    // from our server.
    plugins : [path.resolve(process.cwd(), 'internals', 'webpack', 'relay')],
  },

  target : 'node',
})];
