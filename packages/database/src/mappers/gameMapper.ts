import { Game, GameScraperOptions } from '@pcpartdb/shared';
import { GameEntity } from '../game';
import { mapToProductDto } from '../product';
import { mapToImageDto } from './imageMapper';

interface MapToDtoOptions {
  includeScraperOptions?: boolean;
  includeRequirements?: boolean;
  includeListingImage?: boolean;
}

export async function mapToGameDto(
  entity: GameEntity,
  options?: MapToDtoOptions,
): Promise<Game> {
  if (entity == null) {
    return null;
  }

  const includeScraperOptions = options?.includeScraperOptions ?? false;
  const includeRequirements = options?.includeScraperOptions ?? false;
  const includeListingImage = options?.includeListingImage ?? false;

  const scraperOptions = includeScraperOptions
    ? (entity.scraperOptions as GameScraperOptions)
    : undefined;

  const [minimumCpu, minimumGpu, recommendedCpu, recommendedGpu] =
    await Promise.all([
      includeRequirements ? mapToProductDto(entity.minimumCpu, {}) : undefined,
      includeRequirements ? mapToProductDto(entity.minimumGpu, {}) : undefined,
      includeRequirements
        ? mapToProductDto(entity.recommendedCpu, {})
        : undefined,
      includeRequirements
        ? mapToProductDto(entity.recommendedGpu, {})
        : undefined,
    ]);

  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,

    nameShort: entity.nameShort,
    description: entity.description,
    publisher: entity.publisher,
    developer: entity.developer,
    releaseDate: entity.releaseDate,
    affiliateUrl: entity.affiliateUrl,

    gameSettings: entity.gameSettings,
    scraperOptions,

    minimumRequirements: includeRequirements
      ? entity.minimumRequirements
      : undefined,
    recommendedRequirements: includeRequirements
      ? entity.recommendedRequirements
      : undefined,

    minimumCpuId: includeRequirements ? entity.minimumCpuId : undefined,
    recommendedCpuId: includeRequirements ? entity.recommendedCpuId : undefined,
    minimumGpuId: includeRequirements ? entity.minimumGpuId : undefined,
    recommendedGpuId: includeRequirements ? entity.recommendedGpuId : undefined,

    listingImageId: includeListingImage ? entity.listingImageId : undefined,

    metadata: entity.metadata,

    listingImage: mapToImageDto(entity.listingImage),
    minimumCpu,
    minimumGpu,
    recommendedCpu,
    recommendedGpu,
  } as Game;
}

export async function mapToGameDtos(
  entities: GameEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const promises = entities.map((entity) => mapToGameDto(entity, options));
  return await Promise.all(promises);
}

export function mapToGameEntity(dto: Game): GameEntity {
  if (dto == null) {
    return null;
  }

  return {
    id: undefined,
    name: dto.name,
    slug: dto.slug,

    nameShort: dto.nameShort,
    description: dto.description,
    publisher: dto.publisher,
    developer: dto.developer,
    releaseDate: dto.releaseDate,
    affiliateUrl: dto.affiliateUrl,

    gameSettings: dto.gameSettings,
    scraperOptions: dto.scraperOptions,

    minimumRequirements: dto.minimumRequirements,
    recommendedRequirements: dto.recommendedRequirements,

    minimumCpuId: dto.minimumCpuId,
    recommendedCpuId: dto.recommendedCpuId,
    minimumGpuId: dto.minimumGpuId,
    recommendedGpuId: dto.recommendedGpuId,

    listingImageId: dto.listingImageId,

    metadata: dto.metadata,
  } as GameEntity;
}
