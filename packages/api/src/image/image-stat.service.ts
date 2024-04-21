import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';

interface ImageStats {
  width: number;
  height: number;
  fileSize: number;
}

@Injectable()
export class ImageStatService {
  constructor() {}

  async stat(file: string) {
    const image = await Jimp.read(file);
    const buffer = await image.getBufferAsync(image.getMIME());

    return {
      fileSize: buffer.byteLength,
      height: image.getHeight(),
      width: image.getWidth(),
    } as ImageStats;
  }
}
