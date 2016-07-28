/**
 * @file    node express server
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

// Load the environment configuration.
require('dotenv-extended').config({
  path     : '.env.local',
  defaults : '.env',
});

/* eslint-disable global-require */
/* eslint-disable consistent-return */

import 'babel-polyfill';
import express from 'express';
import graphql from 'express-graphql';
import mongoose from 'mongoose';
import schema from './schema';

// Use promises for mongoose async operations.
mongoose.Promise = Promise;

const app = express();
const port = process.env.PORT || 3002;

app.use('/', graphql({
  schema,
  graphiql : true,
}));

// Start your app.
app.listen(port, () => {
  mongoose.connect(process.env.DATABASE);

  console.log(`Server listening at ${port}.`);
});
