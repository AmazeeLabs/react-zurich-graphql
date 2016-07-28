/**
 * @file    query definitions for authors.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId,
} from 'graphql-relay';

import {
  getAllAuthors,
  getAllAuthorsCount,
  getAuthorById,
} from '../models/author';

import {
  authorConnection,
  authorType,
} from '../types/author';

export const allAuthorsField = {
  type    : authorConnection,
  args    : connectionArgs,
  resolve : async (_, args) => {
    const [
      connection,
      count,
    ] = await Promise.all([
      connectionFromPromisedArray(getAllAuthors(), args),
      getAllAuthorsCount(),
    ]);

    return ({
      ...connection,
      count,
    });
  },
};

export const authorByIdField = {
  type : authorType,
  args : {
    id : {
      title : 'Author Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  resolve : async (_, { id }) => getAuthorById(fromGlobalId(id).id),
};
