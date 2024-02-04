import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ObjectIdDto} from "../../templates/dto/objectId.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Category, CategoryDocument} from "../../../schemas/category.schema";
import {Model} from "mongoose";
import {CreateCategory} from "../../templates/dto/create-additions.dto";

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async getCategories() {
        return await this.categoryModel.find().exec();
    }

    async CreateCategory(CreateCategory: CreateCategory) {
        try {
            return await this.categoryModel.create(CreateCategory)
        } catch (e) {
            return new HttpException("something going wrong, please try again", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async DeleteCategory({id}: ObjectIdDto) {
        const response = await this.categoryModel.findByIdAndDelete({_id: id}).exec()
        if (!response) {
            return new HttpException("category not found", HttpStatus.NOT_FOUND)
        }
        return {
            success: true,
            message: "category successfully deleted"
        }
    }
}
