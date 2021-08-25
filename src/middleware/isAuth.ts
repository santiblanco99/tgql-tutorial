import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { MyContext } from '../types/MyContext';
import { UserModel } from '../entity/User';

export const isAuth:MiddlewareFn = async (params, next) => {
  const context = params.context as MyContext;
  const { req } = context;
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) {
    throw new Error('No auth header present');
  }
  const authorized = await new Promise<boolean>((resolve, reject) => {
    jwt.verify(token, 'secret token', async (err: any, id:any) => {
      if (err) {
        reject(err);
      }
      const user = await UserModel.findById(id);
      if (!user) {
        resolve(false);
      }
      resolve(true);
    });
  });
  if (!authorized) {
    throw new Error('No user found with that token');
  }
  return next();
};
