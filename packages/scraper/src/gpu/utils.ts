import { GpuProductType, ProductType } from '@pcpartdb/shared';

interface GenerateGpuGroupKeyOptions {
  gpuType: GpuProductType;
  company: string;
  name: string;
}

export function generateGpuGroupKey(options: GenerateGpuGroupKeyOptions) {
  const type = ProductType.Gpu;
  const gpuType = options.gpuType;
  const company = options.company.toUpperCase();
  let name = options.name.toUpperCase();

  if (name.includes('LAPTOP GPU')) {
    name = name.replace('LAPTOP GPU', 'MOBILE').trim();
  }
  if (name.includes('(MOBILE)')) {
    name = name.replace('(MOBILE)', 'MOBILE').trim();
  }
  if (name.includes('WITH MAX-Q DESIGN')) {
    name = name.replace('WITH MAX-Q DESIGN', 'MAX-Q').trim();
  }
  if (name.includes(' / NFORCE')) {
    name = name.replace(' / NFORCE', ' NFORCE').trim();
  }
  if (name.includes(' + NFORCE')) {
    name = name.replace(' + NFORCE', ' NFORCE').trim();
  }
  if (name.includes('FIREPRO 3D')) {
    name = name.replace('FIREPRO 3D', 'FIREPRO').trim();
  }
  if (name.includes(' OEM')) {
    name = name.replace(' OEM', '').trim();
  }

  name = name
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join('_');

  return `${type}__${gpuType}__${company}__${name}`;
}
