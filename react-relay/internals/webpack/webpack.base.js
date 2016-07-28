/**
 * @file    base webpack config
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

const path = require('path');

const cssCalc           = require('postcss-calc');
const cssNext           = require('postcss-cssnext');
const postCssFocus      = require('postcss-focus');
const postCssReporter   = require('postcss-reporter');
const colorFunction     = require('postcss-color-function');
const atImport          = require('postcss-import');
const forLoop           = require('postcss-for');

const postCssPlugins = [
  atImport(),
  forLoop(),
  postCssFocus(), // Add a :focus to every :hover
  colorFunction(),
  cssCalc(),
  cssNext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
    browsers : ['last 2 versions', 'IE > 10'], // ...based on this browser list
  }),
  postCssReporter({ // Posts messages from plugins to the terminal
    clearMessages : true,
  }),
];

module.exports = (options) => (
  {
    entry   : options.entry,
    context : options.context || path.resolve(process.cwd(), 'app'),
    output  : options.output, // Merge with env dependent settings.
    module  : {
      loaders : (options.loaders || [])
        .concat([
          {
            test    : /\.js$/, // Transform all .js files required somewhere with Babel.
            loader  : 'babel',
            exclude : /node_modules/,
            query   : options.babelQuery || {},
          },
          {
            test    : /\.jpe?g$|\.gif$|\.png$/i,
            loader  : 'url-loader?limit=10000',
          },
          {
            test    : /\.json$/,
            loader  : 'json',
          }, {
            test: /\.woff(\?.*)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff',
          }, {
            test: /\.woff2(\?.*)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff2',
          }, {
            test: /\.ttf(\?.*)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
          }, {
            test: /\.eot(\?.*)?$/,
            loader: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject',
          }, {
            test: /\.svg(\?.*)?$/,
            loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
          },
        ]),
    },
    plugins : options.plugins,
    postcss : () => (options.postcssPlugins ? options.postcssPlugins : postCssPlugins),
    resolve : {
      alias : Object.assign(
        {},
        options.resolveAliases || {},
      ),
      modules : [
        'screens',
        'components',
        'shared',
        'node_modules',
      ],
      extensions    : ['', '.js'],
      packageMains : [
        'jsnext:main',
        'main',
      ],
    },
    devtool  : options.devtool,
    target   : options.target || 'web', // Make web variables accessible to webpack, e.g. window.
    stats    : false, // Don't show stats in the console.
    progress : true,
  }
);
