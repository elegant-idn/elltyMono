import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateElementDto } from '../dto/create-element.dto';
import { UpdateElementDto } from '../dto/update-element.dto';
import { FilterDto } from '../dto/filter.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model, PaginateModel } from 'mongoose';
import { Color, ColorDocument } from '../../../schemas/color.schema';
import { Tag, TagDocument } from '../../../schemas/tag.schema';
import { Category, CategoryDocument } from '../../../schemas/category.schema';
import { Element, ElementDocument } from '../../../schemas/element.schema';
import { ObjectIdDto, ObjectIdsDto } from '../../templates/dto/objectId.dto';
import * as s3 from '../../../vendor/s3';
import * as path from 'path';

import comboUpload from './comboUpload';

@Injectable()
export class ElementsService {
  constructor(
    @InjectModel(Element.name)
    private readonly elementModel: PaginateModel<ElementDocument>,
    @InjectModel(Color.name)
    private readonly colorModel: Model<ColorDocument>,
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getAll({ categories, tags, colors, query, amount, offset }: FilterDto) {
    let q: any = {};

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

    let elements = await this.elementModel.paginate(q, {
      sort: { createdAt: 1 },
      limit: amount,
      page: offset,
    });

    return {
      elements: elements.docs,
      totalItems: elements.totalDocs,
      pages: elements.totalPages,
      page: elements.page,
    };
  }

  async getAmountElements() {
    return await this.elementModel.count();
  }

  async findOne({ id }: ObjectIdDto) {
    return await this.elementModel
      .findOne({ _id: id })
      .populate('tags')
      .populate('colors')
      .populate('tags')
      .populate('categories')
      .exec();
  }

  async edit(
    { id }: ObjectIdDto,
    dto: UpdateElementDto,
    files: { data: Express.Multer.File[] } | undefined | null,
  ) {
    const element = await this.elementModel.findOne({ _id: id }).exec();
    if (!element) {
      throw new HttpException('element not found', HttpStatus.NOT_FOUND);
    }

    let { categories, colors, tags } = dto;
    const arrayCategories = categories ? categories.split(',') : [];
    const arrayColors = colors ? colors.split(',') : [];
    const arrayTags = tags ? tags.split(',') : [];

    const editDto = {
      title: dto.title,
      status: dto.status,
      categories: arrayCategories,
      tags: arrayTags,
      colors: arrayColors,
    };

    console.log(editDto);

    let data: any;
    let previewLocations: any;

    if (files?.data) {
      const { path: filePath, originalname } = files.data[0];

      const result = await comboUpload(filePath, path.parse(originalname).base);

      data = result.element;
      previewLocations = result.preview;

      await s3
        .drop(s3.decodePublicUrl(element.data))
        .catch((e) => console.error(e));

      await Promise.all(
        element.preview.map(
          async (url) => await s3.drop(s3.decodePublicUrl(url)),
        ),
      ).catch((e) => console.error(e));
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

    const newElement = await element.$set({
      title: editDto.title ? editDto.title : element.title,
      data: data?.Location ? data.Location : element.data,
      status: editDto.status ? editDto.status : element.status,
      categories:
        resultCategories.length > 0
          ? resultCategories.map((category) => category._id)
          : element.categories,
      tags:
        resultTags.length > 0 ? resultTags.map((tag) => tag._id) : element.tags,
      colors:
        resultColors.length > 0
          ? resultColors.map((color) => color._id)
          : element.colors,
      preview: previewLocations ? previewLocations : element.preview,
    });

    return newElement.save();
  }

  //createDto: CreateElementDto
  async create(
    createDto: CreateElementDto,
    files: { data: Express.Multer.File[] },
  ) {
    const { categories, colors, tags } = createDto;
    const arrayCategories = categories.split(',');
    const arrayColors = colors.split(',');
    const arrayTags = tags.split(',');
    //
    const testCreateDto = {
      title: createDto.title,
      status: createDto.status,
      categories: arrayCategories,
      tags: arrayTags,
      colors: arrayColors,
    };

    const { path: filePath, originalname } = files.data[0];

    const result = await comboUpload(filePath, originalname);

    const data = result.element;
    const locations = result.preview;

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

    return this.elementModel.insertMany([
      {
        data: data.Location,
        preview: locations,
        title: testCreateDto.title,
        categories: resultCategories.map((category) => category._id),
        colors: resultColors.map((color) => color._id),
        tags: resultTags.map((tag) => tag._id),
        status: testCreateDto.status,
      },
    ]);
  }

  async deleteSome({ ids }: ObjectIdsDto) {
    for (let i = 0; i < ids.length; i++) {
      try {
        const element = await this.elementModel
          .findOneAndDelete({ _id: ids[i] })
          .exec();
        if (!element) {
          throw new HttpException(
            "this element doesen't exist",
            HttpStatus.NOT_FOUND,
          );
        }

        await s3
          .drop(s3.decodePublicUrl(element.data))
          .catch((e) => console.error(e));

        await Promise.all(
          element.preview.map((url) => s3.drop(s3.decodePublicUrl(url))),
        ).catch((e) => console.error(e));
      } catch (e) {
        return {
          problemElement: ids[i],
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
    let existItems = [];
    let notExistItems = [];
    let valueItems = [];

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
