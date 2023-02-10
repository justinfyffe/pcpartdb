import { mapToImageDto } from '@server/images/image-mappers';
import { GpuImage } from '@shared/gpus';
import { GpuImageEntity } from './gpu-entity';

export function mapToGpuImageDto(entity: GpuImageEntity): GpuImage {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,
    imageId: entity.imageId,
    image: mapToImageDto(entity.image),
  };
}

export function mapToGpuImageDtos(entities: GpuImageEntity[]): GpuImage[] {
  return entities.map((entity) => mapToGpuImageDto(entity));
}

export function mapToGpuImageEntity(
  gpuImage: Partial<GpuImage>,
): GpuImageEntity {
  if (gpuImage == null) {
    return null;
  }

  return {
    gpuId: undefined,
    imageId: gpuImage.imageId,
  };
}
