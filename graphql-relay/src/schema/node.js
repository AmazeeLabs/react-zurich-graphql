/* eslint-disable global-require */

/**
 * @file    global node definitions.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay';

import Person, { getPersonById } from './models/person';

export const {
  nodeInterface,
  nodeField,
} = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Person') {
      return getPersonById(id);
    }

    return null;
  },
  (object) => {
    if (object instanceof Person) {
      const personType = require('./types/person').default;
      return personType;
    }

    return null;
  }
);
