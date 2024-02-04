import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDocument } from '../../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  DesignerTemplate,
  DesignerTemplateDocument,
  DesignerTemplateStatus,
} from '../../../schemas/designerTemplates.schema';
import { PaginateModel } from 'mongoose';
import { PaginateDto } from '../../../shared/paginate.dto';
import {
  GetAllReqDesignerTemplates,
  GetAllReqUserDesignerTemplates,
} from '../dto/get-all-req-designer-templates';
import { MailService } from '../../mail/services/mail.service';
import { ChangeStatusTemplateDto } from '../dto/change-status-template.dto';
import { Template, TemplateDocument } from '../../../schemas/template.schema';
import { response } from 'express';
import { toInteger } from 'lodash';
import {
  AWS_USER_TEMPLATE_BUCKET,
  pipeAsync,
  errHandler
} from '../../../utils/helper';
import { DeleteTemplatesDto } from '../dto/delete-templates.dto';
import { readStream } from '../../../utils/localstorage';
import * as graphics from '../../../utils/graphics';
import * as s3 from '../../../vendor/s3';
import * as path from 'path';
const axios = require('axios');

@Injectable()
export class DesignerTemplatesService {
  constructor(
    @InjectModel(DesignerTemplate.name)
    private readonly designerTemplateModel: PaginateModel<DesignerTemplateDocument>,
    @InjectModel(Template.name)
    private readonly templateModel: PaginateModel<TemplateDocument>,
    private mailService: MailService,
  ) {}

  async changeStatus(templateId: string, req: ChangeStatusTemplateDto) {
    let template = await this.designerTemplateModel
      .findOne({ _id: templateId })
      .exec();
    if (req.status !== template.status) {
      if (req.status === 'accepted') {
        const transferred = await s3
          .copy(
            {
              fromFolder: template.userTemplate.filename,
              fromKey: template.userTemplate.destination,
              toFolder: 'data',
            },
            'designer',
          )
          .catch(errHandler('template not uploaded'));

        const userPreviewKey = template.userTemplate.preview_key

        if (!userPreviewKey) {
          throw new HttpException('Template should have a preview', HttpStatus.FORBIDDEN)
        }

        const { folder, key } = s3.splitKey(userPreviewKey)

        const full = await s3
          .copy(
            {
              fromFolder: folder,
              fromKey: key,
              toFolder: 'template_images',
            },
            'full',
          )
          .catch(errHandler('full preview upload issue'));

        const { width, height } = await graphics
          .getMetaS3(userPreviewKey)
          .catch(errHandler('preview metadata parse issue'));

        const mini = await graphics
          .uploadResize(
            {
              key,
              width: Math.floor(width * 0.4),
              folder: 'template_images',
            },
            'mini',
          )
          .catch(errHandler('mini preview generation issue'));

        const middle = await graphics
          .uploadResize(
            {
              key,
              width: Math.floor(width * 0.7),
              folder: 'template_images',
            },
            'middle',
          )
          .catch(errHandler('middle preview generation issue'));

        await this.templateModel
          .create({
            data: transferred.Location,
            preview: [
              full.Location,
              middle.Location,
              mini.Location,
            ],
            title: template.userTemplate.title,
            width,
            height,
            status: 'free',
            user: template.user,
          })
          .catch(errHandler('template saving issue'));
      }
      await this.designerTemplateModel
        .findOneAndUpdate({ _id: templateId }, { status: req.status })
        .exec()
        .catch(errHandler('template status update issue'));
      await this.mailService
        .sendNotificationAboutTemplate(
          template.user,
          req,
          template.userTemplate,
        )
        .catch(errHandler('mail send issue'));
    }
  }

  async deleteTemplate(query: DeleteTemplatesDto, user: UserDocument) {
    await this.designerTemplateModel
      .deleteMany({ _id: { $in: query.ids }, user: user._id })
      .exec()
      .catch(errHandler('template delete issue'));
  }

  async getAllAdmin(paginate: PaginateDto, query: GetAllReqDesignerTemplates) {
    let q: any = {};

    if (query.user_id) {
      Object.assign(q, { user: query.user_id });
    }

    if (query.status) {
      Object.assign(q, { status: query.status });
    }

    return await this.designerTemplateModel.paginate(q, {
      sort: { createdAt: -1 },
      limit: paginate.amount,
      page: paginate.offset,
    });
  }

  async getAllUser(
    paginate: PaginateDto,
    user: UserDocument,
    query: GetAllReqUserDesignerTemplates,
  ) {
    let q: any = { user: user._id };

    if (query.status) {
      Object.assign(q, { status: query.status });
    }

    return await this.designerTemplateModel.paginate(q, {
      sort: { createdAt: -1 },
      limit: paginate.amount,
      page: paginate.offset,
    });
  }
}
