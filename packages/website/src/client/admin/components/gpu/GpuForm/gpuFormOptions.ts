import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  GpuProduct,
  productBenchmarkSchema,
  productFieldSchema,
  productImageSchema,
  productSourceSchema,
} from '@pcpartdb/shared';
import { UseFormProps } from 'react-hook-form';
import { GpuFormData } from './GpuFormData';

export const gpuFormSchema = Joi.object({
  parentId: Joi.number().allow(null),

  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),
  summary: Joi.string().allow(null),

  // Sources
  sources: Joi.array().items(productSourceSchema),

  // General
  partNumber: productFieldSchema.allow(null),
  marketSegment: productFieldSchema.allow(null),
  msrp: productFieldSchema.allow(null),
  releaseDate: productFieldSchema.allow(null),
  productionStatus: productFieldSchema.allow(null),

  // Processor
  codename: productFieldSchema.allow(null),
  architecture: productFieldSchema.allow(null),
  processSize: productFieldSchema.allow(null),
  transistors: productFieldSchema.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: productFieldSchema.allow(null),
  length: productFieldSchema.allow(null),
  width: productFieldSchema.allow(null),
  height: productFieldSchema.allow(null),
  weight: productFieldSchema.allow(null),
  busInterface: productFieldSchema.allow(null),
  tdp: productFieldSchema.allow(null),
  suggestedPsu: productFieldSchema.allow(null),
  powerConnectors: productFieldSchema.allow(null),
  outputs: productFieldSchema.allow(null),

  // Cores & Clock Speed
  gpuCores: productFieldSchema.allow(null),
  computeUnits: productFieldSchema.allow(null),
  tmus: productFieldSchema.allow(null),
  rops: productFieldSchema.allow(null),
  tensorCores: productFieldSchema.allow(null),
  rtCores: productFieldSchema.allow(null),
  gpuCoreBaseClock: productFieldSchema.allow(null),
  gpuCoreBoostClock: productFieldSchema.allow(null),
  l1Cache: productFieldSchema.allow(null),
  l2Cache: productFieldSchema.allow(null),

  // Theoretical Performance
  pixelRate: productFieldSchema.allow(null),
  textureRate: productFieldSchema.allow(null),
  fp32: productFieldSchema.allow(null),
  fp64: productFieldSchema.allow(null),

  // Memory
  memorySize: productFieldSchema.allow(null),
  memoryType: productFieldSchema.allow(null),
  memoryClock: productFieldSchema.allow(null),
  memoryInterface: productFieldSchema.allow(null),
  memoryBandwidth: productFieldSchema.allow(null),

  // API Support
  directxVersion: productFieldSchema.allow(null),
  openClVersion: productFieldSchema.allow(null),
  openGlVersion: productFieldSchema.allow(null),
  shaderModelVersion: productFieldSchema.allow(null),

  // Benchmarks
  benchmarks: Joi.array().items(productBenchmarkSchema),

  // Images
  images: Joi.array().items(productImageSchema),
}).options({ abortEarly: false });

export function gpuFormOptions(gpu?: GpuProduct): UseFormProps<GpuFormData> {
  const benchmarks = gpu?.benchmarks || [];
  const sources = gpu?.sources || [];
  const images = gpu?.images || [];

  return {
    resolver: joiResolver(gpuFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: gpu?.name ?? null,
      slug: gpu?.slug ?? null,
      otherNames: gpu?.otherNames || [],
      searchText: gpu?.searchText ?? null,
      affiliateUrl: gpu?.affiliateUrl ?? null,
      summary: gpu?.summary ?? null,

      parentId: gpu?.parentId ?? null,

      // Data Sources
      sources,

      // General
      partNumber: gpu?.fields?.partNumber ?? null,
      company: gpu?.company ?? null,
      marketSegment: gpu?.fields?.marketSegment ?? null,
      msrp: gpu?.fields?.msrp ?? null,
      releaseDate: gpu?.fields?.releaseDate ?? null,
      productionStatus: gpu?.fields?.productionStatus ?? null,

      // Processor
      codename: gpu?.fields?.codename ?? null,
      architecture: gpu?.fields?.architecture ?? null,
      processSize: gpu?.fields?.processSize ?? null,
      transistors: gpu?.fields?.transistors ?? null,

      // Board Compatibility & Dimensions
      slotWidth: gpu?.fields?.slotWidth ?? null,
      length: gpu?.fields?.length ?? null,
      width: gpu?.fields?.width ?? null,
      height: gpu?.fields?.height ?? null,
      weight: gpu?.fields?.weight ?? null,
      busInterface: gpu?.fields?.busInterface ?? null,
      tdp: gpu?.fields?.tdp ?? null,
      suggestedPsu: gpu?.fields?.suggestedPsu ?? null,
      powerConnectors: gpu?.fields?.powerConnectors ?? null,
      outputs: gpu?.fields?.outputs ?? null,

      // Cores & Clock Speeds
      gpuCores: gpu?.fields?.gpuCores ?? null,
      computeUnits: gpu?.fields?.computeUnits ?? null,
      tmus: gpu?.fields?.tmus ?? null,
      rops: gpu?.fields?.rops ?? null,
      tensorCores: gpu?.fields?.tensorCores ?? null,
      rtCores: gpu?.fields?.rtCores ?? null,
      gpuCoreBaseClock: gpu?.fields?.gpuCoreBaseClock ?? null,
      gpuCoreBoostClock: gpu?.fields?.gpuCoreBoostClock ?? null,
      l1Cache: gpu?.fields?.l1Cache ?? null,
      l2Cache: gpu?.fields?.l2Cache ?? null,

      // Theoretical Performance
      pixelRate: gpu?.fields?.pixelRate ?? null,
      textureRate: gpu?.fields?.textureRate ?? null,
      fp32: gpu?.fields?.fp32 ?? null,
      fp64: gpu?.fields?.fp64 ?? null,

      // Memory
      memorySize: gpu?.fields?.memorySize ?? null,
      memoryType: gpu?.fields?.memoryType ?? null,
      memoryClock: gpu?.fields?.memoryClock ?? null,
      memoryInterface: gpu?.fields?.memoryInterface ?? null,
      memoryBandwidth: gpu?.fields?.memoryBandwidth ?? null,

      // API Support
      directxVersion: gpu?.fields?.directxVersion ?? null,
      openClVersion: gpu?.fields?.openClVersion ?? null,
      openGlVersion: gpu?.fields?.openGlVersion ?? null,
      shaderModelVersion: gpu?.fields?.shaderModelVersion ?? null,

      // Benchmarks
      benchmarks,

      // Images
      images,
    },
  };
}
