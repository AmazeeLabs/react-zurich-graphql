/**
 * @file    This component is the skeleton around the actual pages, and should
 *          only contain code that should be seen on all pages. (e.g. navigation
 *          bar)
 * @author  Sebastian Siemssen <sebastian@amazeelabs.com>
 * @date    2016-28-07
 */

import React from 'react';
import Helmet from 'react-helmet';
import styles from './styles.css';

const metaData = [
  {
    'http-equiv' : 'content-type',
    content      : 'text/html; charset=utf-8',
  },
  {
    name    : 'charset',
    content : 'UTF-8',
  },
  {
    name    : 'viewport',
    content : 'width=device-width, initial-scale=1',
  },
  {
    name    : 'mobile-web-app-capable',
    content : 'yes',
  },
];

const htmlAttributes = {
  lang : 'en',
  amp  : undefined,
};

const App = (props) => (
  <div className={styles.App}>
    <Helmet
      htmlAttributes={htmlAttributes}
      titleTemplate="React Zuerich Demo - %s"
      defaultTitle="React Zuerich Demo"
      meta={metaData}
    />
    {props.children}
  </div>
);

export default App;
