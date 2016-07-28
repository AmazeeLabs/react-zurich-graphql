/**
 * create routes
 */

 /* eslint-disable global-require */

import Relay from 'react-relay';
import App from 'App';
import { IndexRoute } from 'react-router';

const errorLoading = (error) => console.error('Dynamic page loading failed.', error); // eslint-disable-line no-console
const loadModule = (callback) => (module) => callback(null, module.default);

const childRoutes = () => [
  {
    path    : '/person/:id',
    queries : {
      person : () => Relay.QL`query {
        personById(id: $id)
      }`,
    },
    getComponent : (location, callback) => {
      if (__CLIENT__) {
        System.import('App/screens/Person')
          .then(loadModule(callback))
          .catch(errorLoading);
      } else {
        callback(null, require('App/screens/Person').default);
      }
    },
  },
];

export default (store: Function): IndexRoute => ({ // eslint-disable-line no-unused-vars
  path       : '/',
  component  : App,
  indexRoute : {
    queries : {
      viewer : () => Relay.QL`query {
        viewer
      }`,
    },
    getComponent : (location, callback) => {
      if (__CLIENT__) {
        System.import('App/screens/Home')
          .then(loadModule(callback))
          .catch(errorLoading);
      } else {
        callback(null, require('App/screens/Home').default);
      }
    },
  },
  childRoutes : __CLIENT__ ? [...childRoutes(),
    {
      path         : '/*',
      getComponent : (location, callback) => {
        System.import('App/screens/NotFound')
          .then(loadModule(callback))
          .catch(errorLoading);
      },
    },
  ] : [...childRoutes()],
});
