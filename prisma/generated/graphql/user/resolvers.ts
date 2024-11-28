import prisma from 'config/prisma';

const UserResolvers = {
  User: {
    accounts: async (parent: any, _: any) => {
      return await prisma.account.findMany({
        where: {
          user: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    sessions: async (parent: any, _: any) => {
      return await prisma.session.findMany({
        where: {
          user: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    profile: async (parent: any, _: any) => {
      return await prisma.profile.findUnique({
        where: {
          userId: parent.id,
        },
      });
    },
    products: async (parent: any, _: any) => {
      return await prisma.products.findMany({
        where: {
          user: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    orders: async (parent: any, _: any) => {
      return await prisma.order.findMany({
        where: {
          user: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
  },
  Query: {
    users: async () => {
      return await prisma.user.findMany({});
    },
    user: async (_: any, args: any) => {
      return await prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      return await prisma.user.create({
        data: {
          ...args.data,
          emailVerified: new Date(args.data.emailVerified).toISOString(),
        },
      });
    },
    updateUser: async (_: any, args: any) => {
      return await prisma.user.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          ...(args.data.emailVerified && {
            emailVerified: new Date(args.data.emailVerified).toISOString(),
          }),
        },
      });
    },
    deleteUser: async (_: any, args: any) => {
      return await prisma.user.delete({
        where: {
          id: args.where.id,
        },
      });
    },

    // Nueva mutación: updateUserRole
    updateUserRole: async (_: any, args: any) => {
      const { userId, role } = args;

      // Verificación de rol válido (opcional)
      if (!["USER", "ADMIN"].includes(role)) {
        throw new Error("El rol proporcionado no es válido. Use 'USER' o 'ADMIN'.");
      }

      // Actualización del rol en la base de datos
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });
    },
  },
};

export { UserResolvers };
