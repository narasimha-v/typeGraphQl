import faker from 'faker';
import { Connection } from 'typeorm';
import { User } from '../entity/User';

import { graphqlCall } from './utils/graphqlCall';
import { testConn } from './utils/testConn';

let conn: Connection;
beforeAll(async () => (conn = await testConn()));
afterAll(async () => await conn.close());

const registerMutation = `
    mutation Register($data: RegisterInput!){
        register(
            data: $data
        ) {
            id
            firstName
            lastName
            email
        }
    }
`;

describe('Register', () => {
	it('create user', async () => {
		const user = {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		};
		const response = await graphqlCall({
			source: registerMutation,
			variableValues: {
				data: user
			}
		});
		const dbUser = await User.findOne({ where: { email: user.email } });
		expect(response).toMatchObject({
			data: {
				register: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				}
			}
		});
		expect(dbUser).toBeDefined();
		expect(dbUser?.confirmed).toBeFalsy();
		expect(dbUser?.email).toBe(user.email);
	});
});
