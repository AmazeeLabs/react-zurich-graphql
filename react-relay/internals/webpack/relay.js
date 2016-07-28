/* eslint-disable global-require */

/**
 * @file    relay webpack config
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-01-01
 */

const babelRelayPlugin    = require('babel-relay-plugin');
const introspectionQuery  = require('graphql/utilities').introspectionQuery;
const request             = require('sync-request');

const response = request('POST', 'http://localhost:3002/', {
  headers : {
    'Content-Type'  : 'application/json',
  },
  body    : JSON.stringify({
    query : introspectionQuery,
  }),
});

const schema = JSON.parse(response.body.toString('utf-8'));
module.exports = babelRelayPlugin(schema.data);
