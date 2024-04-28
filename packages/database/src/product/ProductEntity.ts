import * as db from '@prisma/client';
import { CpuFieldsEntity } from './CpuFieldsEntity';
import { GpuFieldsEntity } from './GpuFieldsEntity';
import { ProductBenchmarkEntity } from './ProductBenchmarkEntity';
import { ProductGameFpsEntity } from './ProductGameFpsEntity';
import { ProductImageEntity } from './ProductImageEntity';
import { ProductRanksEntity } from './ProductRankEntity';
import { ProductSourceEntity } from './ProductSourceEntity';
import { ProductUpdateEntity } from './ProductUpdateEntity';
import { RelatedProductEntity } from './RelatedProductEntity';

export type ProductEntity = db.Product & {
  cpuFields?: CpuFieldsEntity;
  gpuFields?: GpuFieldsEntity;
  benchmarks?: ProductBenchmarkEntity[];
  gameFps?: ProductGameFpsEntity[];
  ranks?: ProductRanksEntity;
  sources?: ProductSourceEntity[];
  updates?: ProductUpdateEntity[];
  images?: ProductImageEntity[];
  relatedProducts?: RelatedProductEntity[];
};
