import { Injectable } from '@nestjs/common';
import { ImageManipulationPreset } from '@pcpartdb/shared';
import Jimp from 'jimp';

interface ManipulationOptions {
  imagePath: string;
  outputPath: string;
  preset: ImageManipulationPreset;
}

@Injectable()
export class ImageManipulationService {
  constructor() {}

  async manipulate(options: ManipulationOptions) {
    const { preset } = options;
    if (preset === ImageManipulationPreset.GameThumbnail) {
      await this.applyGameThumbnailPreset(options);
    }
  }

  async applyGameThumbnailPreset(options: ManipulationOptions) {
    const { imagePath, outputPath } = options;

    const desiredQuality = 80;
    const desiredWidth = 250;
    const desiredHeight = 141;

    const image = await Jimp.read(imagePath);
    if (image.getWidth() > image.getHeight()) {
      image.resize(Jimp.AUTO, desiredHeight);
    } else {
      image.resize(desiredWidth, Jimp.AUTO);
    }

    image.background(0xffffffff);
    image.contain(desiredWidth, desiredHeight);
    image.quality(desiredQuality);

    await image.writeAsync(outputPath);
  }
}
