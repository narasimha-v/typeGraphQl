import { Length, IsEmail, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PasswordInput } from '../shared/PasswordInput';
import { isEmailAlreadyExists } from './isEmailAlreadyExists';

@InputType()
export class RegisterInput extends PasswordInput {
	@Field()
	@Length(1, 255)
	firstName!: string;

	@Field()
	@Length(1, 255)
	lastName!: string;

	@Field()
	@IsEmail()
	@isEmailAlreadyExists({ message: 'Email already in use.' })
	email!: string;
}
