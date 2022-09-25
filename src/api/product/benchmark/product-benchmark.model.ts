import { Model, PartialModelObject } from 'objection';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  ProductBenchmarkMetadata,
  productBenchmarkSchema,
} from '../../../types/product-benchmark';
import { CanDto } from '../../shared/types/normalize';

export class ProductBenchmarkModel
  extends Model
  implements CanDto<ProductBenchmark>
{
  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  key!: ProductBenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductBenchmarkMetadata;
  source?: string;

  toDto(): ProductBenchmark {
    return {
      id: this.id,
      productId: this.productId,
      key: this.key,
      integerValue: this.integerValue,
      floatValue: this.floatValue,
      booleanValue: this.booleanValue,
      stringValue: this.stringValue,
      textValue: this.textValue,
      jsonValue: this.jsonValue,
      metadata: this.metadata,
      source: this.source,
    };
  }

  getSchema() {
    return productBenchmarkSchema;
  }
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
