/**
 * @file    query definitions for articles.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLID,
} from 'graphql';

import {
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId,
} from 'graphql-relay';

import {
  getAllArticles,
  getAllArticlesCount,
  getArticleById,
} from '../models/article';

import {
  articleConnection,
  articleType,
} from '../types/article';

export const allArticlesField = {
  type : articleConnection,
  args : {
    ...connectionArgs,
    tags : {
      type        : new GraphQLList(GraphQLString),
      description : 'Filter for tags.',
    },
    search : {
      type        : GraphQLString,
      description : 'Text search string.',
    },
  },
  resolve : async (_, { tags, search, ...args }) => {
    const conditions = {
      tags,
      search,
    };

    const [
      connection,
      count,
    ] = await Promise.all([
      connectionFromPromisedArray(getAllArticles(conditions), args),
      getAllArticlesCount(conditions),
    ]);

    return ({
      ...connection,
      count,
    });
  },
};

export const articleByIdField = {
  type : articleType,
  args : {
    id : {
      title : 'Article Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  resolve : async (_, { id }) => getArticleById(fromGlobalId(id).id),
};
