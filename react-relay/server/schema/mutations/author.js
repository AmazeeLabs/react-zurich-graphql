/**
 * @file    mutation definitions for authors.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
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
  addAuthor,
  deleteAuthor,
  getAuthorById,
} from '../models/author';

import { authorType } from '../types/author';

const createOrUpdateAuthorFields = {
  inputFields : {
    firstName : {
      title : 'First name',
      type  : new GraphQLNonNull(GraphQLString),
    },
    lastName : {
      title : 'Last name',
      type  : new GraphQLNonNull(GraphQLString),
    },
    department : {
      title : 'Resort',
      type  : GraphQLString,
    },
    avatar : {
      title : 'Avatar',
      type  : GraphQLString,
    },
  },
  outputFields : {
    author : {
      type    : authorType,
      resolve : (author) => author,
    },
  },
};

export const addAuthorMutation = mutationWithClientMutationId({
  name : 'AddAuthor',
  mutateAndGetPayload : async (values) => addAuthor(values),
  ...createOrUpdateAuthorFields,
});

const deleteAuthorFields = {
  inputFields : {
    id : {
      title : 'Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields : {
    author : {
      type    : authorType,
      resolve : (author) => author,
    },
  },
};

export const deleteAuthorMutation = mutationWithClientMutationId({
  name : 'DeleteAuthor',
  mutateAndGetPayload : async ({ id }) => {
    const { id : authorId } = fromGlobalId(id);
    const author = await getAuthorById(authorId);

    // Wait until the author has been successfully deleted.
    await deleteAuthor(authorId);

    return author;
  },
  ...deleteAuthorFields,
});
