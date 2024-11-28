import '-/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Layout from '@/src/components/organism/Layout';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/graphql/client';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </SessionProvider>
    </ApolloProvider>
  );
}
