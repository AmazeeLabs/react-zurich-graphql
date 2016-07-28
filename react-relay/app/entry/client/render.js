/**
 * @file    rendering entry point for hot reloading
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import React from 'react';
import ReactDOM from 'react-dom';
import IsomorphicRouter from 'isomorphic-relay-router';
import IsomorphicRelay from 'isomorphic-relay';
import { match } from 'react-router';
import createRoutes from 'createRoutes';
import Root from './root';

export default (environment, history, mountNode) => {
  const routes = createRoutes();
  const preloadedData = window.__PRELOADED_DATA__; // eslint-disable-line no-underscore-dangle

  IsomorphicRelay.injectPreparedData(environment, preloadedData);

  return match({
    history,
    routes,
  }, (error, redirectLocation, renderProps) => {
    IsomorphicRouter.prepareInitialRender(environment, renderProps).then((props) => {
      ReactDOM.render(<Root {...props} />, mountNode);
    });
  });
};
