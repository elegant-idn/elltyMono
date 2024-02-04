import {Module} from '@nestjs/common';
import {DesignerTemplatesService} from './services/designer-templates.service';
import {DesignerTemplatesController} from './designer-templates.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {DesignerTemplate, DesignerTemplateSchema} from "../../schemas/designerTemplates.schema";
import {UserTemplate, UserTemplateSchema} from "../../schemas/userTemplates.schema";
import {MailModule} from "../mail/mail.module";
import {Template, TemplateSchema} from "../../schemas/template.schema";
const autoPopulate = require("mongoose-autopopulate")

@Module({
    controllers: [DesignerTemplatesController],
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: DesignerTemplate.name,
                useFactory: () => {
                    const schema = DesignerTemplateSchema;
                    schema.plugin(autoPopulate)
                    return schema;
                },
            },
            {
                name: Template.name,
                useFactory: () => {
                    const schema = TemplateSchema;
                    schema.plugin(autoPopulate)
                    return schema;
                },
            },
        ]),
        MailModule
    ],
    providers: [DesignerTemplatesService]
})
export class DesignerTemplatesModule {
}
