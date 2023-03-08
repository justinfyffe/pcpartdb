import { Injectable } from '@nestjs/common';
import { AdminListImagesViewModel } from '@pcpartdb/shared';
import { ImageService } from 'packages/api/src/image/image.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminListImagesViewModelService {
  constructor(private imageService: ImageService) {}

  async viewModel(ctx: Context) {
    return { images: await this.getImages(ctx) } as AdminListImagesViewModel;
  }

  private async getImages(ctx: Context) {
    return await this.imageService.list(ctx);
  }
}
