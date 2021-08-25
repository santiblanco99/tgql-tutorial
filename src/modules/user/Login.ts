/* eslint-disable class-methods-use-this */
import {
  Mutation, Resolver, Arg,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../auth/jwt';
import { UserModel } from '../../entity/User';

  @Resolver()
export class LoginResolver {
      @Mutation(() => String, { nullable: true })
  async login(
          @Arg('email') email:string,
          @Arg('password') password:string,
  ):Promise<string | null> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    if (!user.confirmed) {
      return null;
    }
    return generateAccessToken(user.id);
  }
}
