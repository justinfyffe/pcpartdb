import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateImageRequest, UpdateImageRequest } from '@pcpartdb/shared/image';
import { StaffGuard } from '../auth/staff.guard';
import { ApiRequest } from '../shared/http';
import * as fileUtils from '../shared/utils';
import { ImageService } from './image.service';

interface CreateImageBody {
  file: File;
  formData: string;
  tempPath?: string;
}

interface UpdateImageBody {
  file?: File;
  formData: string;
  tempPath?: string;
}

@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list(@Req() request: ApiRequest) {
    const ctx = request.context;
    return await this.imageService.list(ctx);
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateImageBody, @Req() request: ApiRequest) {
    const ctx = request.context;
    await fileUtils.uploadFile('file', ctx);

    const data = JSON.parse(body.formData) as CreateImageRequest;
    const tempPath = body.tempPath;

    return await this.imageService.create({ ...data, tempPath }, ctx);
  }

  @Put(':id')
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateImageBody,
    @Req() request: ApiRequest,
  ) {
    const id = Number(idStr);
    const ctx = request.context;

    await fileUtils.uploadFile('file', ctx);

    const data = JSON.parse(body.formData) as UpdateImageRequest;
    const tempPath = body.tempPath;

    return await this.imageService.update(id, { ...data, tempPath }, ctx);
  }

  @Delete(':id')
  async delete(@Param('id') idStr: string, @Req() request: ApiRequest) {
    const id = Number(idStr);
    const ctx = request.context;

    return await this.imageService.delete(id, ctx);
  }
}
