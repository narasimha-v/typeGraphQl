import { createConnection } from 'typeorm';
import path from 'path';

export const testConn = (drop: boolean = false) => {
	return createConnection({
		name: 'default',
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'typegraphql-test',
		synchronize: drop,
		dropSchema: drop,
		entities: [path.join(__dirname, '../../entity/*.*')]
	});
};
