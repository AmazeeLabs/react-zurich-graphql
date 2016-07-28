/**
 * @file    data creator definitions.
 * @author  Campbell Vertesi <campbell@vertesi.com>
 * @date    2016-06-21
 */

import faker from 'faker';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';

import { addAuthor } from './models/author';
import { addArticle } from './models/article';
import { addImage } from './models/image';
import { addYoutubeVideo, addBrightcoveVideo } from './models/video';

/**
 * node counts
 *
 * @desc How many of each node type to create.
 */
const nodeCounts = {
  authorsCount: 20,
  articlesCount: 100,
  imagesCount: 50,
  youtubesCount: 30,
  brightcovesCount: 30,
};

/**
 * random number
 *
 * @desc   Get a random number between the given constraints.
 * @param  {Float} min - the minimun value
 * @param  {Float} max - the maximum value
 * @return {Float} the random number
 */
const randomNumber = (min, max) =>
  Math.max(min, Math.floor(Math.random() * max));

/**
 * video base field values
 *
 * @desc field values in common for all video types
 */
const videoBaseFieldValues = () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  publishedDate: faker.date.past(),
  thumbnail: 'https://unsplash.it/300/400?random',
  category: faker.lorem.word(),
  slug: faker.helpers.slugify(faker.lorem.sentence()),
  length: faker.random.number(),
});

/**
 * random video id
 *
 * @desc   Get a random video ID for youtube or brightcove
 * @param  {String} sourceService - "youtube" or "brightcove"
 * @return {String} the video ID
 */
const randomVideoId = (sourceService) => {

  // Brightcove video IDs from their API docs. Not 100% sure that they're real!
  const videos = {
    youtube: [
      '_LEWoTDoLNI',
      'nPHIZw7HZq4',
      'n1dcG4EeywY',
      'iW1w1ryYQDw',
    ],
    brightcove: [
      '1969773900001',
      '1969773902001',
      '1969867339001',
    ],
  };

  const randomIndex = Math.floor(Math.random() * videos[sourceService].length);

  return videos[sourceService][randomIndex];
};

/**
 * subset from array
 *
 * Create an array of ${array} values, make it a Set for uniqueness, but return
 * an array. Oh jeebus.
 *
 * @desc    Get a random subset of unique values from an array, up to maxCount.
 * @param   {Array} sourceArray  - array of source values.
 * @param   {Number} maxCount - maximum array size to return.
 * @returns {Array}
 */
const subsetFromArray = (sourceArray, maxCount) =>
  Array.from(new Set(Array.from(Array(maxCount)).map(() =>
    faker.random.arrayElement(sourceArray)
  )));

 /**
 * Array from Generator
 *
 * @desc    Generate an array with a given generator.
 * @param   {Function} generator  - the generator to use for creating values
 * @param   {Number}   count      - array size to return
 * @returns {Array}
 */
const arrayFromGenerator = (generator, count) =>
  Array.from(Array(count)).map(() =>
    generator()
  );

/**
 * create youtube videos
 *
 * @desc   Create dummy Youtube videos.
 * @return {Array}
 */
const createYoutubeVideos = () =>
  Array.from(Array(nodeCounts.youtubesCount)).map(() =>
    addYoutubeVideo({
      ...videoBaseFieldValues(),
      youtubeId: randomVideoId('youtube'),
    })
  );

/**
 * create brightcove videos
 *
 * @desc   Create dummy Brightcove videos.
 * @return {Array}
 */
const createBrightcoveVideos = () =>
  Array.from(Array(nodeCounts.brightcovesCount)).map(() =>
    addBrightcoveVideo({
      ...videoBaseFieldValues(),
      brightcoveId: randomVideoId('brightcove'),
    })
  );

/**
 * create images.
 *
 * @desc    Create dummy image content.
 * @returns {Array}
 */
const createImages = () =>
  Array.from(Array(nodeCounts.imagesCount)).map(() => {

    // Set width and height for this image.
    const width = faker.random.number({
      max: 1600,
      min: 800,
    });
    const height = faker.random.number({
      max: 1200,
      min: 600,
    });

    return addImage({
      url: `https://unsplash.it/${width}/${height}?random`,
      alt: faker.lorem.words(9),
      width,
      height,
    });
  });

/**
 * create authors
 *
 * @desc    Create dummy content authors.
 * @returns {Array}
 */
