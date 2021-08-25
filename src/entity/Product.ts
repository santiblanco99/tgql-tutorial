import {
  Field, ObjectType,
} from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

  @ObjectType()
export class Product {
      @Field()
      _id: string;

      @Field()
      @prop()
      name: string;
}

export const ProductModel = getModelForClass(Product);
