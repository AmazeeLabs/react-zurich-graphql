/**
 * @file    node express server
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

/* eslint-disable global-require */
/* eslint-disable consistent-return */

// Load the polyfill so we can use things like Object.values().
import 'babel-polyfill';
import compression from 'compression';
import express from 'express';
import proxy from 'http-proxy-middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());

app.use(proxy('/graphql', {
  target       : 'http://localhost:3002/',
  changeOrigin : true,
  pathRewrite  : { '^/graphql/': '' },
}));

// Add middlewares, etc. for the current environment.
if (process.env.NODE_ENV === 'production') {

  require('./server.prod').default(app);

} else {

  const devOptions = require('../internals/webpack/webpack.dev');
  require('./server.dev').default(app, devOptions);

}

// Start your app.
app.listen(port, () => {
  console.log(`Server listening at ${port}.`);
});
