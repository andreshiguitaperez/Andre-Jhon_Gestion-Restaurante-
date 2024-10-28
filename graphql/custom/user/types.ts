import { gql } from 'apollo-server-micro';

const CustomUserTypes = gql`
  type Mutation {
    createUserCustom(data: UserCustomInput): User
  }
`;
