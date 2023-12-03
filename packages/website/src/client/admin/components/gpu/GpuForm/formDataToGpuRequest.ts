import {
  CreateProductRequest,
  GpuFields,
  ProductType,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { GpuFormData } from './GpuFormData';

export function formDataToGpuRequest(
  formData: GpuFormData,
): CreateProductRequest | UpdateProductRequest {
  return {
    product: {
      productType: ProductType.Gpu,
      parentId: formData.parentId,
      slug: formData.slug,
      name: formData.name,
      company: formData.company,
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,
      summary: formData.summary,

      // Product Fields
      fields: {
        // General Info
        partNumber: formData.partNumber,
        marketSegment: formData.marketSegment,
        msrp: formData.msrp,
        releaseDate: formData.releaseDate,
        productionStatus: formData.productionStatus,

        // Processor
        codename: formData.codename ?? null,
        architecture: formData.architecture ?? null,
        processSize: formData.processSize ?? null,
        transistors: formData.transistors ?? null,

        // Board Compatibility & Dimensions
        slotWidth: formData.slotWidth ?? null,
        length: formData.length ?? null,
        width: formData.width ?? null,
        height: formData.height ?? null,
        weight: formData.weight ?? null,
        busInterface: formData.busInterface ?? null,
        tdp: formData.tdp ?? null,
        suggestedPsu: formData.suggestedPsu ?? null,
        powerConnectors: formData.powerConnectors ?? null,
        outputs: formData.outputs ?? null,

        // Cores & Clock Speeds
        gpuCores: formData.gpuCores ?? null,
        computeUnits: formData.computeUnits ?? null,
        tmus: formData.tmus ?? null,
        rops: formData.rops ?? null,
        tensorCores: formData.tensorCores ?? null,
        rtCores: formData.rtCores ?? null,
        gpuCoreBaseClock: formData.gpuCoreBaseClock ?? null,
        gpuCoreBoostClock: formData.gpuCoreBoostClock ?? null,
        l1Cache: formData.l1Cache ?? null,
        l2Cache: formData.l2Cache ?? null,

        // Theoretical Performance
        pixelRate: formData.pixelRate ?? null,
        textureRate: formData.textureRate ?? null,
        fp32: formData.fp32 ?? null,
        fp64: formData.fp64 ?? null,

        // Memory
        memorySize: formData.memorySize ?? null,
        memoryType: formData.memoryType ?? null,
        memoryClock: formData.memoryClock ?? null,
        memoryInterface: formData.memoryInterface ?? null,
        memoryBandwidth: formData.memoryBandwidth ?? null,

        // API Support
        directxVersion: formData.directxVersion ?? null,
        openClVersion: formData.openClVersion ?? null,
        openGlVersion: formData.openGlVersion ?? null,
        shaderModelVersion: formData.shaderModelVersion ?? null,
      } as GpuFields,

      // Meta
      metadata: {},

      benchmarks: formData.benchmarks?.filter(
        (benchmark) => benchmark != null && benchmark.value != null,
      ),

      images:
        formData.images
          ?.filter((image) => image != null)
          .map((image) => ({ imageId: image.imageId })) ?? [],

      sources: formData.sources?.filter(
        (source) => source != null && source.sourceUrl != null,
      ),
    },
  };
}
