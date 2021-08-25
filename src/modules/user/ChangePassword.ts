/* eslint-disable class-methods-use-this */
import {
  Mutation, Resolver, Arg,
} from 'type-graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel, User } from '../../entity/User';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';

    @Resolver()
export class ChangePasswordResolver {
        @Mutation(() => User, { nullable: true })
  async changePassword(
            @Arg('data') { token, password }:ChangePasswordInput,
  ):Promise<User | null> {
    const tokenUser = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, 'FORGOT_PASSWORD_TOKEN', (err, resp) => {
        if (err) {
          reject(err);
        }
        resolve(resp);
      });
    });
    if (!tokenUser) {
      return null;
    }
    const user = await UserModel.findOne({ _id: tokenUser.id });
    if (!user) {
      return null;
    }
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    return user;
  }
}
