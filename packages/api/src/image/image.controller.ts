import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageRequest, UpdateImageRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import * as fileUtils from '../shared/utils';
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
  async list(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.imageService.list(ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async create(
    @UploadedFile() file: any,
    @Body() body: CreateImageBody,
    @Ctx() ctx: Context,
  ) {
    console.log(file);
    return await this.db.transaction(
      async () => {
        // await fileUtils.uploadFile('file', ctx);

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
    @UploadedFile() file: any,
    @Param('id') idStr: string,
    @Body() body: UpdateImageBody,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);

        // await fileUtils.uploadFile('file', ctx);

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
