import { Gpu, Image as ImageDto, ImageMeta } from '@pcpartdb/shared';

export function getImagePath(image: ImageDto) {
  return `/u/images/${image.path}`;
}

export function getCompanyLogoImagePath(gpu: Gpu) {
  const company = gpu?.company?.value;

  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'amd':
      return '/images/logos/amd.svg';
    case 'intel':
      return '/images/logos/intel.svg';
    case 'nvidia':
      return '/images/logos/nvidia.svg';
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
