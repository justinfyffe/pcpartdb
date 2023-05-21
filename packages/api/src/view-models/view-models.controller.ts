import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ListDataUpdatesRequest, ListGpusQuery } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { AdminDataUpdatesViewModelService } from './admin/data-updates/data-updates.view-model';
import { AdminEditGpuViewModelService } from './admin/gpus/edit.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
import { AdminListImagesViewModelService } from './admin/images/list.view-model';
import { AdminOverviewViewModelService } from './admin/overview/overview.view-model';
import { AdminEditUserViewModelService } from './admin/users/edit.view-model';
import { AdminListUsersViewModelService } from './admin/users/list.view-model';
import { RegisterViewModelService } from './auth/register.view-model';
import { CompareGpusViewModelService } from './gpus/compare.view-model';
import { ListGpusViewModelService } from './gpus/list.view-model';
import { ViewGpuViewModelService } from './gpus/view.view-model';
import { HomeViewModelService } from './home/home.view-model';

@Controller('view-models')
export class ViewModelsController {
  constructor(
    private db: Database,
    private adminOverviewViewModelService: AdminOverviewViewModelService,
    private adminEditGpuViewModelService: AdminEditGpuViewModelService,
    private adminEditImageViewModelService: AdminEditImageViewModelService,
    private adminListImagesViewModelService: AdminListImagesViewModelService,
    private adminEditUserViewModelService: AdminEditUserViewModelService,
    private adminListUsersViewModelService: AdminListUsersViewModelService,
    private adminDataUpdatesViewModelService: AdminDataUpdatesViewModelService,
    private compareGpusViewModelService: CompareGpusViewModelService,
    private listGpusViewModelService: ListGpusViewModelService,
    private viewGpuViewModelService: ViewGpuViewModelService,
    private registerViewModelService: RegisterViewModelService,
    private homeViewModelService: HomeViewModelService,
  ) {}

  @Get('admin/overview')
  @UseGuards(StaffGuard)
  async adminOverview(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        return this.adminOverviewViewModelService.viewModel();
      },
      { ctx },
    );
  }

  @Get('admin/gpus/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditGpu(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        const id = Number(idStr);
        return this.adminEditGpuViewModelService.viewModel(id, ctx);
      },
      { ctx },
    );
  }

  @Get('admin/images/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditImage(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        const id = Number(idStr);
        return this.adminEditImageViewModelService.viewModel(id, ctx);
      },
      { ctx },
    );
  }

  @Get('admin/images/list')
  @UseGuards(StaffGuard)
  async adminListImages(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.adminListImagesViewModelService.viewModel(ctx),
      { ctx },
    );
  }

  @Get('admin/users/edit/:id')
  @UseGuards(StaffGuard)
  async adminEditUser(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        const id = Number(idStr);
        return this.adminEditUserViewModelService.viewModel(id, ctx);
      },
      { ctx },
    );
  }

  @Get('admin/users/list')
  @UseGuards(StaffGuard)
  async adminListUsers(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.adminListUsersViewModelService.viewModel(ctx),
      { ctx },
    );
  }

  @Get('admin/data-updates')
  @UseGuards(StaffGuard)
  async adminDataUpdates(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        const data = JSON.parse(q) as ListDataUpdatesRequest;
        return this.adminDataUpdatesViewModelService.viewModel(data, ctx);
      },
      { ctx },
    );
  }

  @Get('gpus/compare/:slug')
  async compareGpus(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.compareGpusViewModelService.viewModel(slug, ctx),
      { ctx },
    );
  }

  @Get('gpus/list')
  async listGpus(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const data = JSON.parse(q) as ListGpusQuery;
        return await this.listGpusViewModelService.viewModel(data, ctx);
      },
      { ctx },
    );
  }

  @Get('gpus/view/:slug')
  async viewGpu(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.viewGpuViewModelService.viewModel(slug, ctx),
      { ctx },
    );
  }

  @Get('register')
  async register(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.registerViewModelService.viewModel(ctx),
      { ctx },
    );
  }

  @Get('home')
  async home(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.homeViewModelService.viewModel(ctx),
      { ctx },
    );
  }
}