const createAuthors = () => {

  // Array of available departments.
  const departments = arrayFromGenerator(faker.company.companyName, 10);

  return Array.from(Array(nodeCounts.authorsCount)).map(() =>
    addAuthor({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      department: faker.random.arrayElement(departments),
      avatar: 'https://unsplash.it/300?random',
    })
  );
};

/**
 * create rich text paragraph
 *
 * @desc Generate a paragraph with various span elements.
 * @returns {String}
 */
const createRichTextParagraph = () => {
  const spans = [
    // Emphasized.
    (word) => `<em>${word}</em>`,

    // Strong emphasized.
    (word) => `<strong>${word}</strong>`,

    // Simple link
    (word) => `<a href="#" class="Link">${word}</a>`,

    // Raw link
    (word) => `<a href="#" class="RawLink">${word}</a>`,

    // Guider link
    (word) => `<a href="#" class="GuiderLink">${word}<i class="fa fa-toggle-right"></i></a>`,

    // In page anchor
    (word) => `<a href="#" class="AnchorLink">${word}<i class="fa fa-chevron-down"></i></a>`,
  ];

  const words = faker.lorem.paragraph(spans.length * 3).split(' ');
  const indices = shuffle(range(words.length)).splice(0, spans.length);
  const richtext = words.map(
    (value, index) => (
      indices.indexOf(index) > -1 ? spans[indices.indexOf(index)](value) : value
    )
  );
  return `<p>${richtext.join(' ')}</p>`;
};

/**
 * create list
 *
 * @desc Recursively build nested HTML lists.
 * @param depth {Integer}
 * @param items {Integer}
 * @return {String}
 */
const createList = (type, depth, items) => (depth === 0 ? [] : [
  `<${type}>`,
  range(items).map(() => `<li>${[faker.lorem.sentence(), createList(type, depth - 1, items)].join('')}</li>`)
  .join(''),
  `</${type}>`,
].join(''));

/**
 * create rich text block
 *
 * @desc Create a block with mixed rich text elements.
 * @returns {String}
 */
const createRichTextBlock = () => [
  createRichTextParagraph(),
  `<h2>${faker.lorem.sentence()}</h2>`,
  createRichTextParagraph(),
  '<div class="AdZone"><div style="width: 200px; height: 300px"></div></div>',
  createList('ol', 2, 3),
  createList('ul', 2, 3),
].join('');

/**
 * create body components
 *
 * @desc    Create a set of dummy content body components.
 * @param   {Object} state - the state containing the values of previous steps
 * @returns {Array}
 */
const createBodyComponents = (state) => [
  {
    kind: 'text',
    text: createRichTextBlock(),
  },
  {
    kind: 'text',
    gallery: subsetFromArray(state.images, randomNumber(3, 15)),
  },
  {
    kind: 'quote',
    text: faker.lorem.paragraph(),
    author: faker.name.findName(),
  },
  {
    kind: 'youtube',
    post: `https://www.youtube.com/watch?v=${randomVideoId('youtube')}`,
  },
  {
    kind: 'image',
    image: faker.random.objectElement(state.images),
  },
];

/**
 * create articles
 *
 * @desc    Create dummy content articles.
 * @param   {Object} state - the state containing the values of previous steps
 * @returns {Array}
 */
const createArticles = (state) => {

  // Array of available tags.
  const tags = arrayFromGenerator(faker.lorem.word, 10);

  // Max number of tags per article.
  const maxTags = 4;
  const minTags = 1;

  // Max and min number of body components per article.
  const maxComponents = 10;
  const minComponents = 3;

  return Array.from(Array(nodeCounts.articlesCount)).map(() => {
    const numComponents = randomNumber(minComponents, maxComponents);
    const numTags = randomNumber(minTags, maxTags);

    return addArticle({
      title: faker.lorem.sentence(),
      teaserImage: faker.random.arrayElement(state.images),
      author: faker.random.arrayElement(state.authors),
      tags: subsetFromArray(tags, numTags),
      shareCount: randomNumber(1, 100),
      commentCount: randomNumber(1, 100),
      lead: faker.lorem.paragraph(),
      body: Array
        .from(Array(numComponents))
        .map(() => faker.random.arrayElement(createBodyComponents(state))),
    });
  });
};

export default {
  images: createImages,
  youtubeVideos: createYoutubeVideos,
  brightcoveVideos: createBrightcoveVideos,
  authors: createAuthors,
  articles: createArticles,
};
