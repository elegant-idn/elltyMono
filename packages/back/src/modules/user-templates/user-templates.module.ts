import {forwardRef, Module} from '@nestjs/common';
import {UserTemplatesService} from './services/user-templates.service';
import {UserTemplatesController} from './user-templates.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserTemplate, UserTemplateSchema} from "../../schemas/userTemplates.schema";
import {FoldersModule} from "../folders/folders.module";
import {DesignerTemplate, DesignerTemplateSchema} from "../../schemas/designerTemplates.schema";
const autoPopulate = require("mongoose-autopopulate")

@Module({
    imports: [
        FoldersModule,
        MongooseModule.forFeatureAsync([
            {
                name: UserTemplate.name,
                useFactory: () => {
                    const schema = UserTemplateSchema;
                    schema.plugin(autoPopulate)
                    return schema;
                },
            },
            {
                name: DesignerTemplate.name,
                useFactory: () => {
                    const schema = DesignerTemplateSchema;
                    schema.plugin(autoPopulate)
                    return schema;
                },
            },
        ]),
    ],
    controllers: [UserTemplatesController],
    providers: [UserTemplatesService],
    exports:[UserTemplatesService]
})
export class UserTemplatesModule {
}
