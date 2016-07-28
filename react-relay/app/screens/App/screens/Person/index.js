import React from 'react';
import Relay, { createContainer } from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import styles from './styles.css';

const Person = ({ person }) => (
  <div className={styles.Wrapper}>
    <Helmet title="Person" />
    <h1>{person.firstName} {person.lastName}</h1>
    <h3>Friends</h3>
    <ul>
      {person.friends.edges.map(({ node }) => (
        <li><Link to={`/person/${node.id}`}>{node.firstName} {node.lastName}</Link></li>
      ))}
    </ul>
    <Link to="/">Back</Link>
  </div>
);

export default createContainer(Person, {
  fragments : {
    person : () => Relay.QL`
      fragment on Person {
        firstName
        lastName
        friends(first: 10) {
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
