import {
  CreateProductRequest,
  Product,
  ProductType,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { UseFormProps } from 'react-hook-form';
import { ProductFormInputGroups } from '../types';
import {
  buildCpuFormInputs,
  cpuFormOptions,
  formDataToCpuRequest,
} from './cpu';
import {
  buildGpuFormInputs,
  formDataToGpuRequest,
  gpuFormOptions,
} from './gpu';

export const FORM_INPUTS: Partial<
  Record<ProductType, (product?: Product) => ProductFormInputGroups>
> = {
  [ProductType.Cpu]: buildCpuFormInputs,
  [ProductType.Gpu]: buildGpuFormInputs,
};

export const FORM_OPTIONS: Partial<
  Record<ProductType, (product?: Product) => UseFormProps<any>>
> = {
  [ProductType.Cpu]: cpuFormOptions,
  [ProductType.Gpu]: gpuFormOptions,
};

export const FORM_DATA_TO_REQUEST: Partial<
  Record<
    ProductType,
    (data: any) => CreateProductRequest | UpdateProductRequest
  >
> = {
  [ProductType.Cpu]: formDataToCpuRequest,
  [ProductType.Gpu]: formDataToGpuRequest,
};
