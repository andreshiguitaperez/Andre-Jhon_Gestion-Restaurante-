import { gql } from 'apollo-server-micro';

const GQLEnums = gql`
  enum Enum_RoleName {
    USER
    ADMIN
  }
  input Enum_RoleNameInput {
    set: Enum_RoleName
  }
`;

export { GQLEnums };
