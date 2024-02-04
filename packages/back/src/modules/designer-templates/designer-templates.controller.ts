import {Body, Controller, Delete, Get, Param, Patch, Query, UseGuards} from '@nestjs/common';
import {DesignerTemplatesService} from './services/designer-templates.service';
import {GetAllReqDesignerTemplates, GetAllReqUserDesignerTemplates} from "./dto/get-all-req-designer-templates";
import {PaginateDto} from "../../shared/paginate.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import RoleGuard from "../rbac/roles.guard";
import {Role} from "../rbac/role.enum";
import {AuthGuard} from "@nestjs/passport";
import {User} from "../../decorators/user.decorator";
import {ChangeStatusTemplateDto} from "./dto/change-status-template.dto";
import {DeleteTemplatesDto} from "./dto/delete-templates.dto";

@Controller('designer-templates')
@ApiTags("Designer Templates")
export class DesignerTemplatesController {
  constructor(private readonly designerTemplatesService: DesignerTemplatesService) {}

  @Patch(':id/changeStatus')
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  changeStatusTemplate(@Param('id') id:string,@Body() req:ChangeStatusTemplateDto){
    return this.designerTemplatesService.changeStatus(id,req)
  }

  @Delete()
  @UseGuards(RoleGuard([Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  deleteTemplate(@Body() ids:DeleteTemplatesDto,@User() user){
    return this.designerTemplatesService.deleteTemplate(ids,user);
  }

  @Get('/admin')
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  getAllAdmin(@Query() req:GetAllReqDesignerTemplates,@Query() paginate:PaginateDto) {
    return this.designerTemplatesService.getAllAdmin(paginate,req);
  }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  getAllUser(@Query() req:GetAllReqUserDesignerTemplates,  @User() user,@Query() paginate:PaginateDto){
    return this.designerTemplatesService.getAllUser(paginate,user,req)
  }

}
