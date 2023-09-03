import { Cpu, Gpu, Product, ProductType } from '../product';
import { formatCpuField, formatGpuField } from './formatProductField';

export interface FormatProductNameOptions {
  brand?: boolean;
  company?: boolean;
}

export function formatProductName(
  productType: ProductType,
  product: Product,
  options?: FormatProductNameOptions,
) {
  switch (productType) {
    case ProductType.Cpu:
      return formatCpuName(product as Cpu, options);
    case ProductType.Gpu:
      return formatGpuName(product as Gpu, options);
    default:
      throw new Error('Unsupported product tpye for formatting name.');
  }
}

// CPUs

const CPU_BRANDS: string[] = [
  'Ryzen 9',
  'Ryzen 7',
  'Ryzen 5',
  'Ryzen 3',
  'Ryzen',
  'Core 2',
  'Core',
  'Atom',
  'Pentium',
  'Celeron',
  'Xeon',
  'Mobile Athlon',
  'Athlon II',
  'Athlon',
  'Phenom II',
  'Phenom',
];

export function formatCpuName(cpu: Cpu, options?: FormatProductNameOptions) {
  if (cpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? formatCpuField(cpu.company) : null;

  const includeBrand = options?.brand ?? true;
  const cpuName = includeBrand
    ? cpu.name
    : CPU_BRANDS.reduce((acc, brand) => {
        return acc.replace(`${brand}`, '');
      }, cpu.name).trim();

  return company != null ? `${company} ${cpuName}` : cpuName;
}

// GPU

const BRANDS = ['Radeon', 'GeForce', 'Quadro'];

export function formatGpuName(gpu: Gpu, options?: FormatProductNameOptions) {
  if (gpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? formatGpuField(gpu.company) : null;

  const includeBrand = options?.brand ?? true;
  const gpuName = includeBrand
    ? gpu.name
    : BRANDS.reduce((acc, brand) => {
        return acc.replace(`${brand}`, '');
      }, gpu.name).trim();

  return company != null ? `${company} ${gpuName}` : gpuName;
}
