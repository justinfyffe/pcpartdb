import { CpuImage, GpuImage } from '@pcpartdb/shared';
import { CpuImageEntity } from '../cpu';
import { mapToImageDto } from './imageMapper';

export function mapToCpuImageDto(entity: CpuImageEntity): CpuImage {
  if (entity == null) {
    return null;
  }

  return {
    cpuId: entity.cpuId,
    imageId: entity.imageId,
    image: mapToImageDto(entity.image),
  };
}

export function mapToCpuImageDtos(entities: CpuImageEntity[]): CpuImage[] {
  if (entities == null) {
    return [];
  }

  return entities.map((entity) => mapToCpuImageDto(entity));
}

export function mapToCpuImageEntity(
  cpuImage: Partial<CpuImage>,
): CpuImageEntity {
  if (cpuImage == null) {
    return null;
  }

  return {
    cpuId: cpuImage.cpuId,
    imageId: cpuImage.imageId,
  };
}

export function mapToCpuImageEntities(
  cpuImages: Partial<GpuImage>[],
): CpuImageEntity[] {
  if (cpuImages == null) {
    return [];
  }

  return cpuImages.map((cpuImage) => mapToCpuImageEntity(cpuImage));
}
