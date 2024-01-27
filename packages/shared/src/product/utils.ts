import { formatProductName } from '../format';
import { CpuProduct, GpuProduct, Product, ProductType } from './common';

export function isCpuProduct(product: Product): product is CpuProduct {
  return product?.productType === ProductType.Cpu;
}

export function isGpuProduct(product: Product): product is GpuProduct {
  return product?.productType === ProductType.Gpu;
}
export function isGpuChipset(product: Product): product is GpuProduct {
  return isGpuProduct(product) && product.parentId == null;
}

export function isGpuRetailModel(product: Product): product is GpuProduct {
  return isGpuProduct(product) && product.parentId != null;
}

export function getGpuChipset(gpu: GpuProduct) {
  return (gpu?.parent || gpu) as GpuProduct;
}

export interface GenerateProductSlugOptions {
  company?: string;
  name?: string;
}

export function generateProductSlug(options: GenerateProductSlugOptions) {
  const { company, name } = options;

  const slugParts = [];
  if (company != null) {
    const companyParts = company
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...companyParts);
  }
  if (name != null) {
    const nameParts = name
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}

export function getAffiliateUrl(product: Product) {
  const associateKey = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_KEY;
  if (product.affiliateUrl) {
    const url = new URL(product.affiliateUrl);
    if (!url.searchParams.has('tag')) {
      url.searchParams.append('tag', associateKey);
    }
    return url.toString();
  }

  const productName = formatProductName(product);
  const query = productName.replaceAll(' ', '+');

  // Return generated affiliate url based on search results
  return `https://www.amazon.com/s?k=${query}&tag=${associateKey}`;
}

export interface GenerateProductSearchableTextOptions {
  company?: string;
  name?: string;
}

export function generateProductSearchableText(
  options: GenerateProductSearchableTextOptions,
) {
  const { company, name } = options;

  return `${company || ''} ${name || ''}`.trim();
}

export interface GenerateProductOtherNamesOptions {
  company?: string;
  name?: string;
}

export function generateProductOtherNames(
  options: GenerateProductOtherNamesOptions,
) {
  const { company, name } = options;
  const fullName = formatProductName({ company, name });
  const nameWithoutCompany = formatProductName(
    { company, name },
    { company: false },
  );
  const nameWithoutCompanyAndBrand = formatProductName(
    { company, name },
    { company: false, brand: false },
  );

  return [fullName, nameWithoutCompany, nameWithoutCompanyAndBrand].filter(
    (value) => value,
  );
}
