import { Serializable } from '@server/shared/types/serialize';
import { Spec, SpecKey, SpecMetadata } from '@shared/spec';
import { Model, PartialModelObject } from 'objection';

export class SpecModel extends Model implements Serializable<Spec> {
  static tableName = 'product_specs';

  // Fields
  id!: number;
  productId!: number;

  key!: SpecKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: SpecMetadata;
  source?: string;

  serialize(): Spec {
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

export type SpecModelPojo = PartialModelObject<SpecModel>;
