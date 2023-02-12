import {
  CompareGpuPage,
  CompareGpuPageProps,
} from '@client/gpus/pages/compare-gpus';
import { ComparePageContentData } from '@client/gpus/pages/compare-gpus/types';
import { gpuService } from '@server/gpus/gpu-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import {
  Gpu,
  GpuComparison,
  GpuSort,
  RelatedComparisons,
  RelatedGpus,
} from '@shared/gpus';

const TOTAL_COMPARED_GPUS = 10;

export const getServerSideProps = ssrPageProps<CompareGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;

    const comparison = await getComparison(slug, ctx);
    const contentData = await getContentData(comparison, ctx);
    const relatedGpus = await getRelatedGpus();
    const relatedComparisons = await getRelatedComparisons();

    return { comparison, contentData, relatedGpus, relatedComparisons };
  },
);

async function getComparison(
  slug: string,
  ctx: Context,
): Promise<GpuComparison> {
  const comparison = gpuService.getComparison(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(comparison);
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
    return [
      ...getSurroundingGpus(gpus, seed[0], Math.floor(total / 2)),
      ...getSurroundingGpus(gpus, seed[1], Math.floor(total / 2)),
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

async function getPerformanceGpus(seed: GpuComparison, ctx: Context) {
  const results = await serialize(
    gpuService.list(
      {
        query: {
          filter: { performanceRated: true },
          orderBy: { sort: GpuSort.PerformanceRating },
        },
        includeRanks: true,
      },
      ctx,
    ),
  );

  return serialize(
    await getSurroundingGpus2(results, seed, TOTAL_COMPARED_GPUS),
  );
}

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

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus() {
  return { gpus: [] } as RelatedGpus;
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedComparisons() {
  return { comparisons: [] } as RelatedComparisons;
}

export default CompareGpuPage;
