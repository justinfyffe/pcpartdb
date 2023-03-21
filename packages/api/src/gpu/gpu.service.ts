import { Injectable } from '@nestjs/common';
import {
  CreateGpuRequest,
  Gpu,
  GpuComparison,
  GpuFieldKey,
  GpusQuery,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { GpuSpecsEntity } from './gpu.entity';
import { mapToGpuDto, mapToGpuDtos, mapToGpuEntity } from './gpu.mapper';
import { GpuRepository } from './gpu.repository';

interface CountOptions {
  query?: GpusQuery;

  includeImages?: boolean;
  includeRanks?: boolean;
}

interface ListOptions {
  query?: GpusQuery;

  fields?: GpuFieldKey[];
  includeImages?: boolean;
  includeRanks?: boolean;
}

interface GetOptions {
  includeImages?: boolean;
  includeRanks?: boolean;
}

interface GetComparisonOptions {
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

@Injectable()
export class GpuService {
  constructor(private gpuRepository: GpuRepository) {}

  async count(options: CountOptions, ctx: Context) {
    const gpuEntities = await this.gpuRepository.count(options, ctx);
    return gpuEntities.length;
  }

  async list(options: ListOptions, ctx: Context) {
    const gpuEntities = await this.gpuRepository.list(options, ctx);

    const fields = options.fields != null ? new Set(options.fields) : null;
    const gpus: Gpu[] = mapToGpuDtos(gpuEntities, { fields });

    if (options.includeRanks) {
      await this.populateRanks(gpus, ctx);
    }

    return gpus;
  }

  async getById(id: number, options: GetOptions, ctx: Context) {
    const gpuEntity = await this.gpuRepository.findById(id, options, ctx);
    const gpu = mapToGpuDto(gpuEntity, { includeSources: ctx.user?.isStaff });

    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }
    if (options.includeRanks) {
      await this.populateRanks([gpu], ctx);
    }

    return gpu;
  }

  async getBySlug(slug: string, options: GetOptions, ctx: Context) {
    const gpuEntity = await this.gpuRepository.findBySlug(slug, options, ctx);
    const gpu = mapToGpuDto(gpuEntity, { includeSources: ctx.user?.isStaff });

    if (gpu == null) {
      throw notFoundError({ gpu: slug });
    }
    if (options.includeRanks) {
      await this.populateRanks([gpu], ctx);
    }

    return gpu;
  }

  async getComparison(options: GetComparisonOptions, ctx: Context) {
    const { slug, includeImages, includeRanks } = options;
    const slugs = slug.split('--vs--');

    if (slugs.length !== 2) {
      throw notFoundError({ comparison: slug });
    } else if (slugs[0] === slugs[1]) {
      throw notFoundError({ comparison: slug });
    }

    const promises = [];
    for (const slugItem of slugs) {
      promises.push(
        this.getBySlug(slugItem, { includeImages, includeRanks }, ctx),
      );
    }
    const gpus = await Promise.all(promises);
    const filteredGpus = gpus.filter((gpu) => gpu != null);

    if (filteredGpus.length !== slugs.length) {
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

    addPerformanceBenchmarks(data, data.benchmarks);

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

    addPerformanceBenchmarks(data, data.benchmarks);

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

  async autocomplete(query: string, ctx: Context) {
    const results = await this.gpuRepository.autocomplete(query, ctx);
    return mapToGpuDtos(results);
  }

  async autocompleteSpec(
    key: keyof GpuSpecsEntity,
    query: string,
    ctx: Context,
  ) {
    return await this.gpuRepository.autocompleteSpec(key, query, ctx);
  }

  async refreshRatings(ctx: Context) {
    const limit = 50;
    const totalGpus = await this.count({}, ctx);
    for (let i = 0; i < totalGpus; i += limit) {
      const gpus = await this.list({ query: { offset: i, limit } }, ctx);

      for (let j = 0; j < gpus.length; ++j) {
        const gpu = gpus[j];
        addPerformanceBenchmarks(gpu, gpu.benchmarks);
        await this.update(gpu.id, gpu, ctx);
      }
    }
  }

  private async populateRanks(gpus: Gpu[], ctx: Context) {
    if (gpus.length === 0) {
      return;
    }

    const ids = gpus.map((gpu) => gpu.id);
    const performanceRanks = await this.gpuRepository.getPerformanceRanks(
      ids,
      ctx,
    );
    const valueRanks = await this.gpuRepository.getValueRanks(ids, ctx);

    gpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks[i],
        valueRank: valueRanks[i],
      };
    });
  }
}
