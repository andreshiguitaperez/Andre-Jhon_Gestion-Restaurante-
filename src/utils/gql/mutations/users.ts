import { gql } from 'apollo-server-micro';

export const CREATE_USER = gql`
  mutation CreateUserCustom($data: UserCustomInput) {
    createUserCustom(data: $data) {
      id
      name
    }
  }
`;
