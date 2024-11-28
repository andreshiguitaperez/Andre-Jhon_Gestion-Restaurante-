import { gql } from 'apollo-server-micro';

const ProductsTypes = gql`
  type Products {
    id: ID!
    name: String!
    description: String!
    price: Float!
    image: String!
    stock: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: String!
    user: User!
    orders: [Order]
  }

  type Query {
    productss: [Products]
    products(id: String!): Products
  }

  input ProductsCreateInput {
    name: String!
    description: String!
    price: Float!
    image: String!
    stock: Int!
    createdBy: String!
  }

  input ProductsWhereUniqueInput {
    id: String!
  }

  input ProductsUpdateInput {
    name: StringInput
    description: StringInput
    price: FloatInput
    image: StringInput
    stock: IntInput
    createdBy: StringInput
  }

  type Mutation {
    createProducts(data: ProductsCreateInput): Products

    updateProducts(
      where: ProductsWhereUniqueInput!
      data: ProductsUpdateInput
    ): Products

    deleteProducts(where: ProductsWhereUniqueInput!): Products
  }
`;
export { ProductsTypes };
