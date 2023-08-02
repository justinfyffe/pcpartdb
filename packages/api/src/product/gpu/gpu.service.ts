import { Injectable } from '@nestjs/common';
import { mapToGpuDto, mapToGpuDtos, mapToGpuEntity } from '@pcpartdb/database';
import {
  CreateGpuRequest,
  Gpu,
  GpuComparison,
  GpuDataSourceKey,
  GpuFieldKey,
  GpuMeta,
  GpuRank,
  GpuUpdate,
  ListGpusQuery,
  populateGpuPerformanceScoreBenchmark,
  populateGpuValueScoreBenchmark,
  ProductDataUpdate,
  ProductSourceGroup,
  ProductType,
  UpdateGpuRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { Context } from '../../shared/context';
import { badRequestError, notFoundError } from '../../shared/error';
import { GpuRepository } from './gpu.repository';
import { GpuRanksService } from './ranks/gpu-ranks.service';

interface CountOptions {
  query?: ListGpusQuery;
}

interface CountRetailModelsOptions {
  chipsetIds: number[];
}

interface ListOptions {
  query?: ListGpusQuery;

  fields?: GpuFieldKey[];
  chipsetFields?: GpuFieldKey[];
  retailModelFields?: GpuFieldKey[];

  includeImages?: boolean;
  includeChipset?: boolean;
  includeRetailModels?: boolean;
  includeRanks?: GpuRank[];
}

interface GetOptions {
  chipsetFields?: GpuFieldKey[];
  retailModelFields?: GpuFieldKey[];

  includeImages?: boolean;
  includeChipset?: boolean;
  includeRetailModels?: boolean;
  includeRanks?: GpuRank[];
}

interface GetComparisonOptions {
  slug?: string;
  retailModelFields?: GpuFieldKey[];

  includeImages?: boolean;
  includeRetailModels?: boolean;
  includeRanks?: GpuRank[];
}

interface ApplyProductUpdateOptions {
  slug?: string;
}

@Injectable()
export class GpuService {
  constructor(
    private gpuRepository: GpuRepository,
    private gpuRanksService: GpuRanksService,
  ) {}

  async count(options: CountOptions, ctx: Context) {
    return await this.gpuRepository.count(options, ctx);
  }

  async countRetailModels(options: CountRetailModelsOptions, ctx: Context) {
    return await this.gpuRepository.countRetailModels(options, ctx);
  }

  async list(options: ListOptions, ctx: Context) {
    const gpuEntities = await this.gpuRepository.list(options, ctx);

    const fields = options.fields != null ? new Set(options.fields) : null;
    const chipsetFields =
      options.chipsetFields != null ? new Set(options.chipsetFields) : null;
    const retailModelFields =
      options.retailModelFields != null
        ? new Set(options.retailModelFields)
        : null;
    const gpus: Gpu[] = mapToGpuDtos(gpuEntities, {
      fields,
      chipsetFields,
      retailModelFields,
      includeSources: ctx.user?.isStaff,
    });

    if (options.includeRanks) {
      await this.gpuRanksService.populateRanks(options.includeRanks, gpus, ctx);
    }

    return gpus;
  }

  async getById(id: number, options: GetOptions, ctx: Context) {
    const chipsetFields =
      options.chipsetFields != null ? new Set(options.chipsetFields) : null;
    const retailModelFields =
      options.retailModelFields != null
        ? new Set(options.retailModelFields)
        : null;

    const gpuEntity = await this.gpuRepository.findById(id, options, ctx);
    const gpu = mapToGpuDto(gpuEntity, {
      chipsetFields,
      retailModelFields,
      includeSources: ctx.user?.isStaff,
    });

    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }
    if (options.includeRanks) {
      await this.gpuRanksService.populateRanks(
        options.includeRanks,
        [gpu, gpu.chipset],
        ctx,
      );
    }

    return gpu;
  }

  async getBySlug(slug: string, options: GetOptions, ctx: Context) {
    const chipsetFields =
      options.chipsetFields != null ? new Set(options.chipsetFields) : null;
    const retailModelFields =
      options.retailModelFields != null
        ? new Set(options.retailModelFields)
        : null;

    const gpuEntity = await this.gpuRepository.findBySlug(slug, options, ctx);
    const gpu = mapToGpuDto(gpuEntity, {
      chipsetFields,
      retailModelFields,
      includeSources: ctx.user?.isStaff,
    });

    if (gpu == null) {
      throw notFoundError({ gpu: slug });
    }
    if (options.includeRanks) {
      await this.gpuRanksService.populateRanks(
        options.includeRanks,
        [gpu, gpu.chipset],
        ctx,
      );
    }

    return gpu;
  }

  async getComparison(options: GetComparisonOptions, ctx: Context) {
    const { slug } = options;
    const slugs = slug.split('--vs--');

    if (slugs.length !== 2) {
      throw notFoundError({ comparison: slug });
    } else if (slugs[0] === slugs[1]) {
      throw notFoundError({ comparison: slug });
    }

    const gpus: Gpu[] = [];
    for (const slugItem of slugs) {
      const gpu = await this.getBySlug(
        slugItem,
        {
          retailModelFields: options.retailModelFields,
          includeRetailModels: options.includeRetailModels,
          includeImages: options.includeImages,
          includeRanks: options.includeRanks || null,
        },
        ctx,
      );

      if (gpu != null) {
        gpus.push(gpu);
      }
    }

    const [gpu1, gpu2] = gpus;
    if (gpu1.chipsetId != null || gpu2.chipsetId != null) {
      throw notFoundError(null);
    }

    return gpus as GpuComparison;
  }

  async create(data: CreateGpuRequest, ctx: Context) {
    // Check if another part exists at the slug
    const existingGpu = await this.gpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingGpu != null) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    populateGpuPerformanceScoreBenchmark(data);
    populateGpuValueScoreBenchmark(data);

    const entity = mapToGpuEntity({ id: undefined, ...data });
    const result = await this.gpuRepository.create(entity, ctx);
    return mapToGpuDto(result);
  }

  async update(id: number, data: UpdateGpuRequest, ctx: Context) {
    // Check if another gpu exists at the slug
    const existingGpu = await this.gpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingGpu != null && existingGpu.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    const gpu = await this.gpuRepository.findById(id, {}, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    populateGpuPerformanceScoreBenchmark(data);
    populateGpuValueScoreBenchmark(data);

    const entity = mapToGpuEntity({ id: undefined, ...data });
    const result = await this.gpuRepository.update(id, entity, ctx);
    return mapToGpuDto(result);
  }

  async delete(id: number, ctx: Context) {
    const gpu = await this.gpuRepository.findById(id, {}, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    await this.gpuRepository.delete(id, ctx);
    return id;
  }

  // TODO: delete
  async applyDataUpdate(dataUpdate: ProductDataUpdate, ctx: Context) {
    const updated = dataUpdate.data.updated as Gpu;
    await this.update(dataUpdate.gpuId, updated, ctx);
  }

  async applySources(id: number, sources: ProductSourceGroup, ctx: Context) {
    const gpu = await this.getById(id, {}, ctx);

    // Extract URLs from new sources
    const techPowerUpUrl = sources.filter(
      (source) => source.sourceKey === GpuDataSourceKey.TechPowerUp,
    )[0]?.sourceUrl;
    const passMarkUrl = sources.filter(
      (source) => source.sourceKey === GpuDataSourceKey.VideocardBenchmarks,
    )[0]?.sourceUrl;
    const ulBenchmarksUrl = sources.filter(
      (source) => source.sourceKey === GpuDataSourceKey.UlBenchmarks,
    )[0]?.sourceUrl;

    // Extract data sources from existing cpu
    const techPowerUp = gpu.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp];
    const passMark =
      gpu.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks];
    const ulBenchmark = gpu.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks];

    // Merge - We don't want to delete sources, only overwrite them.
    gpu.meta = deepmerge(gpu.meta, {
      dataSources: {
        [GpuDataSourceKey.TechPowerUp]: {
          url: techPowerUpUrl || techPowerUp?.url,
        },
        [GpuDataSourceKey.VideocardBenchmarks]: {
          url: passMarkUrl || passMark?.url,
        },
        [GpuDataSourceKey.UlBenchmarks]: {
          url: ulBenchmarksUrl || ulBenchmark?.url,
        },
      },
    } as GpuMeta);

    await this.update(id, gpu, ctx);
  }

  async applyProductUpdate(
    update: GpuUpdate,
    options: ApplyProductUpdateOptions,
    ctx: Context,
  ) {
    if (update.productType !== ProductType.Gpu) {
      throw badRequestError({
        property: 'productType',
        constraint: ValidationErrorType.InvalidProductType,
      });
    }

    const updated = update.data.updated as Gpu;
    if (update.gpuId != null) {
      await this.update(update.cpuId, updated, ctx);
    } else {
      const cpu = {
        ...updated,
        slug: options.slug || updated.slug,
      };
      await this.create(cpu, ctx);
    }
  }
}
