import NextAuth, { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/config/prisma';

const options: NextAuthOptions = {
  callbacks: {
    async session({ session, user }: any) {
      const newSession = (await prisma.session.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          expires: 'desc',
        },
      })) as any;
      return {
        ...session,
        user: newSession?.user,
        token: newSession?.sessionToken,
      };
    },
  },
  providers: [
    Auth0Provider({
      wellKnown: `https://${process.env.AUTH0_DOMAIN}/`,
      issuer: process.env.AUTH0_DOMAIN,
      authorization: {
        params: {
          response_type: 'code',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/auth0`,
        },
      },
      clientId: process.env.AUTH0_CLIENT_ID || '', // Asignar un valor predeterminado vacío si es undefined
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '', // Asignar un valor predeterminado vacío si es undefined
    }),
  ],
  secret: process.env.AUTH0_CLIENT_SECRET || '', // Asignar un valor predeterminado vacío si es undefined
  adapter: PrismaAdapter(prisma),
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
export { options };
