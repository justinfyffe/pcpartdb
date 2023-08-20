import { Injectable } from '@nestjs/common';
import { AdminEditProductViewModel, ProductType } from '@pcpartdb/shared';
import { CpuService } from 'packages/api/src/product/cpu/cpu.service';
import { GpuService } from 'packages/api/src/product/gpu/gpu.service';
import { ProductUpdateService } from 'packages/api/src/product/product-update.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminEditProductViewModelService {
  constructor(
    private cpuService: CpuService,
    private gpuService: GpuService,
    private productUpdateService: ProductUpdateService,
  ) {}

  async viewModel(
    productType: ProductType,
    productIdOrSlug: string,
    ctx: Context,
  ) {
    const product = await this.getProduct(productType, productIdOrSlug, ctx);
    return {
      productType,
      product,
      pendingUpdate: await this.getPendingUpdate(productType, product?.id, ctx),
    } as AdminEditProductViewModel;
  }

  private async getProduct(
    productType: ProductType,
    productIdOrSlug: string,
    ctx: Context,
  ) {
    const id = Number(productIdOrSlug);
    if (isNaN(id)) {
      return await this.getProductBySlug(productType, productIdOrSlug, ctx);
    } else {
      return await this.getProductById(productType, id, ctx);
    }
  }

  private async getProductById(
    productType: ProductType,
    id: number,
    ctx: Context,
  ) {
    if (productType === ProductType.Cpu) {
      return await this.cpuService.getById(id, { includeImages: true }, ctx);
    } else if (productType === ProductType.Gpu) {
      return await this.gpuService.getById(
        id,
        { includeChipset: true, includeImages: true },
        ctx,
      );
    } else {
      throw new Error('Invalid product type');
    }
  }

  private async getProductBySlug(
    productType: ProductType,
    slug: string,
    ctx: Context,
  ) {
    if (productType === ProductType.Cpu) {
      return await this.cpuService.getBySlug(
        slug,
        { includeImages: true },
        ctx,
      );
    } else if (productType === ProductType.Gpu) {
      return await this.gpuService.getBySlug(
        slug,
        { includeChipset: true, includeImages: true },
        ctx,
      );
    } else {
      throw new Error('Invalid product type');
    }
  }

  private async getPendingUpdate(
    productType: ProductType,
    productId: number,
    ctx: Context,
  ) {
    return await this.productUpdateService.findPendingByProductId(
      { productType, productId },
      ctx,
    );
  }
}
