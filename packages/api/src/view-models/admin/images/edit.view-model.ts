import { Injectable } from '@nestjs/common';
import { AdminEditImageViewModel } from '@pcpartdb/shared/view-models';
import { ImageService } from 'packages/api/src/image/image.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminEditImageViewModelService {
  constructor(private imageService: ImageService) {}

  async viewModel(imageId: number, ctx: Context) {
    return {
      image: await this.getImage(imageId, ctx),
    } as AdminEditImageViewModel;
  }

  private async getImage(id: number, ctx: Context) {
    return await this.imageService.get(id, ctx);
  }
}
