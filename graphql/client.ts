import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';

declare global {
  var apolloGlobal: ApolloClient<object>;
}

let client: ApolloClient<object>;

const graphqlUri =
  process.env.NODE_ENV === 'production'
    ? 'https://andre-jhon-gestion-restaurante.vercel.app/api/graphql' // Producción
    : 'http://localhost:3000/api/graphql'; // Local

if (process.env.NODE_ENV === 'production') {
  client = new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    link: from([
      new HttpLink({
        uri: graphqlUri,
      }),
    ]),
    connectToDevTools: false,
  });
} else {
  if (!global.apolloGlobal) {
    global.apolloGlobal = new ApolloClient({
      cache: new InMemoryCache(),
      link: from([
        new HttpLink({
          uri: graphqlUri,
        }),
      ]),
      connectToDevTools: true,
    });
  }
  client = global.apolloGlobal;
}

export { client };
