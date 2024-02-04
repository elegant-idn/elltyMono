import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { PromocodesService } from './service/promocodes.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import {AuthGuard} from "@nestjs/passport";
import {ApiBearerAuth, ApiBody, ApiTags} from "@nestjs/swagger";
import {CreateFolderDto} from "../folders/dto/createFolder.dto";
import {User} from "../../decorators/user.decorator";
import RoleGuard from "../rbac/roles.guard";
import {Role} from "../rbac/role.enum";
import {ObjectIdDto} from "../templates/dto/objectId.dto";
import {ValidatePayPalDto} from "./dto/validatePayPal.dto";
import {StripeCouponDto} from "./dto/stripeCoupon.dto";

@ApiTags('promocodes')
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}


  @Post("create")
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async createPromoCode(@Body() createPromocodeDto: CreatePromocodeDto) {
    return await this.promocodesService.createPromoCode(createPromocodeDto);
  }

  @Get()
  async findAll() {
    return await this.promocodesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() objectId: ObjectIdDto) {
    return await this.promocodesService.getById(objectId);
  }


  @Post("paypal")
  @ApiBody({type: ValidatePayPalDto})
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async validatePayPal(@Body() dto: ValidatePayPalDto) {
    return await this.promocodesService.validatePayPal(dto);
  }

  @Post("stripe")
  @ApiBody({type: StripeCouponDto})
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getStripe(@Body() dto: StripeCouponDto) {
    return await this.promocodesService.ValidateStripe(dto);
  }

  @Patch(':id')
  async update(@Param() objectId: ObjectIdDto, @Body() updatePromocodeDto: UpdatePromocodeDto) {
    return await this.promocodesService.update(objectId, updatePromocodeDto);
  }

  @Delete(':id')
  async remove(@Param() objectId: ObjectIdDto) {
    return await this.promocodesService.remove(objectId);
  }
}
