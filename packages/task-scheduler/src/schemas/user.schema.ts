import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { generate } from 'shortid';

import { TemplateDocument } from './template.schema';

export type LanguageTypes = 'en' | 'ru' | 'mx' | 'br' | 'uk';
export const languageList = ['en', 'ru', 'mx', 'br', 'uk'];
export const DEFAULT_DOWNLOADS_COUNTER = 5;
export type UserDocument = User & Document;

export enum UserStatus {
  active = 'active',
  notActive = 'notActive',
  reset = 'reset',
  blocked = 'blocked',
  deleted = 'deleted',
}
export enum Role {
  Designer = 'designer',
  Admin = 'admin',
  User = 'user',
}
export enum UserPlan {
  pro = 'pro',
  free = 'free',
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    default: generate,
    index: true,
    type: String,
    unique: true,
  })
  uuid: string;

  @Prop()
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({
    index: true,
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    default: null,
    index: true,
    type: String,
  })
  hash: string;

  @Prop({
    default: 'https://ellty-images.s3.amazonaws.com/avatars/default.png',
  })
  avatar: string;

  @Prop({
    default: UserStatus.notActive,
    type: String,
  })
  status: UserStatus;

  @Prop({
    type: String,
    default: null,
    expires: 3600,
  })
  confirmationCode: string;

  @Prop({
    type: String,
    default: null,
    expires: 3600,
  })
  resetCode: string;

  @Prop({
    type: Number,
    default: DEFAULT_DOWNLOADS_COUNTER,
  })
  downloadsCounter: number;

  @Prop({
    type: String,
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Prop({
    type: String,
    enum: UserPlan,
    default: UserPlan.free,
  })
  plan: UserPlan;

  @Prop({
    default: null,
  })
  restoreTime: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Template',
    default: [],
  })
  favorites: TemplateDocument[];

  @Prop({
    type: String,
    enum: languageList,
  })
  language: LanguageTypes;
}

export const UserSchema = SchemaFactory.createForClass(User);
