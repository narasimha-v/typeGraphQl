import { v4 as uuid } from 'uuid';

import { redis } from '../redis';
import { confirmationPrefix } from '../constants/redisPrefixes';

export const createConfirmationUrl = async (userId: number) => {
	const token = uuid();
	await redis.set(confirmationPrefix + token, userId, 'ex', 60 * 60 * 24);
	return `http://localhost:3000/user/confirm/${token}`;
};
