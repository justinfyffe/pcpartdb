import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateImageRequest,
  ListImagesRequest,
  UpdateImageRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { MULTER_OPTIONS } from '../shared/utils';
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
  constructor(private db: Database, private imageService: ImageService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: ListImagesRequest = JSON.parse(reqJson);

    return await this.db.transaction(
      async () => {
        return await this.imageService.list(req, {}, ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async create(@Body() body: CreateImageBody, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const data = JSON.parse(body.formData) as CreateImageRequest;
        const tempPath = body.tempPath;

        return await this.imageService.create({ ...data, tempPath }, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateImageBody,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);

        const data = JSON.parse(body.formData) as UpdateImageRequest;
        const tempPath = body.tempPath;

        return await this.imageService.update(id, { ...data, tempPath }, ctx);
      },
      { ctx },
    );
  }

  @Delete(':id')
  async delete(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);

        return await this.imageService.delete(id, ctx);
      },
      { ctx },
    );
  }
}
