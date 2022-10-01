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
import { diskStorage } from 'multer';
import type { ImageRequest } from '../../types/image';
import { StaffGuard } from '../auth/staff.guard';
import { transaction } from '../db/database';
import { serializeAsync } from '../shared/types/serialize';
import * as uploads from '../shared/uploads/uploads.utils';
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

const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: uploads.tmpPath(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
      const tempPath = uploads.generateTmpFilename(file);
      req.body.tempPath = tempPath;
      cb(null, tempPath);
    },
  }),
};

@Controller('images')
export class ImageController {
  constructor(private service: ImageService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list() {
    return transaction((trx) => serializeAsync(this.service.list({ trx })));
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return transaction((trx) => serializeAsync(this.service.get(id, { trx })));
  }

  @Post()
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(@Body() body: CreateImageBody) {
    const data = JSON.parse(body.formData) as ImageRequest;
    const tempPath = body.tempPath;

    return transaction((trx) =>
      serializeAsync(this.service.create({ ...data, tempPath }, { trx })),
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async update(@Param('id') id: number, @Body() body: UpdateImageBody) {
    const data = JSON.parse(body.formData) as ImageRequest;
    const tempPath = body.tempPath;

    return transaction((trx) =>
      serializeAsync(this.service.update(id, { ...data, tempPath }, { trx })),
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return transaction((trx) => this.service.delete(id, { trx }));
  }
}
