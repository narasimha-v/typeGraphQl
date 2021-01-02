import { Resolver, Mutation, Arg } from 'type-graphql';
import { confirmationPrefix } from '../../constants/redisPrefixes';

import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver()
export class ConfirmUserResolver {
	@Mutation(() => Boolean)
	async confirmUser(@Arg('token') token: string): Promise<boolean> {
		const userId = Number(await redis.get(confirmationPrefix + token));
		if (!userId) return false;
		await User.update({ id: userId }, { confirmed: true });
		await redis.del(confirmationPrefix + token);
		return true;
	}
}
