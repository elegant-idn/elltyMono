import { PartialType } from '@nestjs/mapped-types';
import { CreateStripePayDto } from './create-stripe-pay.dto';

export class UpdateStripePayDto extends PartialType(CreateStripePayDto) {}
