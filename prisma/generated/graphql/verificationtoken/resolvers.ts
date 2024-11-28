import prisma from 'config/prisma';

const VerificationTokenResolvers = {
  VerificationToken: {},
  Query: {
    verificationTokens: async () => {
      return await prisma.verificationToken.findMany({});
    },
    verificationToken: async (_: any, args: any) => {
      return await prisma.verificationToken.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createVerificationToken: async (_: any, args: any) => {
      return await prisma.verificationToken.create({
        data: {
          ...args.data,
          expires: new Date(args.data.expires).toISOString(),
        },
      });
    },
    updateVerificationToken: async (_: any, args: any) => {
      return await prisma.verificationToken.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          ...(args.data.expires && {
            expires: new Date(args.data.expires).toISOString(),
          }),
        },
      });
    },
    deleteVerificationToken: async (_: any, args: any) => {
      return await prisma.verificationToken.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { VerificationTokenResolvers };
