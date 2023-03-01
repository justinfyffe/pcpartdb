import { mapToImageDto } from '@pcpartdb/website/server/images/image-mappers';
import { GpuImage } from '@pcpartdb/website/shared/gpus';
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
  if (entities == null) {
    return [];
  }

  return entities.map((entity) => mapToGpuImageDto(entity));
}

export function mapToGpuImageEntity(
  gpuImage: Partial<GpuImage>,
): GpuImageEntity {
  if (gpuImage == null) {
    return null;
  }

  return {
    gpuId: gpuImage.gpuId,
    imageId: gpuImage.imageId,
  };
}

export function mapToGpuImageEntities(
  gpuImages: Partial<GpuImage>[],
): GpuImageEntity[] {
  if (gpuImages == null) {
    return [];
  }

  return gpuImages.map((gpuImage) => mapToGpuImageEntity(gpuImage));
}
