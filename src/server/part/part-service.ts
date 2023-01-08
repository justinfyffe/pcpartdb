import { notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import {
  FindComparisonRequest,
  Part,
  PartComparison,
  PartRequest,
  PartType,
  RelatedParts,
  RelatedPartsRequest,
} from '@shared/part';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { FindOptions, ListOptions, partRepository } from './part-repository';

export class PartService {
  async count(options: ListOptions, ctx: Context) {
    const parts = await partRepository.list(options, ctx);
    return parts.length;
  }

  async list(options: ListOptions, ctx: Context) {
    return await partRepository.list(options, ctx);
  }

  async get(options: FindOptions, ctx: Context) {
    const part = await partRepository.find(options, ctx);

    if (part == null) {
      throw notFoundError(null);
    }

    return part;
  }

  async getComparison(options: FindComparisonRequest, ctx: Context) {
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
    const parts = await Promise.all(promises);
    const filteredParts = parts.filter((part) => part != null);

    if (filteredParts.length !== slugs.length) {
      throw notFoundError(null);
    }

    return parts;
  }

  async getRelatedParts(options: RelatedPartsRequest, ctx: Context) {
    const { type, seed, prioritize } = options;
    const limit = options.limit ?? 3;

    const gpus = await this.list(
      { type, query: { orderBy: { sort: prioritize } } },
      ctx,
    );

    let seedIndex = 0;
    if (seed != null && 'id' in seed) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed.id);
    } else if (Array.isArray(seed)) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed[0].id);
    }

    const relatedGpus = new Map<number, Part>();
    const relatedComparisons = new Map<string, PartComparison>();
    let prevPart: Part = null;
    for (
      let i = 0;
      i < gpus.length &&
      (relatedGpus.size < limit || relatedComparisons.size < limit);
      ++i
    ) {
      prevPart = gpus[seedIndex].serialize();

      seedIndex += (i + 1) * (i % 2 === 0 ? 1 : -1);
      seedIndex = Math.max(0, Math.min(seedIndex, gpus.length - 1));

      const gpu = gpus[seedIndex].serialize();
      relatedGpus.set(gpu.id, gpu);

      if (prevPart.id !== gpu.id) {
        const comparison = [prevPart, gpu].sort(
          (gpu1, gpu2) => gpu1.id - gpu2.id,
        ) as PartComparison;

        relatedComparisons.set(
          comparison.map((value) => value.id).join(','),
          comparison,
        );
      }
    }

    return {
      comparisons: [...relatedComparisons.values()].slice(0, limit),
      gpus: [...relatedGpus.values()].slice(0, limit),
    } as RelatedParts;
  }

  // TODO: check slug uniqueness
  async create(data: PartRequest, ctx: Context) {
    addPerformanceBenchmarks(data);

    return await partRepository.save(data, ctx);
  }

  // TODO: check slug uniqueness
  async update(id: number, data: PartRequest, ctx: Context) {
    addPerformanceBenchmarks(data);

    const part = await partRepository.find({ id }, ctx);
    if (part == null) {
      throw notFoundError({ part: id });
    }

    return await partRepository.save({ ...data, id }, ctx);
  }

  async delete(id: number, ctx: Context) {
    const part = await partRepository.find({ id }, ctx);
    if (part == null) {
      throw notFoundError({ part: id });
    }

    await partRepository.delete(id, ctx);
    return id;
  }

  async autocomplete(type: PartType, query: string, ctx: Context) {
    return await partRepository.findSimilarValue(type, query, ctx);
  }

  async autocompleteSpec(key: keyof Specs, query: string, ctx: Context) {
    return await partRepository.findSimilarSpecValue(key, query, ctx);
  }

  async autocompleteMeta(key: keyof PartMetas, query: string, ctx: Context) {
    return await partRepository.findSimilarMetaValue(key, query, ctx);
  }
}

export const partService = new PartService();
