/* eslint-disable class-methods-use-this */
import { MyContext } from 'src/types/MyContext';
import {
  Query, Resolver, Ctx,
} from 'type-graphql';
import { User, UserModel } from '../../entity/User';

  @Resolver()
export class MeResolver {
      @Query(() => User, { nullable: true, complexity: 5 })
  async me(@Ctx() ctx:MyContext):Promise<User | null> {
    ctx.validateToken(ctx.req);
    console.log(ctx.req.body);
    if (!ctx.req.body.authId) {
      return null;
    }
    return UserModel.findById(ctx.req.body.authId);
  }
}
