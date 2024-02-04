import { IsString } from 'class-validator';

export class PatchDto {
  @IsString()
  title: string;
}
