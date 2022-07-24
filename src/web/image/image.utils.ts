import { Image as ImageDto, ImageMeta } from '../../types/image';

const CDN_URL = process.env.CDN_URL;

export function getImageUrl(image: ImageDto) {
  return `${CDN_URL}/images/${image.path}`;
}

export function formatFileSize(fileSize: number) {
  return `${Math.round(fileSize / 1024)} KB`;
}

export function formatDimensions(width: number, height: number) {
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
