import { ProductGame, ProductGameFps } from '@pcpartdb/shared';
import { mapToGameDto } from '../mappers';
import { ProductGameFpsEntity } from './ProductGameFpsEntity';

interface MapToDtoOptions {
  includeGames?: boolean | (number | string)[]; // true OR ids or slugs
}

export async function mapToProductGameDto(
  entity: ProductGameFpsEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  const dto = mapToProductGameFpsDto(entity, options);
  if (dto == null) {
    return null;
  }

  const productId = entity.productId;
  const gameId = entity.gameId;
  const game = await mapToGameDto(entity.game, {
    includeListingImage: true,
  });

  return {
    productId,
    gameId,
    game,
    fps: [dto],
  } as ProductGame;
}

export async function mapToProductGameDtos(
  entities: ProductGameFpsEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const map = new Map<number, ProductGame>(); // Game ID => Game
  for (const entity of entities) {
    const gameId = entity.gameId;
    if (map.get(gameId)) {
      const dto = mapToProductGameFpsDto(entity, options);
      if (dto != null) {
        map.get(gameId).fps.push(dto);
      }
    } else {
      map.set(gameId, await mapToProductGameDto(entity, options));
    }
  }

  return [...map.values()]
    .filter((pg1) => pg1 != null)
    .sort((pg1, pg2) =>
      (pg2?.game?.releaseDate ?? '').localeCompare(
        pg1?.game?.releaseDate ?? '',
      ),
    );
}

function mapToProductGameFpsDto(
  entity: ProductGameFpsEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  // If the `includeGames` is an array, we should only return fps
  // that belong to those games.
  if (
    Array.isArray(options.includeGames) &&
    !options.includeGames.includes(entity.gameId) &&
    !options.includeGames.includes(entity.game?.slug ?? '')
  ) {
    return null;
  }

  return {
    productId: entity.productId,
    gameId: entity.gameId,
    settingsPresetKey: entity.settingsPresetKey,

    fps: entity.fps,
    fpsPerDollar: entity.fpsPerDollar,
    dollarsPerFrame: entity.dollarsPerFrame,

    metadata: entity.metadata,
  } as ProductGameFps;
}

export function mapToProductGameFpsEntities(dtos: ProductGame[]) {
  if (!dtos) {
    return [];
  }

  const ret: ProductGameFpsEntity[] = [];
  for (const gameDto of dtos) {
    for (const fpsDto of gameDto.fps) {
      const entity = mapToProductGameFpsEntity(fpsDto);
      if (entity) {
        ret.push(entity);
      }
    }
  }

  return ret;
}

function mapToProductGameFpsEntity(dto: ProductGameFps) {
  if (dto == null) {
    return null;
  }

  return {
    productId: undefined,
    gameId: dto.gameId,
    settingsPresetKey: dto.settingsPresetKey,

    fps: dto.fps,
    fpsPerDollar: dto.fpsPerDollar,
    dollarsPerFrame: dto.dollarsPerFrame,

    metadata: dto.metadata,
  } as ProductGameFpsEntity;
}
