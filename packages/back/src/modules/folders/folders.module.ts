import { Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {FoldersService} from './services/folders.service';
import {FoldersController} from './folders.controller';
import {UserTemplate, UserTemplateSchema} from "../../schemas/userTemplates.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{name:UserTemplate.name,schema:UserTemplateSchema}]),
        PassportModule,
    ],
    controllers: [FoldersController],
    providers: [FoldersService],
    exports:[FoldersService]
})
export class FoldersModule {
}
