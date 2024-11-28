import prisma from 'config/prisma';

const ProfileResolvers = {
  Profile: {
    user: async (parent: any, _: any) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    },
  },
  Query: {
    profiles: async () => {
      return await prisma.profile.findMany({});
    },
    profile: async (_: any, args: any) => {
      return await prisma.profile.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createProfile: async (_: any, args: any) => {
      return await prisma.profile.create({
        data: { ...args.data },
      });
    },
    updateProfile: async (_: any, args: any) => {
      return await prisma.profile.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteProfile: async (_: any, args: any) => {
      return await prisma.profile.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ProfileResolvers };
