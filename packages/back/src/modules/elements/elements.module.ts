import {Module} from '@nestjs/common';
import {ElementsService} from './services/elements.service';
import {ElementsController} from './elements.controller';
import {MongooseModule} from "@nestjs/mongoose";
const mongoosePaginate = require("mongoose-paginate-v2")
import {UserTemplate, UserTemplateSchema} from "../../schemas/userTemplates.schema";
import {Color, ColorSchema} from "../../schemas/color.schema";
import {Category, CategorySchema} from "../../schemas/category.schema";
import {Tag, TagSchema} from "../../schemas/tag.schema";
import {MulterModule} from "@nestjs/platform-express";
import {AuthModule} from "../auth/auth.module";
import {PassportModule} from "@nestjs/passport";
import {Element, ElementSchema} from "../../schemas/element.schema";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Element.name,
                useFactory: () => {
                    const schema = ElementSchema;
                    schema.plugin(mongoosePaginate);
                    return schema;
                },
            },
            {
                name: Color.name, useFactory: () => {
                    const schema = ColorSchema;
                    schema.plugin(mongoosePaginate);
                    return schema;
                },
            },
            {
                name: Category.name, useFactory: () => {
                    const schema = CategorySchema;
                    schema.plugin(mongoosePaginate);
                    return schema;
                },
            },
            {
                name: Tag.name, useFactory: () => {
                    const schema = TagSchema;
                    schema.plugin(mongoosePaginate);
                    return schema;
                },
            },
        ]),
        MulterModule.register({
            dest: '../static/static/elements/',
        }),
        AuthModule,
        PassportModule,
    ],
    controllers: [ElementsController],
    providers: [ElementsService]
})
export class ElementsModule {
}
