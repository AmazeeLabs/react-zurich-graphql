/**
 * @file    graphql schema entry point
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import { nodeField } from './node';

import {
  allPersonsField,
  personByIdField,
} from './queries/person';

import {
  addPersonMutation,
  deletePersonMutation,
} from './mutations/person';

// Set up the root query type.
const query = new GraphQLObjectType({
  name        : 'Query',
  description : 'Query root.',
  fields      : () => ({
    node        : nodeField,
    viewer      : {
      title   : 'Viewer',
      resolve : () => true,
      type    : new GraphQLObjectType({
        name        :'Viewer',
        description : 'Extra nesting layer for Relay routing.',
        fields      : {
          allPersons : allPersonsField,
        },
      }),
    },
    personById : personByIdField,
  }),
});

// Set up the root mutation type.
const mutation = new GraphQLObjectType({
  name        : 'Mutation',
  description : 'Mutation root.',
  fields      : () => ({
    addPerson    : addPersonMutation,
    deletePerson : deletePersonMutation,
  }),
});

export default new GraphQLSchema({
  query,
  mutation,
});
