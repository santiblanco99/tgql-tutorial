/* eslint-disable class-methods-use-this */
import {
  Mutation, Query, Resolver, Arg, UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';
import { isAuth } from '../../middleware/isAuth';
import { User, UserModel } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../../utils/sendEmail';

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => [User])
  async hello():Promise<User[]> {
    return UserModel.find({});
  }

    @Mutation(() => User)
  async register(
        @Arg('data'){
          email, firstName, lastName, password,
        }:RegisterInput,
  ):Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await sendEmail(email, await createConfirmationUrl(user.id));
    return user;
  }
}
