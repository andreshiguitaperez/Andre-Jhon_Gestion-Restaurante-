import { gql } from 'apollo-server-micro';

const VerificationTokenTypes = gql`
  type VerificationToken {
    identifier: String!
    token: String!
    expires: DateTime!
  }

  type Query {
    verificationTokens: [VerificationToken]
    verificationToken(id: String!): VerificationToken
  }

  input VerificationTokenCreateInput {
    identifier: String!
    token: String!
    expires: DateTime!
  }

  input VerificationTokenWhereUniqueInput {
    id: String!
  }

  input VerificationTokenUpdateInput {
    identifier: StringInput
    token: StringInput
    expires: DateTimeInput
  }

  type Mutation {
    createVerificationToken(
      data: VerificationTokenCreateInput
    ): VerificationToken

    updateVerificationToken(
      where: VerificationTokenWhereUniqueInput!
      data: VerificationTokenUpdateInput
    ): VerificationToken

    deleteVerificationToken(
      where: VerificationTokenWhereUniqueInput!
    ): VerificationToken
  }
`;
export { VerificationTokenTypes };
