import {
  Mutation, Resolver, Arg,
} from 'type-graphql';
import { UserModel } from '../../entity/User';

    @Resolver()
export class ConfirmUserResolver {
        @Mutation(() => Boolean, { nullable: true })
  async confirmUser(
            @Arg('token') token:string,

  ):Promise<boolean> {
    const user = await UserModel.findOne({ confirmToken: token });
    const currentDate = Date.now();
    if (!user || currentDate > user.confirmExpires) {
      return false;
    }
    await user.update({
      confirmed: true,
      confirmToken: undefined,
      confirmExpires: undefined,
    });
    return true;
  }
}
