import { GpuSort } from '@pcpartdb/database';
import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@pcpartdb/website/client/gpus/pages';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { ssrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import {
  Gpu,
  RelatedComparisons,
  RelatedGpus,
} from '@pcpartdb/website/shared/gpus';

const TOTAL_COMPARED_GPUS = 10;

export const getServerSideProps = ssrPageProps<ViewGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;
    const gpu = await getGpu(slug, ctx);
    const contentData = await getContentData(gpu, ctx);

    const relatedGpus = await getRelatedGpus(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      gpu,
    );
    const relatedComparisons = await getRelatedComparisons(
      3,
      contentData.relativePerformanceGpus,
      contentData.relativeValueGpus,
      gpu,
    );

    return { gpu, contentData, relatedGpus, relatedComparisons };
  },
);

async function getGpu(slug: string, ctx: Context): Promise<Gpu> {
  return await gpuService.getBySlug(
    slug,
    { includeImages: true, includeRanks: true },
    ctx,
  );
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

  return await getSurroundingGpus(results, seed, TOTAL_COMPARED_GPUS);
}

async function getValueGpus(seed: Gpu, ctx: Context) {
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

  return await getSurroundingGpus(results, seed, TOTAL_COMPARED_GPUS);
}

async function getRelatedGpus(
  total: number,
  performanceGpus: Gpu[],
  valueGpus: Gpu[],
  excludeGpu: Gpu,
) {
  const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
    acc[gpu.id] = gpu;
    return acc;
  }, {} as Record<number, Gpu>);

  const performanceIds = performanceGpus.map((gpu) => gpu.id);
  const valueIds = valueGpus.map((gpu) => gpu.id);

  const set = new Set([...performanceIds, ...valueIds]);
  set.delete(excludeGpu.id);

  const related: Gpu[] = [];
  for (let i = 0; i < total && set.size > 0; ++i) {
    const randIdx = Math.floor(Math.random() * set.size);
    const id = [...set.values()][randIdx];
    set.delete(id);

    related.push(map[id]);
  }

  return { gpus: related } as RelatedGpus;
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedComparisons(
  total: number,
  performanceGpus: Gpu[],
  valueGpus: Gpu[],
  pageGpu: Gpu,
) {
  const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
    acc[gpu.id] = gpu;
    return acc;
  }, {} as Record<number, Gpu>);

  const performanceIds = performanceGpus.map((gpu) => gpu.id);
  const valueIds = valueGpus.map((gpu) => gpu.id);

  const set = new Set([...performanceIds, ...valueIds]);
  set.delete(pageGpu.id);

  const related: Gpu[] = [];
  for (let i = 0; i < total && set.size > 0; ++i) {
    const randIdx = Math.floor(Math.random() * set.size);
    const id = [...set.values()][randIdx];
    set.delete(id);

    related.push(map[id]);
  }

  const comparisons = related.map((relatedGpu) => [pageGpu, relatedGpu]);

  return { comparisons } as RelatedComparisons;
}
export default ViewGpuPage;
