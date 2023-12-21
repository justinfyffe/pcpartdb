import { Injectable } from '@nestjs/common';
import {
  ProductType,
  sortByIds,
  UpdateUserSettingsRequest,
  updateUserSettingsRequestSchema,
} from '@pcpartdb/shared';
import { ProductRepository } from '../product/product.repository';
import { Context } from '../shared/context';
import { CookieService } from '../shared/cookie/cookie.service';
import { SETTINGS_COOKIE } from '../shared/cookie/cookies';
import { validate } from '../shared/validation/validate';
import { CompareCpusViewModelService } from '../view-models/cpus/compare.view-model';
import { ViewCpuViewModelService } from '../view-models/cpus/view.view-model';
import { CompareGpusViewModelService } from '../view-models/gpus/compare.view-model';
import { ViewGpuViewModelService } from '../view-models/gpus/view.view-model';

@Injectable()
export class UserSettingsService {
  constructor(
    private cookies: CookieService,
    private productRepository: ProductRepository,
    private viewCpuService: ViewCpuViewModelService,
    private viewGpuService: ViewGpuViewModelService,
    private compareCpusService: CompareCpusViewModelService,
    private compareGpusService: CompareGpusViewModelService,
  ) {}

  async updateUserSettings(request: UpdateUserSettingsRequest, ctx: Context) {
    validate(request, updateUserSettingsRequestSchema);
    const { settings, productIds, productType } = request;

    // Save settings
    ctx.config.userSettings = settings;
    const base64Settings = Buffer.from(JSON.stringify(settings)).toString(
      'base64',
    );
    this.cookies.save(SETTINGS_COOKIE, base64Settings, {}, ctx);

    // Fetch content data if requested

    if (productType != null && productIds != null) {
      let products = await this.productRepository.list(
        { productType, filter: { ids: productIds } },
        ctx,
      );
      products = sortByIds(productIds, products, (p) => p.id);
      const slugs = products.map((p) => p.slug);

      if (productIds.length === 1 && productType === ProductType.Cpu) {
        // View CPU
        return await this.viewCpuService.viewModel(slugs[0], ctx);
      } else if (
        productIds.length === 1 &&
        productType === ProductType.Gpu &&
        slugs.length === 1
      ) {
        // View GPU
        return await this.viewGpuService.viewModel(slugs[0], ctx);
      } else if (productIds.length === 2 && productType === ProductType.Cpu) {
        // Compare CPUs
        return await this.compareCpusService.viewModel(
          slugs.join('--vs--'),
          ctx,
        );
      } else if (productIds.length === 2 && productType === ProductType.Gpu) {
        // Compare GPUs
        return await this.compareGpusService.viewModel(
          slugs.join('--vs--'),
          ctx,
        );
      }
    }

    return null;
  }
}
