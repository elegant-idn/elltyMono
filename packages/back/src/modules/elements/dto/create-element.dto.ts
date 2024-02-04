import {ApiProperty} from "@nestjs/swagger";

export class CreateElementDto {

    @ApiProperty()
        // @IsString()
    title: string;

    @ApiProperty()
        // @IsString()
    categories: string;

    @ApiProperty()
        // @IsString()
    colors: string;

    @ApiProperty()
        // @IsString()
    tags: string;

    @ApiProperty()
        // @IsString()
    status: string;

    @ApiProperty({type: 'string', format: 'binary'})
    data: any
}