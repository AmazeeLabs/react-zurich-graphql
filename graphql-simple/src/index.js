/**
 * @file    node express server
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

/* eslint-disable global-require */
/* eslint-disable consistent-return */

import 'babel-polyfill';
import express from 'express';
import graphql from 'express-graphql';
import schema from './schema';

const app = express();
const port = process.env.PORT || 3001;

app.use('/', graphql({
  schema,
  graphiql : true,
}));

// Start your app.
app.listen(port, () => {
  console.log(`Server listening at ${port}.`);
});
