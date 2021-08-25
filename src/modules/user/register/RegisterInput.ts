import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PasswordInput } from '../../../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordInput {
    @Field()
    @Length(1, 255)
    firstName:string;

    @Length(1, 255)
    @Field()
    lastName:string;

    @Field()
    email:string;
}
