import { IsArray } from 'class-validator';

export class TrashPatchDto {
  @IsArray()
  ids: string[];
}
