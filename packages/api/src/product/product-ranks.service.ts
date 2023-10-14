import { Injectable } from '@nestjs/common';
import {
  Product,
  ProductRankKey,
  ProductRanksFilter,
  ProductType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { ProductRanksRepository } from './product-ranks.repository';

@Injectable()
export class ProductRanksService {
  constructor(private repository: ProductRanksRepository) {}

  async populateRanks(
    ranks: ProductRankKey[],
    products: Product[],
    ctx: Context,
  ) {
    const filteredProducts = products.filter(
      (product) => product?.parent || product,
    );
    if (filteredProducts.length === 0) {
      return;
    }

    const ids = filteredProducts.map(
      (product) => (product?.parent || product).id,
    );
    const filter = this.buildRanksFilter(filteredProducts);

    const map = new Map<ProductRankKey, number[]>();
    for (let i = 0; i < ranks.length; ++i) {
      map.set(
        ranks[i],
        await this.repository.getRanks(ids, ranks[i], filter, ctx),
      );
    }

    filteredProducts.forEach((product, i) => {
      product.ranks = product.ranks || {};
      map.forEach((values, key) => {
        product.ranks[key] = values[i];
      });
    });
  }

  private buildRanksFilter(products: Product[]): ProductRanksFilter {
    switch (products[0].productType) {
      case ProductType.Cpu:
        return this.buildCpuRanksFilter(products);
      case ProductType.Gpu:
        return this.buildGpuRanksFilter(products);
      default:
        throw new Error(
          `Cannot build ranks filter for product type ${products[0].productType}`,
        );
    }
  }

  private buildCpuRanksFilter(products: Product[]) {
    const segment = [
      ...new Set(
        products
          .map((product) => product.fields?.marketSegment?.value)
          .filter((value) => value != null),
      ),
    ];

    return { productType: ProductType.Cpu, segment };
  }

  private buildGpuRanksFilter(products: Product[]) {
    const architecture = [
      ...new Set(
        products
          .map((product) => product.fields?.architecture?.value)
          .filter((value) => value != null),
      ),
    ];

    const segment = [
      ...new Set(
        products
          .map((product) => product.fields?.marketSegment?.value)
          .filter((value) => value != null),
      ),
    ];

    return { productType: ProductType.Gpu, architecture, segment };
  }
}
