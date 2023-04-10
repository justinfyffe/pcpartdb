import { Module } from '@nestjs/common';
import { DataUpdateModule } from '../data-update/data-update.module';
import { DatabaseModule } from '../database';
import { GpuModule } from '../gpu/gpu.module';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { AdminEditGpuViewModelService } from './admin/gpus/edit.view-model';
import { AdminListGpusViewModelService } from './admin/gpus/list.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminOverviewViewModelService } from './admin/overview/overview.view-model';
import { AdminPendingUpdatesViewModelService } from './admin/updates/pending-updates.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { RegisterViewModelService } from './auth/register.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';
import { ListGpusViewModelService } from './gpus/list.view-model';
import { ViewGpuViewModelService } from './gpus/view.view-model';
import { HomeViewModelService } from './home/home.view-model';
import { ViewModelsController } from './view-models.controller';

@Module({
  imports: [
    DatabaseModule,
    DataUpdateModule,
    GpuModule,
    ImageModule,
    UserModule,
  ],
  controllers: [ViewModelsController],
  providers: [
    AdminOverviewViewModelService,
    AdminEditGpuViewModelService,
    AdminListGpusViewModelService,
    AdminEditImageViewModelService,
    AdminListImagesViewModelService,
    AdminEditUserViewModelService,
    AdminListUsersViewModelService,
    AdminPendingUpdatesViewModelService,
    CompareGpusViewModelService,
    ListGpusViewModelService,
    ViewGpuViewModelService,
    RegisterViewModelService,
    HomeViewModelService,
  ],
})
export class ViewModelsModule {}
