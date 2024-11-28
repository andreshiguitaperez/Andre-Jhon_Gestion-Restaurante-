import { gql } from 'apollo-server-micro';

const ProfileTypes = gql`
  type Profile {
    id: ID!
    firstName: String!
    lastName: String!
    bio: String
    image: String
    user: User!
    userId: String!
  }

  type Query {
    profiles: [Profile]
    profile(id: String!): Profile
  }

  input ProfileCreateInput {
    firstName: String!
    lastName: String!
    bio: String
    image: String
    userId: String!
  }

  input ProfileWhereUniqueInput {
    id: String!
  }

  input ProfileUpdateInput {
    firstName: StringInput
    lastName: StringInput
    bio: StringInput
    image: StringInput
    userId: StringInput
  }

  type Mutation {
    createProfile(data: ProfileCreateInput): Profile

    updateProfile(
      where: ProfileWhereUniqueInput!
      data: ProfileUpdateInput
    ): Profile

    deleteProfile(where: ProfileWhereUniqueInput!): Profile
  }
`;
export { ProfileTypes };
