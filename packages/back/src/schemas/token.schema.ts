import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type TokenDocument = Token & Document;

export enum TokenType {
  desktop = 'desktop',
  mobile = 'mobile',
}

@Schema({ timestamps: true })
export class Token {
  @Prop({
    unique: true,
    required: true,
  })
  token: string;

  @Prop({ default: false })
  blacklisted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ type: String, enum: TokenType, default: TokenType.desktop })
  type: TokenType;

  // expired tokens can be removed from database later on with CRON job
  @Prop({ required: true })
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ type: 1, blacklisted: 1, user: 1 });
