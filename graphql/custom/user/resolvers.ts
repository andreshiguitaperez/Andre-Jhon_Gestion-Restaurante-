import prisma from 'config/prisma';

const UserResolvers = {
  User: {},
  Query: {},
  Mutation: {
    createUserCustom: async (_: any, args: any) => {
      return await prisma.user.create({
        data: {
          name: args.data.name,
          email: args.data.email,
          role: args.data.role,
          accounts: {
            create: {
              provider: args.data.provider,
              providerAccountId: args.data.providerAccountId,
              type: args.data.type,
            },
          },
        },
      });
    },
  },
};

export { UserResolvers };
