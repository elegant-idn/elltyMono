import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObjectIdDto } from '../../templates/dto/objectId.dto';
import { CreateTag } from '../../templates/dto/create-additions.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from '../../../schemas/tag.schema';
import { Model } from 'mongoose';
import { GetSingleByValueDto } from '../dto/getSingleByValue.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  async getTags() {
    return await this.tagModel.find().exec();
  }

  async getTagByValue(dto: GetSingleByValueDto) {
    return await this.tagModel.findOne({ value: dto.value });
  }
  async CreateTag(createTag: CreateTag) {
    return await this.tagModel.create({ value: createTag.value });
  }
  async DeleteTag({ id }: ObjectIdDto) {
    const response = await this.tagModel.findByIdAndDelete({ _id: id }).exec();
    if (!response) {
      return new HttpException('tag not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: 'tag successfully deleted',
    };
  }
}
