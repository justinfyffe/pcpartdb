import {
  CompareGpuPage,
  CompareGpuPageProps,
} from '@client/part/pages/compare-gpus';
import { ComparePageContentData } from '@client/part/pages/compare-gpus/types';
import { partService } from '@server/part/part-service';
import { sortParts } from '@server/part/part-utils';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { Part, PartComparison, PartSort, PartType } from '@shared/part';

const TOTAL_COMPARED_PARTS = 10;

export const getServerSideProps = ssrPageProps<CompareGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;

    const comparison = await getComparison(slug, ctx);
    const contentData = await getContentData(comparison, ctx);
    const relatedParts = await getRelatedGpus(comparison, ctx);

    return { comparison, contentData, relatedParts };
  },
);

async function getComparison(
  slug: string,
  ctx: Context,
): Promise<PartComparison> {
  const comparison = partService.getComparison(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(comparison);
}

async function getContentData(comparison: PartComparison, ctx: Context) {
  const totalRatedGpus = await getTotalRatedGpus(ctx);

  return {
    totalPerformanceRatedGpus: totalRatedGpus,

    relativePerformanceGpus: await getPerformanceGpus(comparison, ctx),
    relativeValueGpus: await getValueGpus(comparison, ctx),
  } as ComparePageContentData;
}

async function getTotalRatedGpus(ctx: Context) {
  const results = await partService.list(
    {
      type: PartType.GPU,
      query: { filter: { performanceRated: true } },
    },
    ctx,
  );
  return results.length;
}

function getSurroundingGpus(gpus: Part[], seed: Part, total: number) {
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

function getSurroundingGpus2(
  gpus: Part[],
  seed: PartComparison,
  total: number,
) {
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

async function getPerformanceGpus(seed: PartComparison, ctx: Context) {
  const results = await partService.list(
    {
      type: PartType.GPU,
      query: {
        filter: { performanceRated: true },
        orderBy: { sort: PartSort.PerformanceRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  const sortedSeed = sortParts(seed, {
    sort: PartSort.PerformanceRating,
  }) as PartComparison;

  return serialize(
    await getSurroundingGpus2(results, sortedSeed, TOTAL_COMPARED_PARTS),
  );
}

async function getValueGpus(seed: PartComparison, ctx: Context) {
  const results = await partService.list(
    {
      type: PartType.GPU,
      query: {
        filter: { valueRated: true },
        orderBy: { sort: PartSort.ValueRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  const sortedSeed = sortParts(seed, {
    sort: PartSort.ValueRating,
  }) as PartComparison;

  return serialize(
    await getSurroundingGpus2(results, sortedSeed, TOTAL_COMPARED_PARTS),
  );
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus(seed: PartComparison, ctx: Context) {
  return await partService.getRelatedParts(
    {
      type: PartType.GPU,
      seed,
      prioritize: PartSort.ReleaseDate,
    },
    ctx,
  );
}

export default CompareGpuPage;
