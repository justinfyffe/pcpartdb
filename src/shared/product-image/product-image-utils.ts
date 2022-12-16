import { Product } from '../product/product-types';

export function getCompanyLogoImage(product: Product) {
  const specs = product?.specs;
  const company = specs?.company?.value;

  if (company == null) {
    return null;
  }

  switch (company) {
    case 'AMD':
      return '/images/logos/amd.svg';
    case 'NVIDIA':
      return '/images/logos/nvidia.svg';
    default:
      return null;
  }
}
