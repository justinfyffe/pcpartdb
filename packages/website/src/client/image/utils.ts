import {
  Game,
  Image as ImageDto,
  ImageMeta,
  joinUrlParts,
  Product,
} from '@pcpartdb/shared';

export function getImagePath(image: Partial<ImageDto>) {
  return joinUrlParts('/u/images', image.path);
}

export function getPlaceholderGameImage() {
  return '/images/games/placeholder.svg';
}

export function getGameListingImage(game: Partial<Game>) {
  if (game?.listingImage != null) {
    return getImagePath(game.listingImage);
  }

  return getPlaceholderGameImage();
}

export function getCompanyLogoAutocompletePath(
  product: Partial<Product>,
): string {
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
      // No logo found, try the chipset
      return getCompanyLogoAutocompletePath(
        'parent' in product ? product.parent : null,
      );
  }
}

export function getCompanyLogoFeedPath(product: Product): string {
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

export function formatFileSize(fileSize: number) {
  return `${Math.round(fileSize / 1024)} KB`;
}

export function formatImageDimensions(width: number, height: number) {
  return `${width}x${height}`;
}

export async function getImageMeta(file: File) {
  return new Promise<ImageMeta>((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const height = image.height;
        const width = image.width;

        resolve({ height, fileSize: file.size, width });
      };
      image.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  });
}
