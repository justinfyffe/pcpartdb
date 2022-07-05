import { Injectable } from '@nestjs/common';
import { PartialModelObject } from 'objection';
import { ProductModel } from '../db/models/product.model';
import { Repository, RepositoryConfig } from '../db/repository';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark.repository';
import { Product } from './product';
import { ProductSpecRepository } from './spec/product-spec.repository';

interface Config extends RepositoryConfig {}

@Injectable()
export class ProductRepository extends Repository<ProductModel, Product> {
  constructor(
    private specRepository: ProductSpecRepository,
    private benchmarkRepository: ProductBenchmarkRepository,
  ) {
    super();
  }

  async save(product: Product, config?: Config) {
    const row: ProductModel = await ProductModel.query(config?.transaction)
      .insert(this.mapToRow(product))
      .onConflict('slug')
      .merge()
      .returning('*');

    return this.mapFromRow(row);
  }

  async findBySlug(slug: string, config?: Config) {
    const row = await ProductModel.query(config?.transaction)
      .findOne({ slug })
      .withGraphFetched('specs')
      .withGraphFetched('benchmarks');

    if (row == null) {
      return null;
    }

    return this.mapFromRow(row);
  }

  mapFromRow(row: ProductModel): Product {
    return {
      id: row.id,
      slug: row.slug,

      type: row.type,
      name: row.name,

      specs: row.specs?.map((spec) => this.specRepository.mapFromRow(spec)),
      benchmarks: row.benchmarks?.map((benchmark) =>
        this.benchmarkRepository.mapFromRow(benchmark),
      ),
    };
  }

  mapToRow(entity: Product): PartialModelObject<ProductModel> {
    return {
      id: entity.id,
      slug: entity.slug,

      type: entity.type,
      name: entity.name,
    };
  }
}
