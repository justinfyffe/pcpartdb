import { Serializable } from '@server/shared/types/serialize';
import { Benchmarks } from '@shared/benchmark';
import { Part, PartType } from '@shared/part';
import { PartImage } from '@shared/part-image';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';
import { Model, PartialModelObject } from 'objection';

export class PartModel extends Model implements Serializable<Part> {
  static tableName = 'parts';

  // Fields
  id!: number;
  slug!: string;

  type!: PartType;
  name!: string;

  // Relations
  specs?: Specs;
  benchmarks?: Benchmarks;
  metas?: PartMetas;
  images?: PartImage[];

  serialize(): Part {
    return {
      id: this.id,
      slug: this.slug,
      type: this.type,
      name: this.name,
      specs: this.specs ?? {},
      benchmarks: this.benchmarks ?? {},
      metas: this.metas ?? {},
      images: this.images ?? [],
    };
  }
}

export type PartModelPojo = PartialModelObject<PartModel>;
