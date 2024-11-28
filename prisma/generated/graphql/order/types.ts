import { gql } from 'apollo-server-micro';

const OrderTypes = gql`
  type Order {
    id: ID!
    total: Int!
    status: String!
    createdAt: DateTime!
    createdBy: String!
    user: User!
    productChange: String
    product: Products
  }

  type Query {
    orders: [Order]
    order(id: String!): Order
  }

  input OrderCreateInput {
    total: Int!
    status: String!
    createdBy: String!
    productChange: String
  }

  input OrderWhereUniqueInput {
    id: String!
  }

  input OrderUpdateInput {
    total: IntInput
    status: StringInput
    createdBy: StringInput
    productChange: StringInput
  }

  type Mutation {
    createOrder(data: OrderCreateInput): Order

    updateOrder(where: OrderWhereUniqueInput!, data: OrderUpdateInput): Order

    deleteOrder(where: OrderWhereUniqueInput!): Order
  }
`;
export { OrderTypes };
