import { gql } from 'apollo-server-micro';

const GET_USERS = gql`
  query Query {
    users {
      role
      name
      image
      id
      email
      deleted
      eneabled
      createdAt
    }
  }
`;

const GET_USER_BY_ID = gql`
  query User($userId: String!) {
    user(id: $userId) {
      name
      email
      image
      role
      deleted
      eneabled
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(id: $userId, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export { GET_USERS, GET_USER_BY_ID, UPDATE_USER_ROLE };
