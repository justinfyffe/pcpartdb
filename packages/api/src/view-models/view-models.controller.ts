import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StaffGuard } from '../auth/staff.guard';
import { ApiRequest } from '../shared/http';
import { AdminEditGpuViewModelService } from './admin/gpus/edit.view-model';
import { AdminListGpusViewModelService } from './admin/gpus/list.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';
import { ListGpusViewModelService } from './gpus/list.view-model';
import { ViewGpuViewModelService } from './gpus/view.view-model';
import { HomeViewModelService } from './home/home.view-model';
import { ViewModelsInterceptor } from './view-models.interceptor';

@Controller('view-models')
@UseInterceptors(ViewModelsInterceptor)
export class ViewModelsController {
  constructor(
    private adminEditGpuViewModelService: AdminEditGpuViewModelService,
    private adminListGpusViewModelService: AdminListGpusViewModelService,
    private adminEditImageViewModelService: AdminEditImageViewModelService,
    private adminListImagesViewModelService: AdminListImagesViewModelService,
    private adminEditUserViewModelService: AdminEditUserViewModelService,
    private adminListUsersViewModelService: AdminListUsersViewModelService,
    private compareGpusViewModelService: CompareGpusViewModelService,
    private listGpusViewModelService: ListGpusViewModelService,
    private viewGpuViewModelService: ViewGpuViewModelService,
    private homeViewModelService: HomeViewModelService,
  ) {}

  @Get('admin/gpus/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditGpu(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return await this.adminEditGpuViewModelService.viewModel(id, ctx);
  }

  @Get('admin/gpus/list')
  @UseGuards(StaffGuard)
  async adminListGpus(@Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.adminListGpusViewModelService.viewModel(ctx);
  }

  @Get('admin/images/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditImage(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return await this.adminEditImageViewModelService.viewModel(id, ctx);
  }

  @Get('admin/images/list')
  @UseGuards(StaffGuard)
  async adminListImages(@Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.adminListImagesViewModelService.viewModel(ctx);
  }

  @Get('admin/users/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditUser(@Param('id') idStr: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    const id = Number(idStr);
    return await this.adminEditUserViewModelService.viewModel(id, ctx);
  }

  @Get('admin/users/list')
  @UseGuards(StaffGuard)
  async adminListUsers(@Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.adminListUsersViewModelService.viewModel(ctx);
  }

  @Get('gpus/compare/:slug')
  async compareGpus(@Param('slug') slug: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.compareGpusViewModelService.viewModel(slug, ctx);
  }

  @Get('gpus/list')
  async listGpus(
    @Query() query: Record<string, string>,
    @Req() req: ApiRequest,
  ) {
    const ctx = req.context;
    return await this.listGpusViewModelService.viewModel(query, ctx);
  }

  @Get('gpus/view/:slug')
  async viewGpu(@Param('slug') slug: string, @Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.viewGpuViewModelService.viewModel(slug, ctx);
  }

  @Get('home')
  async home(@Req() req: ApiRequest) {
    const ctx = req.context;
    return await this.homeViewModelService.viewModel(ctx);
  }
}
