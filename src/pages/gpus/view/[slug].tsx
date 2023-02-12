import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@client/gpus/pages';
import { gpuService } from '@server/gpus/gpu-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { Gpu, GpuSort, RelatedComparisons, RelatedGpus } from '@shared/gpus';

const TOTAL_COMPARED_GPUS = 10;

export const getServerSideProps = ssrPageProps<ViewGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;
    const gpu = await getGpu(slug, ctx);
    const contentData = await getContentData(gpu, ctx);
    const relatedGpus = await getRelatedGpus();
    const relatedComparisons = await getRelatedComparisons();

    return { gpu, contentData, relatedGpus, relatedComparisons };
  },
);

async function getGpu(slug: string, ctx: Context): Promise<Gpu> {
  const gpu = gpuService.getBySlug(
    slug,
    { includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(gpu);
}

async function getContentData(gpu: Gpu, ctx: Context) {
  const totalRatedGpus = await getTotalRatedGpus(ctx);

  const relativePerformanceGpus = await getPerformanceGpus(gpu, ctx);
  const relativeValueGpus = await getValueGpus(gpu, ctx);

  return {
    totalPerformanceRatedGpus: totalRatedGpus,
    relativePerformanceGpus,
    relativeValueGpus,
  } as ViewPageContentData;
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

async function getPerformanceGpus(seed: Gpu, ctx: Context) {
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
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_GPUS),
  );
}

async function getValueGpus(seed: Gpu, ctx: Context) {
  const results = await serialize(
    gpuService.list(
      {
        query: {
          filter: { valueRated: true },
          orderBy: { sort: GpuSort.ValueRating },
        },
        includeRanks: true,
      },
      ctx,
    ),
  );

  return serialize(
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_GPUS),
  );
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus() {
  return { gpus: [] } as RelatedGpus;
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedComparisons() {
  return { comparisons: [] } as RelatedComparisons;
}

export default ViewGpuPage;
