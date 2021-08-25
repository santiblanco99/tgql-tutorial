import {
  Field, ObjectType, Root,
} from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class User {
    @Field()
    _id: string;

    @Field()
    @prop()
    firstName: string;

    @Field()
    @prop()
    lastName: string;

    @Field()
    @prop({ unique: true })
    email: string;

    @Field({ complexity: 3 })
    name(@Root() parent:any):string {
      return `${parent.firstName} ${parent.lastName}`;
    }

    @prop()
    password: string;

    @prop({ default: false })
    confirmed: boolean;

    @prop()
    confirmToken: string;

    @prop()
    confirmExpires: number;
}

export const UserModel = getModelForClass(User);
