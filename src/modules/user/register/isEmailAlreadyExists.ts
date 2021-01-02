import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistsConstraint
	implements ValidatorConstraintInterface {
	async validate(
		email: string,
		validationArguments?: ValidationArguments
	): Promise<boolean> {
		const user = await User.findOne({ where: { email } });
		return !user;
	}
}

export function isEmailAlreadyExists(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsEmailAlreadyExistsConstraint
		});
	};
}
