import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import {
  CreateGpuRequest,
  FindGpuComparisonRequest,
  Gpu,
  GpuComparison,
  GpuSpecKey,
  RelatedGpus,
  RelatedGpusRequest,
  UpdateGpuRequest,
} from '@shared/gpus';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { FindOptions, gpuRepository, ListOptions } from './gpu-repository';

export class GpuService {
  async count(options: ListOptions, ctx: Context) {
    const gpus = await gpuRepository.list(options, ctx);
    return gpus.length;
  }

  async list(options: ListOptions, ctx: Context) {
    const gpuModels = await gpuRepository.list(options, ctx);
    const gpus: Gpu[] = serialize(gpuModels);

    if (options.includeRanks) {
      await this.populateRanks(gpus, ctx);
    }

    return gpus;
  }

  async get(options: FindOptions, ctx: Context) {
    const gpuModel = await gpuRepository.find(options, ctx);
    const gpu: Gpu = serialize(gpuModel);

    if (gpu == null) {
      throw notFoundError(null);
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
      throw notFoundError(null);
    } else if (slugs[0] === slugs[1]) {
      throw notFoundError(null);
    }

    const promises = [];
    for (const slugItem of slugs) {
      promises.push(
        this.get({ slug: slugItem, includeImages, includeRanks }, ctx),
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
    const existingGpu = await gpuRepository.find({ slug: data.slug }, ctx);
    if (existingGpu != null) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    addPerformanceBenchmarks(data.specs, data.benchmarks);

    return await gpuRepository.create(data, ctx);
  }

  async update(id: number, data: UpdateGpuRequest, ctx: Context) {
    // Check if another gpu exists at the slug
    const existingGpu = await gpuRepository.find({ slug: data.slug }, ctx);
    if (existingGpu != null && existingGpu.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: 'EXISTING_GPU_AT_SLUG',
      });
    }

    const gpu = await gpuRepository.find({ id }, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    addPerformanceBenchmarks(data.specs, data.benchmarks);

    return await gpuRepository.update(id, data, ctx);
  }

  async delete(id: number, ctx: Context) {
    const gpu = await gpuRepository.find({ id }, ctx);
    if (gpu == null) {
      throw notFoundError({ gpu: id });
    }

    await gpuRepository.delete(id, ctx);
    return id;
  }

  async autocomplete(query: string, ctx: Context) {
    return await gpuRepository.findSimilarValue(query, ctx);
  }

  async autocompleteSpec(key: GpuSpecKey, query: string, ctx: Context) {
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
