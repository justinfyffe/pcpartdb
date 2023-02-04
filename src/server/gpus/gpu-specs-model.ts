import { Serializable } from '@server/shared/types/serialize';
import { GpuSpec, GpuSpecs, MarketSegmentValue } from '@shared/gpus';
import { Model, PartialModelObject } from 'objection';

export class GpuSpecsModel extends Model implements Serializable<GpuSpecs> {
  static tableName = 'gpu_specs';
  static idColumn = 'gpu_id';

  // Fields
  gpuId!: number;

  company?: GpuSpec<string>;
  marketSegment?: GpuSpec<MarketSegmentValue>;
  launchPrice?: GpuSpec<number>;
  releaseDate?: GpuSpec<string>;

  codename?: GpuSpec<string>;
  architecture?: GpuSpec<string>;
  processSize?: GpuSpec<number>;
  transistors?: GpuSpec<number>;

  memorySize?: GpuSpec<number>;
  memoryType?: GpuSpec<string>;
  memoryClock?: GpuSpec<number>;
  memoryInterface?: GpuSpec<number>;
  memoryBandwidth?: GpuSpec<number>;

  slotWidth?: GpuSpec<number>;
  length?: GpuSpec<number>;
  width?: GpuSpec<number>;
  height?: GpuSpec<number>;
  weight?: GpuSpec<number>;
  thermalDesignPower?: GpuSpec<number>;
  suggestedPsu?: GpuSpec<number>;
  busInterface?: GpuSpec<string>;
  powerConnectors?: GpuSpec<string>;
  outputs?: GpuSpec<string>;

  shaderUnitsCudaCores?: GpuSpec<number>;
  textureMappingUnits?: GpuSpec<number>;
  renderOutputUnits?: GpuSpec<number>;
  tensorCores?: GpuSpec<number>;
  rayTracingCores?: GpuSpec<number>;
  coreClockSpeedBase?: GpuSpec<number>;
  coreClockSpeedBoost?: GpuSpec<number>;
  l1Cache?: GpuSpec<number>;
  l2Cache?: GpuSpec<number>;

  pixelFillRate?: GpuSpec<number>;
  textureFillRate?: GpuSpec<number>;
  fp32Performance?: GpuSpec<number>;
  fp64Performance?: GpuSpec<number>;

  directxVersion?: GpuSpec<number | string>;
  openClVersion?: GpuSpec<number | string>;
  openGlVersion?: GpuSpec<number | string>;
  shaderModelVersion?: GpuSpec<number | string>;

  serialize(): GpuSpecs {
    return {
      gpuId: this.gpuId,

      company: this.company,
      marketSegment: this.marketSegment,
      launchPrice: this.launchPrice,
      releaseDate: this.releaseDate,

      codename: this.codename,
      architecture: this.architecture,
      processSize: this.processSize,
      transistors: this.transistors,

      memorySize: this.memorySize,
      memoryType: this.memoryType,
      memoryClock: this.memoryClock,
      memoryInterface: this.memoryInterface,
      memoryBandwidth: this.memoryBandwidth,

      slotWidth: this.slotWidth,
      length: this.length,
      width: this.width,
      height: this.height,
      weight: this.weight,
      thermalDesignPower: this.thermalDesignPower,
      suggestedPsu: this.suggestedPsu,
      busInterface: this.busInterface,
      powerConnectors: this.powerConnectors,
      outputs: this.outputs,

      shaderUnitsCudaCores: this.shaderUnitsCudaCores,
      textureMappingUnits: this.textureMappingUnits,
      renderOutputUnits: this.renderOutputUnits,
      tensorCores: this.tensorCores,
      rayTracingCores: this.rayTracingCores,
      coreClockSpeedBase: this.coreClockSpeedBase,
      coreClockSpeedBoost: this.coreClockSpeedBoost,
      l1Cache: this.l1Cache,
      l2Cache: this.l2Cache,

      pixelFillRate: this.pixelFillRate,
      textureFillRate: this.textureFillRate,
      fp32Performance: this.fp32Performance,
      fp64Performance: this.fp64Performance,

      directxVersion: this.directxVersion,
      openClVersion: this.openClVersion,
      openGlVersion: this.openGlVersion,
      shaderModelVersion: this.shaderModelVersion,
    };
  }
}

export type GpuSpecsModelPojo = PartialModelObject<GpuSpecsModel>;
