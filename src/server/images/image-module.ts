import { Module } from '@nestjs/common';
import { ImageController } from './image-controller';
import { ImageRepository } from './image-repository';
import { ImageService } from './image-service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
