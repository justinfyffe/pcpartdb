import { Module } from '@nestjs/common';
import { GpuModule } from '../gpu/gpu.module';
import { ImageModule } from '../image/image.module';
import { AdminEditGpuViewModelService } from './admin/gpus/edit.view-model';
import { AdminListGpusViewModelService } from './admin/gpus/list.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';
import { ViewModelsController } from './view-models.controller';

@Module({
  imports: [GpuModule, ImageModule],
  controllers: [ViewModelsController],
  providers: [
    AdminEditGpuViewModelService,
    AdminListGpusViewModelService,
    AdminEditImageViewModelService,
    AdminListImagesViewModelService,
    AdminEditUserViewModelService,
    AdminListUsersViewModelService,
    CompareGpusViewModelService,
  ],
})
export class ViewModelsModule {}
