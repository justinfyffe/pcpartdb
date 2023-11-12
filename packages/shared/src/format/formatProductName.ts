import { Product } from '../product';
import { formatCompanyName } from './formatProductField';

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
const GPU_BRANDS = ['Radeon', 'GeForce', 'Quadro'];

export interface FormatProductNameOptions {
  brand?: boolean;
  company?: boolean;
}

export function formatProductName(
  product: Partial<Product>,
  options?: FormatProductNameOptions,
) {
  if (product == null || product?.name == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;

  const company = includeCompany ? formatCompanyName(product.company) : null;

  const includeBrand = options?.brand ?? true;
  const productName = includeBrand
    ? product.name
    : [...CPU_BRANDS, ...GPU_BRANDS]
        .reduce((acc, brand) => {
          return acc.replace(`${brand}`, '');
        }, product.name)
        .trim();

  return company != null ? `${company} ${productName}` : productName;
}
