import { Product } from '@pcpartdb/shared';

export function companyLogoFeedPath(product: Partial<Product>): string {
  if (product == null) {
    return null;
  }

  let company: string = null;
  if (product.parent != null) {
    company = product.parent.company;
  } else {
    company = product.company;
  }

  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'amd':
      return '/images/feed/amd.svg';
    case 'intel':
      return '/images/feed/intel.svg';
    case 'nvidia':
      return '/images/feed/nvidia.svg';
    default:
      return null;
  }
}
