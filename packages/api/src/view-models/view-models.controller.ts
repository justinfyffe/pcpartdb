import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiRequest } from '../shared/http';
import { AdminEditGpuViewModelService } from './admin/gpus/edit.view-model';
import { AdminListGpusViewModelService } from './admin/gpus/list.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';

@Controller('view-models')
export class ViewModelsController {
  constructor(
    private adminEditGpuViewModelService: AdminEditGpuViewModelService,
    private adminListGpusViewModelService: AdminListGpusViewModelService,
    private adminEditImageViewModelService: AdminEditImageViewModelService,
    private adminListImagesViewModelService: AdminListImagesViewModelService,
    private adminEditUserViewModelService: AdminEditUserViewModelService,
    private adminListUsersViewModelService: AdminListUsersViewModelService,
    private compareGpusViewModelService: CompareGpusViewModelService,
  ) {}

  @Get('admin/gpus/edit/:id')
  async adminEditGpu(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return this.adminEditGpuViewModelService.viewModel(id, ctx);
  }

  @Get('admin/gpus/list')
  async adminListGpus(@Req() req: ApiRequest) {
    const ctx = req.context;
    return this.adminListGpusViewModelService.viewModel(ctx);
  }

  @Get('admin/images/edit/:id')
  async adminEditImage(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return this.adminEditImageViewModelService.viewModel(id, ctx);
  }

  @Get('admin/images/list')
  async adminListImages(@Req() req: ApiRequest) {
    const ctx = req.context;
    return this.adminListImagesViewModelService.viewModel(ctx);
  }

  @Get('admin/users/edit/:id')
  async adminEditUser(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return this.adminEditUserViewModelService.viewModel(id, ctx);
  }

  @Get('admin/users/list')
  async adminListUsers(@Req() req: ApiRequest) {
    const ctx = req.context;
    return this.adminListUsersViewModelService.viewModel(ctx);
  }

  @Get('gpus/compare/:slug')
  async compareGpus(@Param('slug') slug: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    return this.compareGpusViewModelService.viewModel(slug, ctx);
  }
}
