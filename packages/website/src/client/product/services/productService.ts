import {
  ImportProductsRequest,
  PreviewImportProductsRequest,
  Product,
  ProductType,
  ScrapeProductRequest,
} from '@pcpartdb/shared';
import { cpuService } from './cpuService';
import { gpuService } from './gpuService';

export class ProductService {
  constructor() {}

  async autocomplete(
    productType: ProductType,
    query: string,
  ): Promise<Product[]> {
    if (productType === ProductType.Cpu) {
      return await cpuService.autocomplete(query);
    } else if (productType === ProductType.Gpu) {
      return await gpuService.autocomplete(query);
    } else {
      throw new Error(`Invalid product type for autocomplete: ${productType}`);
    }
  }

  async scrapeProduct(productType: ProductType, data: ScrapeProductRequest) {
    if (productType === ProductType.Cpu) {
      return await cpuService.scrapeCpu(data);
    } else if (productType === ProductType.Gpu) {
      return await gpuService.scrapeGpu(data);
    } else {
      throw new Error(`Invalid product type for scrapeProduct: ${productType}`);
    }
  }

  async importProducts(productType: ProductType, data: ImportProductsRequest) {
    if (productType === ProductType.Cpu) {
      return await cpuService.importCpus(data);
    } else if (productType === ProductType.Gpu) {
      return await gpuService.importGpus(data);
    } else {
      throw new Error(
        `Invalid product type for importProducts: ${productType}`,
      );
    }
  }

  async previewImportProducts(
    productType: ProductType,
    data: PreviewImportProductsRequest,
  ) {
    if (productType === ProductType.Cpu) {
      return await cpuService.previewImportCpus(data);
    } else if (productType === ProductType.Gpu) {
      return await gpuService.previewImportGpus(data);
    } else {
      throw new Error(
        `Invalid product type for previewImportProducts: ${productType}`,
      );
    }
  }
}

export const productService = new ProductService();
