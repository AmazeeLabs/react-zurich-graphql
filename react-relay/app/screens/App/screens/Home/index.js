import React from 'react';
import Relay, { createContainer } from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import styles from './styles.css';

const Home = ({ viewer }) => (
  <div className={`${styles.Wrapper}`}>
    <Helmet title="Home" />
    <h1>Hello World!</h1>
    <div>Welcome to the React Zuerich Meetup and welcome to the AmazeeLabs office!</div>

    <div>We have got a total of {viewer.total.count} persons in the database.</div>
    <h2>Here are a few of them ...</h2>
    <ul>
      {viewer.list.edges.map(({ node }) => (
        <li key={node.id}><Link to={`/person/${node.id}`}>{node.firstName} {node.lastName}</Link></li>
      ))}
    </ul>
  </div>
);

export default createContainer(Home, {
  fragments : {
    viewer : () => Relay.QL`
      fragment on Viewer {
        total:allPersons {
          count
        }

        list:allPersons(first: 20) {
          edges {
            node {
              id
              firstName
              lastName
            }
          }
        }
      }
    `,
  },
});
