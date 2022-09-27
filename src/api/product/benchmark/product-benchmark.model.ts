import { Model, PartialModelObject } from 'objection';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  ProductBenchmarkMetadata,
} from '../../../types/product-benchmark';

export class ProductBenchmarkModel extends Model {
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
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
