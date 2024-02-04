import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {DeleteFolderDto} from '../dto/deleteFolder.dto';
import { UserDocument} from "../../../schemas/user.schema";
import {Model, Types} from "mongoose";

import {UserTemplate, UserTemplateDocument} from "../../../schemas/userTemplates.schema";
import {
    USER_TEMPLATE_DEFAULT_DIR,
    USER_TEMPLATE_LATEST_DIR,
    USER_TEMPLATE_REFACTOR,
    USER_TEMPLATE_TRASH_DIR,
    USER_RESERVED_DIRS,
    errHandler
} from "../../../utils/helper";
import {GetAllUserFoldersDto} from "../dto/getAllUserFolders.dto";
import * as s3 from '../../../vendor/s3';
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FoldersService {

    constructor(@InjectModel(UserTemplate.name)private readonly userTemplateModel:Model<UserTemplateDocument>) {
    }

    async getAll(user:UserDocument) {
        const result = await s3
            .list({ folder: USER_TEMPLATE_DEFAULT_DIR(user), foldersOnly: true })
            .catch(errHandler('cannot get directory list'))

        return result
            .map(dir => dir.replace(/\/$/, ''))
            .filter(dir => !USER_RESERVED_DIRS.includes(dir))
    }

    async create(name: string, user: UserDocument) {
        const targetFolder = USER_TEMPLATE_REFACTOR(user,name)

        if(USER_RESERVED_DIRS.includes(name.toLowerCase())){
            throw new HttpException("You can not create this folder",HttpStatus.METHOD_NOT_ALLOWED)
        }

        await s3
            .mkDir({ folder: targetFolder })
            .catch(errHandler('folder already exist'))
    }

    async delete({folder}: DeleteFolderDto, user: UserDocument) {
        const targetFolder = USER_TEMPLATE_REFACTOR(user,folder)

        if(USER_RESERVED_DIRS.includes(folder.toLowerCase())){
            throw new HttpException("You can not delete this folder",HttpStatus.METHOD_NOT_ALLOWED)
        }

        const previewLists = await this.userTemplateModel
            .find( { destination: targetFolder })
            .exec()
            .catch(errHandler('template previews collection issue'))

        const previews = previewLists.reduce((acc, val) => {
            return [...acc, ...val.preview.map(url => s3.decodePublicUrl(url).key)]
        }, [])

        await this.userTemplateModel
            .deleteMany( { destination: targetFolder })
            .exec()
            .catch(errHandler('template remove issue'))

        await s3
            .dropRecursive({ folder: targetFolder + '/' })
            .catch(errHandler('template file remove issue'))

        if (previews.length > 0) {
            await s3
                .dropMany({ keys: previews })
                .catch(errHandler('template preview remove issue'))
        }
    }
}
