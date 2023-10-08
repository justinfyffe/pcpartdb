import { Injectable } from '@nestjs/common';
import { AdminEditProductViewModel, ProductType } from '@pcpartdb/shared';
import { ProductService } from 'packages/api/src/product/product.service';
import { ProductUpdateService } from 'packages/api/src/product/product-update.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminEditProductViewModelService {
  constructor(
    private productService: ProductService,
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
      pendingUpdate: await this.getPendingUpdate(product?.id, ctx),
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
      return await this.getProductById(id, ctx);
    }
  }

  private async getProductById(id: number, ctx: Context) {
    return await this.productService.getById(
      {
        id,
        includeParent: true,
        includeChildren: false,
        includeAutomation: true,
        includeBenchmarks: true,
        includeImages: true,
        includeSources: true,
        includeUpdates: true,
      },
      ctx,
    );
  }

  private async getProductBySlug(
    productType: ProductType,
    slug: string,
    ctx: Context,
  ) {
    return await this.productService.getBySlug(
      {
        productType,
        slug,

        includeParent: true,
        includeChildren: false,
        includeAutomation: true,
        includeBenchmarks: true,
        includeImages: true,
        includeSources: true,
        includeUpdates: true,
      },
      ctx,
    );
  }

  private async getPendingUpdate(productId: number, ctx: Context) {
    return await this.productUpdateService.findPendingByProductId(
      { productId },
      ctx,
    );
  }
}
