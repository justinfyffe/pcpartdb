import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multerS3 from 'multer-s3';
import type {
  CreateImageBody,
  ImageFormData,
  ImageResponse,
  ImagesResponse,
  UpdateImageBody,
} from '../../types/image';
import { StaffGuard } from '../auth/staff.guard';
import { transaction } from '../db/database';
import * as cdn from '../shared/cdn/cdn.utils';
import { normalize } from '../shared/types/normalize';
import { ImageService } from './image.service';

const multerOptions: MulterOptions = {
  storage: multerS3({
    s3: cdn.s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: (req: any, _file: any, cb: any) => {
      const tempPath = `${Math.floor(
        Math.random() * 10000000,
      )}-${new Date().getTime()}`;
      req.body.tempPath = tempPath;

      cb(null, cdn.getTempPath(tempPath));
    },
  }),
};

@Controller('images')
export class ImageController {
  constructor(private service: ImageService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list() {
    return normalize(
      await transaction((trx) => this.service.list({ trx })),
    ) as ImagesResponse;
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return normalize(
      await transaction((trx) => this.service.get(id, { trx })),
    ) as ImageResponse;
  }

  @Post()
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(@Body() body: CreateImageBody) {
    const data = JSON.parse(body.formData) as ImageFormData;
    const tempPath = body.tempPath;

    return normalize(
      await transaction((trx) =>
        this.service.create({ ...data, tempPath }, { trx }),
      ),
    ) as ImageResponse;
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async update(@Param('id') id: number, @Body() body: UpdateImageBody) {
    const data = JSON.parse(body.formData) as ImageFormData;
    const tempPath = body.tempPath;

    return normalize(
      await transaction((trx) =>
        this.service.update(id, { ...data, tempPath }, { trx }),
      ),
    ) as ImageResponse;
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return await transaction((trx) => this.service.delete(id, { trx }));
  }
}
