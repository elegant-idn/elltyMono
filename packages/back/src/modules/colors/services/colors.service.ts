import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Color, ColorDocument} from "../../../schemas/color.schema";
import {Model} from "mongoose";

@Injectable()
export class ColorsService {
    constructor(@InjectModel(Color.name) private readonly colorModel: Model<ColorDocument>) {}

    async getColors() {
        return await this.colorModel.find().exec();
    }
}
