import prisma from 'config/prisma';

const SessionResolvers = {
  Session: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId, // Este sigue siendo el ID del usuario, no el de la sesión
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
          sessionToken: args.sessionToken,  // Cambié de 'id' a 'sessionToken'
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
          sessionToken: args.where.sessionToken,  // Cambié de 'id' a 'sessionToken'
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
          sessionToken: args.where.sessionToken,  // Cambié de 'id' a 'sessionToken'
        },
      });
    },
  },
};

export { SessionResolvers };
