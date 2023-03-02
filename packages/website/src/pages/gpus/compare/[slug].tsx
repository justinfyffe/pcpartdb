import { GpuSort } from '@pcpartdb/database';
import {
  CompareGpuPage,
  CompareGpuPageProps,
} from '@pcpartdb/website/client/gpus/pages/compare-gpus';
import { ComparePageContentData } from '@pcpartdb/website/client/gpus/pages/compare-gpus/types';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { ssrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import {
  Gpu,
  GpuComparison,
  RelatedComparisons,
  RelatedGpus,
} from '@pcpartdb/website/shared/gpus';

const TOTAL_COMPARED_GPUS = 10;

export const getServerSideProps = ssrPageProps<CompareGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;

    const comparison = await getComparison(slug, ctx);
    const contentData = await getContentData(comparison, ctx);

    const relatedGpus = await getRelatedGpus(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      comparison,
    );
    const relatedComparisons = await getRelatedComparisons(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      comparison,
    );

    return { comparison, contentData, relatedGpus, relatedComparisons };
  },
);

async function getComparison(
  slug: string,
  ctx: Context,
): Promise<GpuComparison> {
  return await gpuService.getComparison(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );
}

async function getContentData(comparison: GpuComparison, ctx: Context) {
  const totalRatedGpus = await getTotalRatedGpus(ctx);

  return {
    totalPerformanceRatedGpus: totalRatedGpus,

    relativePerformanceGpus: await getPerformanceGpus(comparison, ctx),
    relativeValueGpus: await getValueGpus(comparison, ctx),
  } as ComparePageContentData;
}

async function getTotalRatedGpus(ctx: Context) {
  const results = await gpuService.list(
    {
      query: { filter: { performanceRated: true } },
    },
    ctx,
  );
  return results.length;
}

function getSurroundingGpus(gpus: Gpu[], seed: Gpu, total: number) {
  const seedIndex = gpus.findIndex((gpu) => gpu.id === seed.id);
  let start = seedIndex;
  let end = seedIndex + 1;
  let counter = 0;
  while (end - start < total && (start > 0 || end < gpus.length)) {
    if (counter++ % 2 === 0) {
      if (start > 0) {
        --start;
      }
    } else {
      if (end < gpus.length) {
        ++end;
      }
    }
  }

  return gpus.slice(start, end);
}

function getSurroundingGpus2(gpus: Gpu[], seed: GpuComparison, total: number) {
  const seedIndex1 = gpus.findIndex((gpu) => gpu.id === seed[0].id);
  const seedIndex2 = gpus.findIndex((gpu) => gpu.id === seed[1].id);

  if (Math.abs(seedIndex2 - seedIndex1) > total) {
    const seeds =
      seedIndex1 < seedIndex2 ? [seed[0], seed[1]] : [seed[1], seed[0]];
    return [
      ...getSurroundingGpus(gpus, seeds[0], Math.floor(total / 2)),
      ...getSurroundingGpus(gpus, seeds[1], Math.floor(total / 2)),
    ];
  } else {
    const seedIndex = Math.floor((seedIndex1 + seedIndex2) / 2);
    let start = seedIndex;
    let end = seedIndex + 1;
    let counter = 0;
    while (end - start < total && (start > 0 || end < gpus.length)) {
      if (counter++ % 2 === 0) {
        if (start > 0) {
          --start;
        }
      } else {
        if (end < gpus.length) {
          ++end;
        }
      }
    }

    return gpus.slice(start, end);
  }
}

// TODO: clean up this logic
async function getPerformanceGpus(seed: GpuComparison, ctx: Context) {
  const results = await gpuService.list(
    {
      query: {
        filter: { performanceRated: true },
        orderBy: { sort: GpuSort.PerformanceRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  return await getSurroundingGpus2(results, seed, TOTAL_COMPARED_GPUS);
}

// TODO: clean up this logic
async function getValueGpus(seed: GpuComparison, ctx: Context) {
  const results = await gpuService.list(
    {
      query: {
        filter: { valueRated: true },
        orderBy: { sort: GpuSort.ValueRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  return await getSurroundingGpus2(results, seed, TOTAL_COMPARED_GPUS);
}

async function getRelatedGpus(
  total: number,
  performanceGpus: Gpu[],
  valueGpus: Gpu[],
  excludeGpus: Gpu[],
) {
  const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
    acc[gpu.id] = gpu;
    return acc;
  }, {} as Record<number, Gpu>);

  const performanceIds = performanceGpus.map((gpu) => gpu.id);
  const valueIds = valueGpus.map((gpu) => gpu.id);

  const set = new Set([...performanceIds, ...valueIds]);
  excludeGpus.forEach((gpu) => set.delete(gpu.id));

  const related: Gpu[] = [];
  for (let i = 0; i < total && set.size > 0; ++i) {
    const randIdx = Math.floor(Math.random() * set.size);
    const id = [...set.values()][randIdx];
    set.delete(id);

    related.push(map[id]);
  }

  return { gpus: related } as RelatedGpus;
}

async function getRelatedComparisons(
  total: number,
  performanceGpus: Gpu[],
  valueGpus: Gpu[],
  pageComparison: GpuComparison,
) {
  const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
    acc[gpu.id] = gpu;
    return acc;
  }, {} as Record<number, Gpu>);

  const performanceIds = performanceGpus.map((gpu) => gpu.id);
  const valueIds = valueGpus.map((gpu) => gpu.id);

  const set = new Set([...performanceIds, ...valueIds]);
  pageComparison.forEach((gpu) => set.delete(gpu.id));

  const related: Gpu[] = [];
  for (let i = 0; i < total && set.size > 0; ++i) {
    const randIdx = Math.floor(Math.random() * set.size);
    const id = [...set.values()][randIdx];
    set.delete(id);

    related.push(map[id]);
  }

  const comparisons = related.map((relatedGpu, i) => [
    pageComparison[i % 2],
    relatedGpu,
  ]);

  return { comparisons } as RelatedComparisons;
}

export default CompareGpuPage;
