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
          identifier_token: {  // Aquí usamos el identificador compuesto
            identifier: args.id,  // Suponiendo que 'id' es el 'identifier' del token
            token: args.token,     // Si también se pasa el token, úsalo
          },
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
          identifier_token: {  // Aquí usamos el identificador compuesto
            identifier: args.where.identifier,
            token: args.where.token, // Usa también el token para la actualización
          },
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
          identifier_token: {  // Aquí usamos el identificador compuesto
            identifier: args.where.identifier,
            token: args.where.token, // Usa también el token para la eliminación
          },
        },
      });
    },
  },
};

export { VerificationTokenResolvers };
