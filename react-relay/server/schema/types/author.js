/**
 * @file    mock schema for authors.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
} from 'graphql-relay';

import { nodeInterface } from '../node';

import {
  getArticlesByAuthor,
  getArticlesByAuthorCount,
} from '../models/article';

export const authorType = new GraphQLObjectType({
  name   : 'Author',
  fields : () => ({
    id : globalIdField('Author'),
    authorId : {
      title   : 'Author Id',
      type    : new GraphQLNonNull(GraphQLString),
      resolve : ({ id }) => id,
    },
    firstName : {
      title : 'First name',
      type  : GraphQLString,
    },
    lastName : {
      title : 'Last name',
      type  : GraphQLString,
    },
    department : {
      title : 'Department',
      type  : GraphQLString,
    },
    avatar : {
      title : 'Avatar',
      type  : GraphQLString,
    },
    articles : {
      title   : 'Articles',
      type    : require('./article').articleConnection, // eslint-disable-line global-require
      args    : connectionArgs,
      resolve : async (author, args) => {
        const [
          connection,
          count,
        ] = await Promise.all([
          connectionFromPromisedArray(getArticlesByAuthor(author), args),
          getArticlesByAuthorCount(author),
        ]);

        return ({
          ...connection,
          count,
        });
      },
    },
  }),
  interfaces : [nodeInterface],
});

export const {
  connectionType : authorConnection,
  edgeType       : authorEdge,
} = connectionDefinitions({
  name     : 'Authors',
  nodeType : authorType,
  connectionFields : {
    count : {
      title : 'Count',
      type  : new GraphQLNonNull(GraphQLInt),
    },
  },
});
