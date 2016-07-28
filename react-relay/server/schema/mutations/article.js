/**
 * @file    mutation definitions for articles.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import {
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';

import {
  mutationWithClientMutationId,
  fromGlobalId,
} from 'graphql-relay';

import unionInputType from 'graphql-union-input-type';

import {
  addArticle,
  deleteArticle,
  getArticleById,
} from '../models/article';

import { articleType } from '../types/article';

const bodyElementKindEnum = new GraphQLEnumType({
  name        : 'BodyElementKindEnum',
  description : 'Possible body element kinds.',
  values      : {
    text      : {
      description : 'Text',
      value       : 'text',
    },
    video     : {
      description : 'Video',
      value       : 'video',
    },
    image     : {
      description : 'Image',
      value       : 'image',
    },
    youtube   : {
      description : 'Youtube',
      value       : 'youtube',
    },
    facebook  : {
      description : 'Facebook',
      value       : 'facebook',
    },
    instagram : {
      description : 'Instagram',
      value       : 'instagram',
    },
    twitter   : {
      description : 'Twitter',
      value       : 'twitter',
    },
    textbox   : {
      description : 'Text box',
      value       : 'textbox',
    },
    quote     : {
      description : 'Quote',
      value       : 'quote',
    },
  },
});

const commonFields = {
  kind : {
    title : 'Kind',
    type  : new GraphQLNonNull(bodyElementKindEnum),
  },
};

const bodyTextElementInputType = new GraphQLInputObjectType({
  name   : 'BodyTextElementInput',
  fields : () => ({
    ...commonFields,
    text : {
      title : 'Text',
      type  : GraphQLString,
    },
    gallery : {
      title : 'Gallery',
      type  : new GraphQLList(GraphQLID),
    },
    image : {
      title : 'Image',
      type  : GraphQLID,
    },
    video : {
      title : 'Video',
      type  : GraphQLID,
    },
  }),
});

const bodyVideoElementInputType = new GraphQLInputObjectType({
  name   : 'BodyVideoElementInput',
  fields : () => ({
    ...commonFields,
    video : {
      title : 'Video',
      type  : new GraphQLNonNull(GraphQLID),
    },
  }),
});

const bodyImageElementInputType = new GraphQLInputObjectType({
  name   : 'BodyImageElementInput',
  fields : () => ({
    ...commonFields,
    image : {
      title : 'Image',
      type  : new GraphQLNonNull(GraphQLID),
    },
  }),
});

const bodyYoutubeElementInputType = new GraphQLInputObjectType({
  name   : 'BodyYoutubeElementInput',
  fields : () => ({
    ...commonFields,
    url : {
      title : 'Url',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
});

const bodyFacebookElementInputType = new GraphQLInputObjectType({
  name   : 'BodyFacebookElementInput',
  fields : () => ({
    ...commonFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
});

const bodyInstagramElementInputType = new GraphQLInputObjectType({
  name   : 'BodyInstagramElementInput',
  fields : () => ({
    ...commonFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
});

const bodyTwitterElementInputType = new GraphQLInputObjectType({
  name   : 'BodyTwitterElementInput',
  fields : () => ({
    ...commonFields,
    post : {
      title : 'Post',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
});

const bodyTextBoxElementInputType = new GraphQLInputObjectType({
  name   : 'BodyTextBoxElementInput',
  fields : () => ({
    ...commonFields,
    title : {
      title : 'Title',
      type  : new GraphQLNonNull(GraphQLString),
    },
    text : {
      title : 'Text',
      type  : new GraphQLNonNull(GraphQLString),
    },
    link : {
      title : 'Link',
      type  : GraphQLString,
    },
  }),
});

const bodyQuoteElementInputType = new GraphQLInputObjectType({
  name   : 'BodyQuoteElementInput',
  fields : () => ({
    ...commonFields,
    author : {
      title : 'Author',
      type  : new GraphQLNonNull(GraphQLString),
    },
    text : {
      title : 'Text',
      type  : new GraphQLNonNull(GraphQLString),
    },
  }),
});

const bodyElementInputType = unionInputType({
  name       : 'BodyElementInput',
  typeKey    : 'kind',
  inputTypes : {
    text      : bodyTextElementInputType,
    video     : bodyVideoElementInputType,
    image     : bodyImageElementInputType,
    youtube   : bodyYoutubeElementInputType,
    facebook  : bodyFacebookElementInputType,
    instagram : bodyInstagramElementInputType,
    twitter   : bodyTwitterElementInputType,
    textbox   : bodyTextBoxElementInputType,
    quote     : bodyQuoteElementInputType,
  },
});

const createOrUpdateArticleFields = {
  inputFields : {
    title : {
      title : 'Title',
      type  : new GraphQLNonNull(GraphQLString),
    },
    shareCount : {
      title : 'Share Count',
      type  : GraphQLInt,
    },
    commentCount : {
      title : 'Comment Count',
      type  : GraphQLInt,
    },
    lead : {
      title : 'Lead',
      type  : GraphQLString,
    },
    body : {
      title : 'Body',
      type  : new GraphQLList(bodyElementInputType),
    },
    url : {
      title : 'Url',
      type  : GraphQLString,
    },
    author : {
      title : 'Author',
      type  : GraphQLID,
    },
    tags : {
      title : 'Tags',
      type : new GraphQLList(GraphQLString),
    },
    teaserImage : {
      title : 'Teaser image',
      type : GraphQLID,
    },
  },
  outputFields : {
    article : {
      type    : articleType,
      resolve : (article) => article,
    },
  },
};

export const addArticleMutation = mutationWithClientMutationId({
  name : 'AddArticle',
  mutateAndGetPayload : async (values) =>
    addArticle({
      ...values,
      author: values.author && fromGlobalId(values.author).id,
    }).then(({ id }) => getArticleById(id)),
  ...createOrUpdateArticleFields,
});

const deleteArticleFields = {
  inputFields : {
    id : {
      title : 'Id',
      type  : new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields : {
    article : {
      type    : articleType,
      resolve : (article) => article,
    },
  },
};

export const deleteArticleMutation = mutationWithClientMutationId({
  name : 'DeleteArticle',
  mutateAndGetPayload : async ({ id }) => {
    const { id : articleId } = fromGlobalId(id);
    const article = await getArticleById(articleId);

    // Wait until the article has been successfully deleted.
    await deleteArticle(articleId);

    return article;
  },
  ...deleteArticleFields,
});
