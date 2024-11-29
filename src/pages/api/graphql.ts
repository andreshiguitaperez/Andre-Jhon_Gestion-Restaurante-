import 'reflect-metadata';
import 'ts-tiny-invariant';
import { ApolloServer } from 'apollo-server-micro';
import { customTypes } from '@/graphql/custom/types';
import { resolvers } from '@/prisma/generated/graphql/resolvers';
import { types } from '@/prisma/generated/graphql/types';
import { PrismaClient } from '@prisma/client';
import prisma from '@/src/config/prisma';
import Cors from 'micro-cors';
import { customResolvers } from '@/graphql/custom/resolvers';
import { IncomingMessage, ServerResponse } from 'http';

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS', 'GET', 'HEAD'],
});

interface Context {
  prisma: PrismaClient;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const functionHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const apolloServer = new ApolloServer({
    context: (): Context => ({ prisma }),
    typeDefs: [...types, ...customTypes],
    resolvers: [...resolvers, ...customResolvers],
    persistedQueries: false, // This disables persisted queries
    cache: 'bounded', // This sets up a bounded cache
    introspection: process.env.NODE_ENV !== 'production', // Habilita introspección en local, pero la desactiva en producción
  });
  
  const startServer = apolloServer.start();
  await startServer;

  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export default cors((req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  return functionHandler(req, res);
});
