import {
  CreateProductRequest,
  formatCompanyName,
  ProductType,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { CpuFormData } from './CpuFormData';

export function formDataToCpuRequest(
  formData: CpuFormData,
): CreateProductRequest | UpdateProductRequest {
  return {
    product: {
      productType: ProductType.Cpu,
      slug: formData.slug,
      name: formData.name,
      company: formatCompanyName(formData.company),
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,
      summary: formData.summary,

      // Product Fields
      fields: {
        // General Info
        partNumber: formData.partNumber || null,
        marketSegment: formData.marketSegment || null,
        msrp: formData.msrp || null,
        releaseDate: formData.releaseDate || null,
        productionStatus: formData.productionStatus || null,
        bundledCooler: formData.bundledCooler || null,

        //
        socket: formData.socket || null,
        foundry: formData.foundry || null,
        processSize: formData.processSize || null,
        transistors: formData.transistors || null,
        tCaseMax: formData.tCaseMax || null,
        tjMax: formData.tjMax || null,

        //
        architecture: formData.architecture || null,
        codename: formData.codename || null,
        generation: formData.generation || null,
        pciExpress: formData.pciExpress || null,
        chipsets: formData.chipsets || null,

        //
        memorySupport: formData.memorySupport || null,
        memoryChannels: formData.memoryChannels || null,
        eccMemory: formData.eccMemory || null,

        //
        cores: formData.cores || null,
        threads: formData.threads || null,
        pCores: formData.pCores || null,
        eCores: formData.eCores || null,
        clock: formData.clock || null,
        turboClock: formData.turboClock || null,
        pCoreClock: formData.pCoreClock || null,
        pCoreTurboClock: formData.pCoreTurboClock || null,
        eCoreClock: formData.eCoreClock || null,
        eCoreTurboClock: formData.eCoreTurboClock || null,
        baseClock: formData.baseClock || null,
        multiplier: formData.multiplier || null,
        multiplierUnlocked: formData.multiplierUnlocked || null,

        //
        tdp: formData.tdp || null,
        pl1: formData.pl1 || null,
        pl2: formData.pl2 || null,
        ppt: formData.ppt || null,

        //
        l1Cache: formData.l1Cache || null,
        l2Cache: formData.l2Cache || null,
        l3Cache: formData.l3Cache || null,
        eCoreL1Cache: formData.eCoreL1Cache || null,
        eCoreL2Cache: formData.eCoreL2Cache || null,

        // Graphics
        integratedGraphics: formData.integratedGraphics || null,

        // Features
        extensionsTechnologies: formData.extensionsTechnologies || null,
      },

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
