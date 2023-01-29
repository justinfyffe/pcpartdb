import { Serializable } from '@server/shared/types/serialize';
import { GpuBenchmark, GpuBenchmarks } from '@shared/gpus';
import { Model, PartialModelObject } from 'objection';

export class GpuBenchmarksModel
  extends Model
  implements Serializable<GpuBenchmarks>
{
  static tableName = 'gpu_benchmarks';
  static idColumn = 'gpu_id';

  // Fields
  gpuId!: number;

  performanceScore?: GpuBenchmark<number>;
  valueScore?: GpuBenchmark<number>;

  g3dMark?: GpuBenchmark<number>;
  g2dMark?: GpuBenchmark<number>;
  timespyGraphics?: GpuBenchmark<number>;

  serialize(): GpuBenchmarks {
    return {
      gpuId: this.gpuId,

      performanceScore: this.performanceScore,
      valueScore: this.valueScore,

      g3dMark: this.g3dMark,
      g2dMark: this.g2dMark,
      timespyGraphics: this.timespyGraphics,
    };
  }
}

export type GpuBenchmarksModelPojo = PartialModelObject<GpuBenchmarksModel>;
