/**
 * @file    mongodb model for articles.
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-06-21
 */

import mongoose, { Schema } from 'mongoose';

const tagSchema = new Schema({
  name : {
    type    : String,
    require : true,
  },
});

export const Tag = mongoose.model('Tag', tagSchema);

// The discriminator key option is applied to every type schema.
const options = { discriminatorKey : 'kind' };
const elementSchema = new Schema({}, options);

const textElementSchema = new Schema({
  text : {
    type     : String,
    required : false,
  },
  gallery : {
    type : [Schema.Types.ObjectId],
    ref  : 'Image',
  },
  image : {
    type : Schema.Types.ObjectId,
    ref  : 'Image',
  },
  video : {
    type : Schema.Types.ObjectId,
    ref  : 'Video',
  },
}, options);

const videoElementSchema = new Schema({
  video : {
    type     : Schema.Types.ObjectId,
    ref      : 'Video',
    required : true,
  },
}, options);

const imageElementSchema = new Schema({
  image : {
    type     : Schema.Types.ObjectId,
    ref      : 'Image',
    required : true,
  },
}, options);

const youtubeElementSchema = new Schema({
  post : {
    type     : String,
    required : true,
  },
}, options);

const facebookElementSchema = new Schema({
  post : {
    type     : String,
    required : true,
  },
}, options);

const instagramElementSchema = new Schema({
  post : {
    type     : String,
    required : true,
  },
}, options);

const twitterElementSchema = new Schema({
  post : {
    type     : String,
    required : true,
  },
}, options);

const textBoxElementSchema = new Schema({
  title : {
    type     : String,
    required : true,
  },
  text : {
    type     : String,
    required : true,
  },
  link : {
    type : String,
  },
}, options);

const quoteElementSchema = new Schema({
  author : {
    type     : String,
    required : true,
  },
  text : {
    type     : String,
    required : true,
  },
}, options);

export const BodyElement = mongoose.model('BodyElement', elementSchema);
export const BodyTextElement = BodyElement.discriminator('text', textElementSchema);
export const BodyVideoElement = BodyElement.discriminator('video', videoElementSchema);
export const BodyImageElement = BodyElement.discriminator('image', imageElementSchema);
export const BodyYoutubeElement = BodyElement.discriminator('youtube', youtubeElementSchema);
export const BodyFacebookElement = BodyElement.discriminator('facebook', facebookElementSchema);
export const BodyInstagramElement = BodyElement.discriminator('instagram', instagramElementSchema);
export const BodyTwitterElement = BodyElement.discriminator('twitter', twitterElementSchema);
export const BodyTextBoxElement = BodyElement.discriminator('textbox', textBoxElementSchema);
export const BodyQuoteElement = BodyElement.discriminator('quote', quoteElementSchema);

const ArticleSchema = new Schema({
  title : {
    type     : String,
    required : true,
    text     : true,
  },
  shareCount : {
    type : Number,
  },
  commentCount : {
    type : Number,
  },
  lead : {
    type : String,
  },
  body : {
    type : [{
      type : Schema.Types.ObjectId,
      ref  : 'BodyElement',
    }],
  },
  url : {
    type : String,
  },
  author : {
    type : Schema.Types.ObjectId,
    ref  : 'Author',
  },
  tags : {
    type : [Schema.Types.ObjectId],
    ref  : 'Tag',
  },
  teaserImage : {
    type : Schema.Types.ObjectId,
    ref  : 'Image',
  },
}, {
  timestamps : {
    createdAt : 'createTime',
    updatedAt : 'modifyTime',
  },
});

export const Article = mongoose.model('Article', ArticleSchema);

const bodyElementKindMap = {
  text      : BodyTextElement,
  video     : BodyVideoElement,
  image     : BodyImageElement,
  youtube   : BodyYoutubeElement,
  facebook  : BodyFacebookElement,
  instagram : BodyInstagramElement,
  twitter   : BodyTwitterElement,
  textbox   : BodyTextBoxElement,
  quote     : BodyQuoteElement,
};

const conditionFormatters = {
  search : (value) => ({ // eslint-disable-line no-confusing-arrow,
    $text : {
      $search : value,
    },
  }),
  tags : (value, key) => ({
    [key] : { $in: value },
  }),
};

const formatConditions = (conditions) =>
  Object.keys(conditions).reduce((carry, key) => {
    if (!conditionFormatters.hasOwnProperty(key)) {
      return carry;
    }

    if (typeof value === 'undefined' || value === null) {
      return carry;
    }

    const format = conditionFormatters[key];
    const value = conditions[key];

    return {
      ...carry,
      ...format(value, key),
    };
  }, {});

const resolveConditions = ({ tags, ...other }) => {
  const conditions = other || {};

  if (tags && tags.length) {
    conditions.tags = getTagsByNames(tags)
      .then((result) => result.map(({ id }) => id));
  }

  const keys = Object.keys(conditions);
  const values = Object.values(conditions);

  return Promise
    .all(values)
    .then((results) => results.reduce((carry, result, index) => ({
      ...carry,
      [keys[index]]: result,
    }), {}))
    .then(formatConditions);
};

export const getTagsByIds = (ids) => Tag.find({ _id : { $in : ids } });
export const getTagsByNames = (names) => Tag.find({ name : { $in : names } });
export const getBodyElementsByIds = (ids) => BodyElement.find({ _id : { $in : ids } });
export const getArticleById = (id) => Article.findById(id);
export const getArticlesByAuthor = ({ id }) => Article.find({ author : id });
export const getArticlesByAuthorCount = ({ id }) => Article.count({ author : id });

export const getAllArticlesCount = (conditions) =>
  resolveConditions(conditions)
    .then((args) => Article.count(args));

export const getAllArticles = (conditions) =>
  resolveConditions(conditions)
    .then((args) => Article.find(args));

// If a tag with the same name has already been created, return the id.
// Otherwise, create a new tag.
export const getOrAddTag = (name) =>
  Tag
    .findOne({ name })
    .then((foundTag) => foundTag || Tag
      .create({ name })
      .then((createdTag) => createdTag.save())
    );

export const addBodyElement = ({ kind, ...values }) =>
  bodyElementKindMap[kind]
    .create(values)
    .then((element) => element.save());

export const addArticle = ({ body : bodyRaw, tags : tagsRaw, ...values }) =>
  Promise
    .all([
      Promise.all((bodyRaw || []).map(addBodyElement)),
      Promise.all((tagsRaw || []).map(getOrAddTag)),
    ])
    .then(([body, tags]) =>
      Article
        .create({
          ...values,
          body,
          tags,
        })
        .then((article) => article.save()));

export const deleteArticle = (id) => Article.findByIdAndRemove(id);
