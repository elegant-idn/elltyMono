import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import {Types} from "mongoose";


export class AddToFolderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  folderId: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  template: string;
}
