import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@client/part/pages';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { Part, PartSort, PartType } from '@shared/part';

const TOTAL_COMPARED_PARTS = 10;

export const getServerSideProps = ssrPageProps<ViewGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;
    const gpu = await getGpu(slug, ctx);
    const contentData = await getContentData(gpu, ctx);
    const relatedParts = await getRelatedGpus(gpu, ctx);

    return { gpu, contentData, relatedParts };
  },
);

async function getGpu(slug: string, ctx: Context): Promise<Part> {
  const part = partService.get(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(part);
}

async function getContentData(gpu: Part, ctx: Context) {
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

async function getPerformanceGpus(seed: Part, ctx: Context) {
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

  return serialize(
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_PARTS),
  );
}

async function getValueGpus(seed: Part, ctx: Context) {
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

  return serialize(
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_PARTS),
  );
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus(seed: Part, ctx: Context) {
  return await partService.getRelatedParts(
    {
      type: PartType.GPU,
      seed,
      prioritize: PartSort.ReleaseDate,
    },
    ctx,
  );
}

export default ViewGpuPage;
