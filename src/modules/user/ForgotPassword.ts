import {
  Mutation, Resolver, Arg,
} from 'type-graphql';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import { UserModel } from '../../entity/User';

      @Resolver()
export class ForgotPasswordResolver {
          @Mutation(() => Boolean, { nullable: true })
  async forgotPassword(@Arg('email') email:string):Promise<boolean> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return true;
    }
    const token = jwt.sign(
      { id: user.id },
      'FORGOT_PASSWORD_TOKEN',
      { expiresIn: '1d' },
    );
    const url = `http://localhost:3000/user/change-password/${token}`;
    await sendEmail(email, url);
    return true;
  }
}
