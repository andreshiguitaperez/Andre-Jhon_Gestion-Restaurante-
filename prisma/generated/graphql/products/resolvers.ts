import prisma from 'config/prisma';

const ProductsResolvers = {
  Products: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.createdBy,
        },
      });
    },
  },
  Query: {
    productss: async () => {
      return await prisma.products.findMany({});
    },
    products: async (_: any, args: any) => {
      return await prisma.products.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createProducts: async (_: any, args: any) => {
      return await prisma.products.create({
        data: { ...args.data },
      });
    },
    updateProducts: async (_: any, args: any) => {
      return await prisma.products.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteProducts: async (_: any, args: any) => {
      return await prisma.products.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ProductsResolvers };
