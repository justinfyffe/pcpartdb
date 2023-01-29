import { ImageModel, ImageModelPojo } from '@server/images/image-model';
import { Serializable } from '@server/shared/types/serialize';
import { Gpu } from '@shared/gpus';
import { Model, PartialModelObject } from 'objection';
import {
  GpuBenchmarksModel,
  GpuBenchmarksModelPojo,
} from './gpu-benchmarks-model';
import { GpuSpecsModel, GpuSpecsModelPojo } from './gpu-specs-model';

export class GpuModel extends Model implements Serializable<Gpu> {
  static tableName = 'gpus';

  // Fields
  id!: number;
  parentId?: number;
  slug!: string;

  name!: string;
  affiliateUrl?: string;

  // Relations
  parent?: GpuModel;
  specs?: GpuSpecsModel;
  benchmarks?: GpuBenchmarksModel;
  images?: ImageModel[];

  serialize(): Gpu {
    return {
      id: this.id,
      parentId: this.parentId,
      slug: this.slug,
      name: this.name,
      affiliateUrl: this.affiliateUrl,
      parent: this.parent?.serialize() ?? null,
      specs: this.specs?.serialize() ?? {},
      benchmarks: this.benchmarks?.serialize() ?? {},
      images: this.images?.map((image) => image.serialize()) ?? [],
    };
  }

  static relationMappings = {
    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: GpuModel,
      join: {
        from: 'gpus.parentId',
        to: 'gpus.id',
      },
    },
    specs: {
      relation: Model.HasOneRelation,
      modelClass: GpuSpecsModel,
      join: {
        from: 'gpus.id',
        to: 'gpu_specs.gpuId',
      },
    },
    benchmarks: {
      relation: Model.HasOneRelation,
      modelClass: GpuBenchmarksModel,
      join: {
        from: 'gpus.id',
        to: 'gpu_benchmarks.gpuId',
      },
    },
    images: {
      relation: Model.ManyToManyRelation,
      modelClass: ImageModel,
      join: {
        from: 'gpus.id',
        through: {
          from: 'gpu_images.gpuId',
          to: 'gpu_images.imageId',
        },
        to: 'images.id',
      },
    },
  };
}

export type GpuModelPojo = Omit<
  PartialModelObject<GpuModel>,
  'parent' | 'specs' | 'benchmarks' | 'images'
> & {
  parent?: GpuModelPojo;
  specs?: GpuSpecsModelPojo;
  benchmarks?: GpuBenchmarksModelPojo;
  images?: ImageModelPojo[];
};
