/**
 * @file    mutation definitions for persons.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import {
  createPerson,
  deletePerson,
  getPersonById,
} from '../models/person';

import personType from '../types/person';

const createOrUpdatePersonFields = {
  inputFields : {
    firstName : {
      title : 'First name',
      type  : new GraphQLNonNull(GraphQLString),
    },
    lastName : {
      title : 'Last name',
      type  : new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields : {
    person : {
      type    : personType,
      resolve : (person) => person,
    },
  },
};

export const addPersonMutation = mutationWithClientMutationId({
  name : 'AddPerson',
  mutateAndGetPayload : async (values) => createPerson(values)
    .then((person) => person.save()),
  ...createOrUpdatePersonFields,
});

const deletePersonFields = {
  inputFields : {
    id : {
      title : 'Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields : {
    person : {
      type    : personType,
      resolve : (person) => person,
    },
  },
};

export const deletePersonMutation = mutationWithClientMutationId({
  name : 'DeletePerson',
  mutateAndGetPayload : async ({ id }) => {
    const { id : personId } = fromGlobalId(id);
    const person = await getPersonById(personId);

    // Wait until the person has been successfully deleted.
    await deletePerson(personId);

    return person;
  },
  ...deletePersonFields,
});
