import {IsNotEmpty} from "class-validator";

export class FileUploadDto{
    @IsNotEmpty()
    buffer:Buffer
    @IsNotEmpty()
    mimetype:string
    @IsNotEmpty()
    size:number
}