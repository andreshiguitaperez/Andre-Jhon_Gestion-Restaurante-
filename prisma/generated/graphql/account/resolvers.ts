import prisma from 'config/prisma';

const AccountResolvers = {
  Account: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId, // Este sigue siendo el ID del usuario
        },
      });
    },
  },
  Query: {
    accounts: async () => {
      return await prisma.account.findMany({});
    },
    account: async (_: any, args: any) => {
      return await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: args.provider,  // Aquí usas 'provider' y 'providerAccountId'
            providerAccountId: args.providerAccountId, // Debes pasar estos dos campos
          },
        },
      });
    },
  },
  Mutation: {
    createAccount: async (_: any, args: any) => {
      return await prisma.account.create({
        data: { ...args.data },
      });
    },
    updateAccount: async (_: any, args: any) => {
      return await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: args.where.provider,  // Debes pasar los dos campos de la clave compuesta
            providerAccountId: args.where.providerAccountId,
          },
        },
        data: { ...args.data },
      });
    },
    deleteAccount: async (_: any, args: any) => {
      return await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider: args.where.provider,  // Lo mismo aquí, usa los dos campos
            providerAccountId: args.where.providerAccountId,
          },
        },
      });
    },
  },
};

export { AccountResolvers };
