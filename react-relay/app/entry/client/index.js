/**
 * @file    application entry point for the client
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

/* eslint-disable global-require */

// Needed for redux-saga es6 generator support.
import 'babel-polyfill';

// Import all the third party stuff.
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';

// Set up relay.
const environment = new Relay.Environment();
environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));

// Find the DOM node generated by the server.
const mountNode = document.getElementById('app');

// Encapsulate rendering for hot-reloading.
let render = () => require('./render').default(environment, browserHistory, mountNode);

if (module.hot) {

  // Add hot reloading of components and display an overlay for runtime errors.
  const renderApp = render;
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render((<RedBox error={error} />), mountNode);
  };

  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./render', () => setTimeout(render));
}

// Do the initial rendering.
render();