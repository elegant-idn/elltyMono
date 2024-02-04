import { ApiProperty } from '@nestjs/swagger';






export class PlanDto {
  @ApiProperty()
  product_id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ default: "YEAR" })
  interval_unit:string = "YEAR";
  @ApiProperty({ default: 1 })
  interval_count:number = 1;
  @ApiProperty()
  tenure_type:string = "REGULAR";
  @ApiProperty()
  value: number;
  // @ApiProperty()
  // currency:string = "USD";
}

// export class CreateDiscountPlan {
//   couponId: string;
//   interval: string;
// }
