import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import {
	fieldExtensionsEstimator,
	getComplexity,
	simpleEstimator
} from 'graphql-query-complexity';
import { createConnection } from 'typeorm';

import { redis } from './redis';
import { createSchema } from './utils/createSchema';
const main = async () => {
	await createConnection();

	const schema = await createSchema();
	const RedisStore = connectRedis(session);

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
		// Query complexity
		plugins: [
			{
				requestDidStart: () => ({
					didResolveOperation({ request, document }) {
						const complexity = getComplexity({
							schema,
							operationName: request.operationName,
							query: document,
							variables: request.variables,
							estimators: [
								fieldExtensionsEstimator(),
								simpleEstimator({ defaultComplexity: 1 })
							]
						});
						if (complexity > 20) {
							throw new Error(
								`Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
							);
						}
						console.log('Used query complexity points:', complexity);
					}
				})
			}
		]
	});

	const app = express();

	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000'
		})
	);

	app.use(
		session({
			store: new RedisStore({
				client: redis
			}),
			name: 'qid',
			secret: 'SESSION_SECRET',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365
			}
		})
	);

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(`Server is running on port 4000`);
	});
};

main();
