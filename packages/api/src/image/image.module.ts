import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ImageController } from './image.controller';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { ImageManipulationService } from './image-manipulation.service';
import { ImageStatService } from './image-stat.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ImageController],
  providers: [
    ImageService,
    ImageRepository,
    ImageManipulationService,
    ImageStatService,
  ],
  exports: [
    ImageService,
    ImageRepository,
    ImageManipulationService,
    ImageStatService,
  ],
})
export class ImageModule {}
