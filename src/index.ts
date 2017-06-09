import 'newrelic';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './data/resolvers';
import schema from './data/schema';
import makeContext from './data/context';

const GRAPHQL_PORT = process.env.PORT;
//const WS_PORT = 8090;

const graphQLServer = express()

graphQLServer.use('*', cors({
  origin: '*',
  credentials: true
}));

const graphqlSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: graphqlSchema,
  context: makeContext(),
}));

graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

graphQLServer.get('/', (req, res) => res.json({ msg: "check /graphiql"}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log('server running'));
