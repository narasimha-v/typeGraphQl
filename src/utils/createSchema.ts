import { buildSchema } from 'type-graphql';
import path from 'path';

export const createSchema = () => {
	return buildSchema({
		resolvers: [path.join(__dirname, '../modules/**/*.ts')],
		authChecker: ({ context: { req } }, roles) => {
			return !!req.session.userId;
		}
	});
};
