/**
 * @file    mock schema for persons.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay';

import { nodeInterface } from '../node';
import { getPersonsByIds } from '../models/person';

const personType = new GraphQLObjectType({
  name   : 'Person',
  fields : () => ({
    id : globalIdField('Person'),
    personId : {
      title   : 'Person Id',
      type    : new GraphQLNonNull(GraphQLString),
      resolve : ({ id }) => id,
    },
    firstName : {
      title : 'First name',
      type  : new GraphQLNonNull(GraphQLString),
    },
    lastName : {
      title : 'Last name',
      type  : new GraphQLNonNull(GraphQLString),
    },
    friends : {
      title   : 'Friends',
      type    : personConnection,
      args    : connectionArgs,
      resolve : async (person, args) => {
        const persons = await getPersonsByIds(person.friends);

        return ({
          ...connectionFromArray(persons, args),
          count: persons.length,
        });
      },
    },
  }),
  interfaces : [nodeInterface],
});

export const {
  connectionType : personConnection,
  edgeType       : personEdge,
} = connectionDefinitions({
  name     : 'Persons',
  nodeType : personType,
  connectionFields : {
    count : {
      title : 'Count',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default personType;
