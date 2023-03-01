import { Image } from '@pcpartdb/website/shared/image';
import { ImageEntity } from './image-entity';

export function mapToImageDto(row: ImageEntity): Image {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    path: row.path,
    name: row.name,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    fileSize: row.fileSize,
    height: row.height,
    width: row.width,
    uploadedAt: row.uploadedAt.getTime(),
  };
}

export function mapToImageEntity(image: Image): ImageEntity {
  if (image == null) {
    return null;
  }

  return {
    id: undefined,
    path: image.path,
    name: image.name,
    sourceName: image.sourceName,
    sourceUrl: image.sourceUrl,
    fileSize: image.fileSize,
    height: image.height,
    width: image.width,
    uploadedAt: new Date(image.uploadedAt),
  };
}
