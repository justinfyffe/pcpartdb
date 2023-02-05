import * as db from '@prisma/client';
import { Image } from '@shared/image';

export function mapToImageDto(row: db.images): Image {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    path: row.path,
    name: row.name,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    fileSize: row.file_size,
    height: row.height,
    width: row.width,
    uploadedAt: row.updated_at.getTime(),
  };
}
