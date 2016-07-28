/**
 * @file    query definitions for persons.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from 'graphql-relay';

import {
  getAllPersons,
  getPersonById,
} from '../models/person';

import personType, {
  personConnection,
} from '../types/person';

export const allPersonsField = {
  type    : personConnection,
  args    : connectionArgs,
  resolve : async (_, args) => {
    const persons = await getAllPersons();

    return ({
      ...connectionFromArray(persons, args),
      count: persons.length,
    });
  },
};

export const personByIdField = {
  type : personType,
  args : {
    id : {
      title : 'Person Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  resolve : async (_, { id }) => getPersonById(fromGlobalId(id).id),
};
