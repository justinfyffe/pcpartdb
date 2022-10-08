import { Model, PartialModelObject } from 'objection';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  ProductBenchmarkMetadata,
} from '../../../shared/product-benchmark';
import { Serializable } from '../../shared/types/serialize';

export class ProductBenchmarkModel
  extends Model
  implements Serializable<ProductBenchmark>
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

  serialize(): ProductBenchmark {
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
