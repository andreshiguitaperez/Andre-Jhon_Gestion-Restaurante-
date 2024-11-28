import { gql } from 'apollo-server-micro';

const UserTypes = gql`
  type User {
    id: ID!
    name: String
    email: String
    emailVerified: DateTime
    image: String
    role: Enum_RoleName!
    accounts: [Account]
    sessions: [Session]
    deleted: Boolean!
    eneabled: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    profile: Profile
    products: [Products]
    orders: [Order]
  }

  type Query {
    users: [User]
    user(id: String!): User
  }

  input UserCreateInput {
    name: String
    email: String
    emailVerified: DateTime
    image: String
    role: Enum_RoleName!
    deleted: Boolean!
    eneabled: Boolean!
  }

  input UserWhereUniqueInput {
    id: String!
  }

  input UserUpdateInput {
    name: StringInput
    email: StringInput
    emailVerified: DateTimeInput
    image: StringInput
    role: Enum_RoleNameInput
    deleted: BooleanInput
    eneabled: BooleanInput
  }

  input UpdateUserRoleInput {
    userId: String!
    role: Enum_RoleName!
  }

  type Mutation {
    createUser(data: UserCreateInput): User
    updateUser(where: UserWhereUniqueInput!, data: UserUpdateInput): User
    deleteUser(where: UserWhereUniqueInput!): User
    updateUserRole(userId: String!, role: Enum_RoleName!): User
  }
`;

export { UserTypes };
