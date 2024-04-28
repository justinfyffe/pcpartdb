import { Product } from '@pcpartdb/shared';

export function companyLogoAutocompletePath(product: Partial<Product>): string {
  if (product == null) {
    return null;
  }

  if (!('company' in product)) {
    return null;
  }

  const company = product.company;
  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'acer':
      return '/images/autocomplete/acer.png';
    case 'amd':
      return '/images/autocomplete/amd.svg';
    case 'ati':
      return '/images/autocomplete/ati.svg';
    case 'asrock':
      return '/images/autocomplete/asrock.png';
    case 'asus':
      return '/images/autocomplete/asus.png';
    case 'evga':
      return '/images/autocomplete/evga.png';
    case 'gainward':
      return '/images/autocomplete/gainward.png';
    case 'galax':
      return '/images/autocomplete/galax.png';
    case 'gigabyte':
      return '/images/autocomplete/gigabyte.png';
    case 'inno3d':
      return '/images/autocomplete/inno3d.png';
    case 'intel':
      return '/images/autocomplete/intel.svg';
    case 'msi':
      return '/images/autocomplete/msi.png';
    case 'nvidia':
      return '/images/autocomplete/nvidia.svg';
    case 'pny':
      return '/images/autocomplete/pny.png';
    case 'powercolor':
      return '/images/autocomplete/powercolor.png';
    case 'sapphire':
      return '/images/autocomplete/sapphire.png';
    case 'xfx':
      return '/images/autocomplete/xfx.png';
    case 'zotac':
      return '/images/autocomplete/zotac.png';
    default:
      return null;
  }
}
