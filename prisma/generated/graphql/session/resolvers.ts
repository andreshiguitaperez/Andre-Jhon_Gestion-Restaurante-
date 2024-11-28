import prisma from 'config/prisma';

const SessionResolvers = {
  Session: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    },
  },
  Query: {
    sessions: async () => {
      return await prisma.session.findMany({});
    },
    session: async (_: any, args: any) => {
      return await prisma.session.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createSession: async (_: any, args: any) => {
      return await prisma.session.create({
        data: {
          ...args.data,
          expires: new Date(args.data.expires).toISOString(),
        },
      });
    },
    updateSession: async (_: any, args: any) => {
      return await prisma.session.update({
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
    deleteSession: async (_: any, args: any) => {
      return await prisma.session.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { SessionResolvers };
