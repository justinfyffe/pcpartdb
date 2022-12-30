import { Serializable } from '@server/shared/types/serialize';
import { Benchmarks } from '@shared/benchmark';
import { Product, ProductType } from '@shared/product';
import { ProductImages } from '@shared/product-image';
import { ProductMetas } from '@shared/product-meta';
import { Specs } from '@shared/spec';
import { Model, PartialModelObject } from 'objection';

export class ProductModel extends Model implements Serializable<Product> {
  static tableName = 'products';

  // Fields
  id!: number;
  slug!: string;

  type!: ProductType;
  name!: string;

  // Relations
  specs?: Specs;
  benchmarks?: Benchmarks;
  metas?: ProductMetas;
  images?: ProductImages;

  serialize(): Product {
    return {
      id: this.id,
      slug: this.slug,
      type: this.type,
      name: this.name,
      specs: this.specs ?? {},
      benchmarks: this.benchmarks ?? {},
      metas: this.metas ?? {},
      images: this.images ?? {},
    };
  }
}

export type ProductModelPojo = PartialModelObject<ProductModel>;
