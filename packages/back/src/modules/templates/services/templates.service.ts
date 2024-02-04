import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';

import { Template, TemplateDocument } from '../../../schemas/template.schema';
import { CreateDto, EditTemplateDto } from '../dto/create.dto';
import { FilterDto } from '../dto/filter.dto';

import { Category, CategoryDocument } from '../../../schemas/category.schema';
import { Color, ColorDocument } from '../../../schemas/color.schema';
import { Tag, TagDocument } from '../../../schemas/tag.schema';
import { ObjectIdDto, ObjectIdsDto } from '../dto/objectId.dto';

import * as graphics from '../../../utils/graphics';
import { errHandler, generateFileName } from '../../../utils/helper';
import { readStream } from '../../../utils/localstorage';
import * as s3 from '../../../vendor/s3';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: PaginateModel<TemplateDocument>,
    @InjectModel(Color.name)
    private readonly colorModel: Model<ColorDocument>,
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }

  async getAll({
    categories,
    tags,
    colors,
    query,
    amount,
    offset,
    page,
    language,
  }: FilterDto) {
    const q: any = {};

    if (language) {
      language = JSON.parse(
        JSON.stringify(language)
          .replace(/\b(ne)\b/, '$ne')
          .replace(/\b(nin)\b/, '$nin'),
      );
      Object.assign(q, { languages: language });
    }

    if (categories) {
      Object.assign(q, { categories: { $in: categories } });
    }

    if (colors) {
      Object.assign(q, { colors: { $in: colors } });
    }

    if (tags) {
      Object.assign(q, { tags: { $in: tags } });
    }

    if (query) {
      Object.assign(q, { title: { $regex: query, $options: 'i' } });
    }
    const paginate = async (page, amount) => {
      return await this.templateModel.paginate(q, {
        sort: { createdAt: -1 },
        limit: amount,
        page: page,
      });
    };

    const templates = await paginate(page, amount);
    if (offset) {
      const previousPage = await paginate(page - 1, amount);
      templates.docs = [
        ...previousPage.docs.slice(-offset, amount),
        ...templates.docs.slice(0, amount - offset),
      ];
    }

    return {
      templates: templates.docs,
      totalItems: templates.totalDocs,
      pages: templates.totalPages,
      page: templates.page,
      length: templates.docs.length,
    };
  }

  async getAmountTemplates() {
    return await this.templateModel.count();
  }

  async findOne({ id }: ObjectIdDto) {
    return await this.templateModel
      .findOne({ _id: id })
      .populate('tags')
      .populate('colors')
      .populate('tags')
      .populate('categories')
      .exec();
  }

  async edit(
    { id }: ObjectIdDto,
    dto: EditTemplateDto,
    files:
      | { image: Express.Multer.File[]; json: Express.Multer.File[] }
      | undefined
      | null,
  ) {
    const template = await this.templateModel.findOne({ _id: id }).exec();
    if (!template) {
      throw new HttpException('template not found', HttpStatus.NOT_FOUND);
    }
    const { categories, colors, tags, languages } = dto;

    const arrayCategories = categories ? categories.split(',') : [];
    const arrayColors = colors ? colors.split(',') : [];
    const arrayTags = tags ? tags.split(',') : [];
    const arrayLanguages = languages ? languages.split(',') : [];
    const editDto = {
      title: dto.title,
      status: dto.status,
      categories: arrayCategories,
      tags: arrayTags,
      colors: arrayColors,
      width: dto.width,
      height: dto.height,
      languages: arrayLanguages,
    };

    let locations: any;

    if (files?.image) {
      const { path: filePath, originalname } = files.image[0];

      const { full, middle, mini } = await graphics.uploadPreviewSet(
        filePath,
        {
          folder: 'template_images',
          baseName: generateFileName(originalname),
        },
        'jpg',
      );

      locations = [full, middle, mini].map((image) => image.Location);

      await Promise.all(
        template.preview.map(
          async (url) => await s3.drop(s3.decodePublicUrl(url)),
        ),
      ).catch((e) => console.error(e));
    }

    let json: any;

    if (files?.json) {
      const { path: filePath, originalname, mimetype } = files.json[0];
      if (!mimetype.includes('json')) {
        throw new HttpException(`file must be json`, HttpStatus.BAD_REQUEST);
      }

      const source = await readStream(filePath);

      if (!source) {
        throw new HttpException(
          'template file does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const templateName = generateFileName(originalname);

      json = await s3
        .push(source, { key: templateName, folder: 'data' })
        .catch(errHandler('template upload issue'));

      await s3
        .drop(s3.decodePublicUrl(template.data))
        .catch((e) => console.error(e));
    }

    const tagsFromDb = await this.tagModel
      .find({
        value: { $in: editDto.tags },
      })
      .exec();

    const categoriesFromDb = await this.categoryModel
      .find({
        value: { $in: editDto.categories },
      })
      .exec();

    const colorsFromDb = await this.colorModel
      .find({
        value: { $in: editDto.colors },
      })
      .exec();

    const resultTags = await this.prepareData(
      editDto.tags,
      tagsFromDb,
      this.tagModel,
    );
    const resultCategories = await this.prepareData(
      editDto.categories,
      categoriesFromDb,
      this.categoryModel,
    );
    const resultColors = await this.prepareData(
      editDto.colors,
      colorsFromDb,
      this.colorModel,
    );

    const newTemplate = await template.$set({
      title: editDto.title ? editDto.title : template.title,
      data: json?.Location ? json.Location : template.data,
      status: editDto.status ? editDto.status : template.status,
      width: editDto.width ? editDto.width : template.width,
      height: editDto.height ? editDto.height : template.height,
      categories:
        resultCategories.length > 0
          ? resultCategories.map((category) => category._id)
          : template.categories,
      tags:
        resultTags.length > 0
          ? resultTags.map((tag) => tag._id)
          : template.tags,
      colors:
        resultColors.length > 0
          ? resultColors.map((color) => color._id)
          : template.colors,
      languages:
        editDto.languages.length > 0 ? editDto.languages : template.languages,
      preview: locations ? locations : template.preview,
    });

    return newTemplate.save();
  }

  //createDto: CreateDto
  async create(
    createDto: CreateDto,
    files: { image: Express.Multer.File[]; json: Express.Multer.File[] },
  ) {
    const { categories, colors, tags, languages } = createDto;
    const arrayCategories = categories.split(',');
    const arrayColors = colors.split(',');
    const arrayTags = tags.split(',');
    const arrayLanguages = languages.split(',');

    const testCreateDto = {
      title: createDto.title,
      status: createDto.status,
      categories: arrayCategories,
      tags: arrayTags,
      colors: arrayColors,
      width: createDto.width,
      height: createDto.height,
      languages: arrayLanguages,
    };

    const jsonData = files.json[0];
    const imageData = files.image[0];

    let json: any;
    let locations: any;

    if (!jsonData.mimetype.includes('json')) {
      throw new HttpException(`file must be json`, HttpStatus.BAD_REQUEST);
    }

    if (
      !imageData.mimetype.includes('png') &&
      !imageData.mimetype.includes('jpeg')
    ) {
      throw new HttpException(
        `image must be png or jpeg`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const source = await readStream(jsonData.path);

    if (!source) {
      throw new HttpException(
        'template file does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const templateName = generateFileName(jsonData.originalname);

    json = await s3
      .push(source, { key: templateName, folder: 'data' })
      .catch(errHandler('template upload issue'));

    const previewName = generateFileName(imageData.originalname);
    const { full, middle, mini } = await graphics.uploadPreviewSet(
      imageData.path,
      {
        folder: 'template_images',
        baseName: previewName,
      },
      'jpg',
    );

    locations = [full, middle, mini].map((image) => image.Location);

    try {
      const tagss = await this.tagModel
        .find({
          value: { $in: testCreateDto.tags },
        })
        .exec();

      const categoriess = await this.categoryModel
        .find({
          value: { $in: testCreateDto.categories },
        })
        .exec();

      const colorss = await this.colorModel
        .find({
          value: { $in: testCreateDto.colors },
        })
        .exec();

      const resultTags = await this.prepareData(
        testCreateDto.tags,
        tagss,
        this.tagModel,
      );
      const resultCategories = await this.prepareData(
        testCreateDto.categories,
        categoriess,
        this.categoryModel,
      );
      const resultColors = await this.prepareData(
        testCreateDto.colors,
        colorss,
        this.colorModel,
      );
      return this.templateModel.insertMany([
        {
          data: json.Location,
          preview: locations,
          title: testCreateDto.title,
          width: testCreateDto.width,
          height: testCreateDto.height,
          categories: resultCategories.map((category) => category._id),
          colors: resultColors.map((color) => color._id),
          tags: resultTags.map((tag) => tag._id),
          status: testCreateDto.status,
          languages: testCreateDto.languages,
        },
      ]);
    } catch (e) {
      return e;
    }
  }

  async deleteSome({ ids }: ObjectIdsDto) {
    for (let i = 0; i < ids.length; i++) {
      try {
        const template = await this.templateModel
          .findOneAndDelete({ _id: ids[i] })
          .exec();
        if (!template) {
          return new HttpException(
            "this template doesen't exist",
            HttpStatus.NOT_FOUND,
          );
        }

        await s3
          .drop(s3.decodePublicUrl(template.data))
          .catch((e) => console.error(e));

        await Promise.all(
          template.preview.map(
            async (url) => await s3.drop(s3.decodePublicUrl(url)),
          ),
        ).catch((e) => console.error(e));
      } catch (e) {
        return {
          problemTemplate: ids[i],
          error: e,
        };
      }
    }

    return {
      successes: true,
      message: 'successful deleted',
    };
  }

  private async prepareData(
    tagsFromFront: string[],
    itemsFromDb: any[],
    model: any,
  ) {
    const existItems = [];
    const notExistItems = [];
    const valueItems = [];

    for (let i = 0; i < itemsFromDb.length; i++) {
      valueItems[i] = itemsFromDb[i].value;
    }

    for (let i = 0; i < tagsFromFront.length; i++) {
      if (valueItems.includes(tagsFromFront[i])) {
        existItems[i] = tagsFromFront[i];
        // console.log(existItems[i])
      } else {
        // console.log(tagsFromFront[i] + " this doesnt exs")
        const newItem = await model.create({
          value: tagsFromFront[i],
        });
        notExistItems[i] = newItem;
      }
    }

    return notExistItems.filter((item) => !!item).concat(itemsFromDb);
  }
}
