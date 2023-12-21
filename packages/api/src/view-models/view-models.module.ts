import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AutomationModule } from '../automation/automation.module';
import { DatabaseModule } from '../database';
import { ImageModule } from '../image/image.module';
import { ProductModule } from '../product/product.module';
import { CacheModule } from '../shared/cache/cache.module';
import { UserModule } from '../user/user.module';
import { AdminAutomationViewModelService } from './admin/automation/automation.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminOverviewViewModelService } from './admin/overview/overview.view-model';
import { AdminEditProductViewModelService } from './admin/products/edit.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { RegisterViewModelService } from './auth/register.view-model';
import { CompareCpusViewModelService } from './cpus/compare.view-model';
import { ListCpusViewModelService } from './cpus/list.view-model';
import { ViewCpuViewModelService } from './cpus/view.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';
import { ListGpusViewModelService } from './gpus/list.view-model';
import { ViewGpuViewModelService } from './gpus/view.view-model';
import { HomeViewModelService } from './home/home.view-model';
import { ViewModelsController } from './view-models.controller';

@Module({
  imports: [
    CacheModule,
    DatabaseModule,
    forwardRef(() => AuthModule),
    AutomationModule,
    ProductModule,
    ImageModule,
    forwardRef(() => UserModule),
  ],
  controllers: [ViewModelsController],
  providers: [
    // Admin Automation Pages
    AdminAutomationViewModelService,

    // Admin Edit Pages
    AdminEditProductViewModelService,
    AdminEditImageViewModelService,
    AdminEditUserViewModelService,

    // Admin List Pages
    AdminListImagesViewModelService,
    AdminListUsersViewModelService,

    // Admin Other Pages
    AdminOverviewViewModelService,

    // Compare Pages
    CompareCpusViewModelService,
    CompareGpusViewModelService,

    // List Pages
    ListCpusViewModelService,
    ListGpusViewModelService,

    // View Pages
    ViewCpuViewModelService,
    ViewGpuViewModelService,

    // Other Pages
    RegisterViewModelService,
    HomeViewModelService,
  ],

  exports: [
    CompareCpusViewModelService,
    CompareGpusViewModelService,
    ViewCpuViewModelService,
    ViewGpuViewModelService,
  ],
})
export class ViewModelsModule {}
