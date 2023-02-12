import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import {
  CreateGpuRequest,
  FindGpuComparisonRequest,
  Gpu,
  GpuComparison,
  RelatedGpus,
  RelatedGpusRequest,
  UpdateGpuRequest,
} from '@shared/gpus';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { GpuSpecsEntity } from './gpu-entity';
import { mapToGpuDto, mapToGpuDtos, mapToGpuEntity } from './gpu-mappers';
import { FindOptions, gpuRepository, ListOptions } from './gpu-repository';

export class GpuService {
  async count(options: ListOptions, ctx: Context) {
    const gpuEntities = await gpuRepository.list(options, ctx);
    return gpuEntities.length;
  }

  async list(options: ListOptions, ctx: Context) {
    const gpuEntities = await gpuRepository.list(options, ctx);

    const gpus: Gpu[] = mapToGpuDtos(gpuEntities);

    if (options.includeRanks) {
      await this.populateRanks(gpus, ctx);
    }

    return gpus;
  }

  async getById(id: number, options: FindOptions, ctx: Context) {
    const gpuEntity = await gpuRepository.findById(id, options, ctx);
    const gpu = mapToGpuDto(gpuEntity);

    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }
    if (options.includeRanks) {
      await this.populateRanks([gpu], ctx);
    }

    return gpu;
  }

  async getBySlug(slug: string, options: FindOptions, ctx: Context) {
    const gpuEntity = await gpuRepository.findBySlug(slug, options, ctx);
    const gpu = mapToGpuDto(gpuEntity);

    if (gpu == null) {
      throw notFoundError({ gpu: slug });
    }
    if (options.includeRanks) {
      await this.populateRanks([gpu], ctx);
    }

    return gpu;
  }

  async getComparison(options: FindGpuComparisonRequest, ctx: Context) {
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

    return gpus;
  }

  async getRelatedGpus(options: RelatedGpusRequest, ctx: Context) {
    const { seed, prioritize } = options;
    const limit = options.limit ?? 3;

    const gpus = await this.list(
      { query: { orderBy: { sort: prioritize } } },
      ctx,
    );

    let seedIndex = 0;
    if (seed != null && 'id' in seed) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed.id);
    } else if (Array.isArray(seed)) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed[0].id);
    }

    const relatedGpus = new Map<number, Gpu>();
    const relatedComparisons = new Map<string, GpuComparison>();
    let prevGpu: Gpu = null;
    for (
      let i = 0;
      i < gpus.length &&
      (relatedGpus.size < limit || relatedComparisons.size < limit);
      ++i
    ) {
      prevGpu = gpus[seedIndex];

      seedIndex += (i + 1) * (i % 2 === 0 ? 1 : -1);
      seedIndex = Math.max(0, Math.min(seedIndex, gpus.length - 1));

      const gpu = gpus[seedIndex];
      relatedGpus.set(gpu.id, gpu);

      if (prevGpu.id !== gpu.id) {
        const comparison = [prevGpu, gpu].sort(
          (gpu1, gpu2) => gpu1.id - gpu2.id,
        ) as GpuComparison;

        relatedComparisons.set(
          comparison.map((value) => value.id).join(','),
          comparison,
        );
      }
    }

    return {
      comparisons: [...relatedComparisons.values()].slice(0, limit),
      gpus: [...relatedGpus.values()].slice(0, limit),
    } as RelatedGpus;
  }

  async create(data: CreateGpuRequest, ctx: Context) {
    // Check if another part exists at the slug
    const existingGpu = await gpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingGpu != null) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    addPerformanceBenchmarks(data.specs, data.benchmarks);

    const entity = mapToGpuEntity({ id: undefined, ...data });
    const result = await gpuRepository.create(entity, ctx);
    return mapToGpuDto(result);
  }

  async update(id: number, data: UpdateGpuRequest, ctx: Context) {
    // Check if another gpu exists at the slug
    const existingGpu = await gpuRepository.findBySlug(data.slug, {}, ctx);
    if (existingGpu != null && existingGpu.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    const gpu = await gpuRepository.findById(id, {}, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    addPerformanceBenchmarks(data.specs, data.benchmarks);

    const entity = mapToGpuEntity({ id: undefined, ...data });
    const result = await gpuRepository.update(id, entity, ctx);
    return mapToGpuDto(result);
  }

  async delete(id: number, ctx: Context) {
    const gpu = await gpuRepository.findById(id, {}, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    await gpuRepository.delete(id, ctx);
    return id;
  }

  async autocomplete(query: string, ctx: Context) {
    const results = await gpuRepository.findSimilarValue(query, ctx);
    return mapToGpuDtos(results);
  }

  async autocompleteSpec(
    key: keyof GpuSpecsEntity,
    query: string,
    ctx: Context,
  ) {
    return await gpuRepository.findSimilarSpecValue(key, query, ctx);
  }

  private async populateRanks(gpus: Gpu[], ctx: Context) {
    if (gpus.length === 0) {
      return;
    }

    const ids = gpus.map((gpu) => gpu.id);
    const performanceRanks = await gpuRepository.getPerformanceRanks(ids, ctx);
    const valueRanks = await gpuRepository.getValueRanks(ids, ctx);

    gpus.forEach((gpu, i) => {
      gpu.ranks = {
        ...gpu.ranks,
        performanceRank: performanceRanks[i],
        valueRank: valueRanks[i],
      };
    });
  }
}

export const gpuService = new GpuService();
