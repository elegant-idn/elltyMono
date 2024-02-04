import { ApiProperty } from "@nestjs/swagger";

export class CreateStripePayDto {
  @ApiProperty({default:'Pro Account'})
  name:string='Pro Account';
  @ApiProperty({default:'usd'})
  currency:string='usd';
  @ApiProperty({default:50})
  amount:number=50;


}
