import * as db from '@prisma/client';
import { AutomationSourceEntity } from '../automation';
import { CpuFieldsEntity } from './CpuFieldsEntity';
import { GpuFieldsEntity } from './GpuFieldsEntity';
import { ProductBenchmarkEntity } from './ProductBenchmarkEntity';
import { ProductImageEntity } from './ProductImageEntity';
import { ProductSourceEntity } from './ProductSourceEntity';
import { ProductUpdateEntity } from './ProductUpdateEntity';

export type ProductEntity = db.Product & {
  cpuFields?: CpuFieldsEntity;
  gpuFields?: GpuFieldsEntity;
  benchmarks?: ProductBenchmarkEntity[];
  sources?: ProductSourceEntity[];
  updates?: ProductUpdateEntity[];
  images?: ProductImageEntity[];
  relatedAutomationSources?: AutomationSourceEntity[];

  parent?: ProductEntity;
  children?: ProductEntity[];
};
