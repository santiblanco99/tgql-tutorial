import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';
import Express, { urlencoded } from 'express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import { getComplexity, fieldExtensionsEstimator, simpleEstimator } from 'graphql-query-complexity';

const main = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  } as mongoose.ConnectOptions;
  mongoose.connect(
    'mongodb+srv://postgres:postgres@typegrapgh-example.q5bs8.mongodb.net/typegraph-example?retryWrites=true&w=majority',
    options,
  );
  const schema = await buildSchema({
    resolvers: [`${__dirname}/modules/**/*.ts`],
  });
  const apolloServer = new ApolloServer(
    {
      schema,
      context: ({ req }:any) => ({ req }),
      // Create a plugin that will allow for query complexity calculation for every request
      plugins: [
        {
          requestDidStart: () => ({
            didResolveOperation({ request, document }) {
            /**
             * This provides GraphQL query analysis to be able to
             *  react on complex queries to your GraphQL server.
             * This can be used to protect your GraphQL servers
             * against resource exhaustion and DoS attacks.
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
             */
              const complexity = getComplexity({
              // Our built schema
                schema,
                // To calculate query complexity properly,
                // we have to check only the requested operation
                // not the whole document that may contains multiple operations
                operationName: request.operationName,
                // The GraphQL query document
                query: document,
                // The variables for our GraphQL query
                variables: request.variables,
                // Add any number of estimators. The estimators are invoked in order, the first
                // numeric value that is being returned by an estimator is
                // used as the field complexity.
                // If no estimator returns a value, an exception is raised.
                estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                  fieldExtensionsEstimator(),
                  // Add more estimators here...
                  // This will assign each field a complexity of 1
                  // if no other estimator returned a value.
                  simpleEstimator({ defaultComplexity: 1 }),
                ],
              });
              // Here we can react to the calculated complexity,
              // like compare it with max and throw error when the threshold is reached.
              if (complexity > 20) {
                throw new Error(
                  `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`,
                );
              }
              // And here we can e.g. subtract the complexity point from hourly API calls limit.
              console.log('Used query complexity points:', complexity);
            },
          }),
        } as any,
      ],
    },
  );
  const app = Express();
  // for parsing multipart/form-data
  app.use(urlencoded({ extended: true }));
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => console.log('server started on http://localhost:4000/graphql'));
};

main();
