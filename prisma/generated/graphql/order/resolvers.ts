import prisma from 'config/prisma';

const OrderResolvers = {
  Order: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.createdBy,
        },
      });
    },
    product: async (parent: any, _: any) => {
      if (parent.productChange) {
        return await prisma.products.findUnique({
          where: {
            id: parent.productChange,
          },
        });
      } else {
        return null;
      }
    },
  },
  Query: {
    orders: async () => {
      return await prisma.order.findMany({});
    },
    order: async (_: any, args: any) => {
      return await prisma.order.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createOrder: async (_: any, args: any) => {
      return await prisma.order.create({
        data: { ...args.data },
      });
    },
    updateOrder: async (_: any, args: any) => {
      return await prisma.order.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteOrder: async (_: any, args: any) => {
      return await prisma.order.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { OrderResolvers };
