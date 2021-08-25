/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { ReturnModelType } from '@typegoose/typegoose';
import {
  Arg, ClassType, Field, InputType, Mutation, Resolver,
} from 'type-graphql';
import { Product, ProductModel } from '../../entity/Product';
import { User, UserModel } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';

const createResolver = <T extends ClassType, X extends ClassType>(
  suffix: string, returnType: T, inputType: X, entity: ReturnModelType<any, any>) => {
    @Resolver()
  class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
      async create(
            @Arg('data', () => inputType) data: typeof inputType,
      ) {
        return entity.create(data);
      }
    }
    return BaseResolver;
};
@InputType()
class ProductInput {
    @Field()
    name: string;
}

export const BaseCreateUser = createResolver('User', User, RegisterInput, UserModel);
export const BaseCreateProduct = createResolver('Product', Product, ProductInput, ProductModel);
