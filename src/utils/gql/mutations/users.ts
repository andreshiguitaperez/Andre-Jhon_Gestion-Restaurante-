import { gql } from 'apollo-server-micro';

export const CREATE_USER = gql`
  mutation CreateUserCustom($data: UserCustomInput) {
    createUserCustom(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(id: $userId, role: $role) {
      id
      name
      email
      role
    }
  }
`;
