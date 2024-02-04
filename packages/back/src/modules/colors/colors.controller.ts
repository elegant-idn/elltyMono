import {Controller, Get} from '@nestjs/common';
import { ColorsService } from './services/colors.service';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}
  @Get('')
  async getColors() {
    return this.colorsService.getColors();
  }
}
