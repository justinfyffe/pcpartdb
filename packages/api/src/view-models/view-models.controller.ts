import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ListCpusRequest,
  ListGpusRequest,
  ProductType,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { CacheInterceptor } from '../shared/cache/cache.interceptor';
import { Context, Ctx } from '../shared/context';
import { TimerInterceptor } from '../shared/timer/timer.interceptor';
import { AdminAutomationViewModelService } from './admin/automation/automation.view-model';
import { AdminEditGameViewModelService } from './admin/games/edit.view-model';
import { AdminEditImageViewModelService } from './admin/images/edit.view-model';
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

@Controller('view-models')
@UseInterceptors(TimerInterceptor)
export class ViewModelsController {
  constructor(
    private db: Database,
    private adminOverviewViewModelService: AdminOverviewViewModelService,
    private adminAutomationViewModelService: AdminAutomationViewModelService,
    private adminEditProductViewModelService: AdminEditProductViewModelService,
    private adminEditGameViewModelService: AdminEditGameViewModelService,
    private adminEditImageViewModelService: AdminEditImageViewModelService,
    private adminEditUserViewModelService: AdminEditUserViewModelService,
    private adminListUsersViewModelService: AdminListUsersViewModelService,
    private compareCpusViewModelService: CompareCpusViewModelService,
    private listCpusViewModelService: ListCpusViewModelService,
    private viewCpuViewModelService: ViewCpuViewModelService,
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
        return this.adminOverviewViewModelService.viewModel(ctx);
      },
      { ctx },
    );
  }

  @Get('admin/automation')
  @UseGuards(StaffGuard)
  async adminAutomation(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => {
        return this.adminAutomationViewModelService.viewModel(ctx);
      },
      { ctx },
    );
  }

  @Get('admin/games/:idOrSlug')
  @UseGuards(StaffGuard)
  async adminEditGame(
    @Param('idOrSlug') idOrSlug: string,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      () => {
        return this.adminEditGameViewModelService.viewModel(idOrSlug, ctx);
      },
      { ctx },
    );
  }

  @Get('admin/products/:idOrSlug')
  @UseGuards(StaffGuard)
  async adminEditProduct(
    @Query('productType') productType: ProductType,
    @Param('idOrSlug') idOrSlug: string,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      () => {
        return this.adminEditProductViewModelService.viewModel(
          productType,
          idOrSlug,
          ctx,
        );
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

  @Get('cpus/list')
  async listCpus(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const data = JSON.parse(reqJson) as ListCpusRequest;
    return await this.listCpusViewModelService.viewModel(data, ctx);
  }

  @Get('cpus/compare/:slug')
  @UseInterceptors(CacheInterceptor)
  async compareCpus(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.compareCpusViewModelService.viewModel(slug, ctx);
  }

  @Get('cpus/view/:slug')
  @UseInterceptors(CacheInterceptor)
  async viewCpu(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.viewCpuViewModelService.viewModel(slug, ctx);
  }

  @Get('gpus/list')
  async listGpus(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const data = JSON.parse(reqJson) as ListGpusRequest;
    return await this.listGpusViewModelService.viewModel(data, ctx);
  }

  @Get('gpus/compare/:slug')
  @UseInterceptors(CacheInterceptor)
  async compareGpus(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.compareGpusViewModelService.viewModel(slug, ctx);
  }

  @Get('gpus/view/:slug')
  @UseInterceptors(CacheInterceptor)
  async viewGpu(@Param('slug') slug: string, @Ctx() ctx: Context) {
    return await this.viewGpuViewModelService.viewModel(slug, ctx);
  }

  @Get('register')
  async register(@Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.registerViewModelService.viewModel(ctx),
      { ctx },
    );
  }

  @Get('home')
  // @UseInterceptors(CacheInterceptor)
  async home(@Ctx() ctx: Context) {
    return await this.homeViewModelService.viewModel(ctx);
  }
}
