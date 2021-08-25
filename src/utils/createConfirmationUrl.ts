import { v4 } from 'uuid';
import { UserModel } from '../entity/User';

export const createConfirmationUrl = async (userId:string) => {
  const token = v4();
  const user = await UserModel.findById(userId);
  if (user) {
    user.confirmToken = token;
    user.confirmExpires = Date.now() + 3600000;
    await user.save();
  }
  return `http://localhost:3000/user/confirm/${token}`;
};
