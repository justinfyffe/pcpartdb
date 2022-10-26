import { Serializable } from '@server/shared/types/serialize';
import { Benchmark, BenchmarkKey, BenchmarkMetadata } from '@shared/benchmark';
import { Model, PartialModelObject } from 'objection';

export class BenchmarkModel extends Model implements Serializable<Benchmark> {
  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  key!: BenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: BenchmarkMetadata;
  source?: string;

  serialize(): Benchmark {
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

export type BenchmarkModelPojo = PartialModelObject<BenchmarkModel>;
