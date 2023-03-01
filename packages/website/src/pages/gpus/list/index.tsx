import {
  LIST_PRESETS,
  ListGpusPage,
  ListGpusPageProps,
  ListPresetSlug,
} from '@pcpartdb/website/client/gpus/pages';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { gpusQueryValidator } from '@pcpartdb/website/server/gpus/gpu-validators';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { ssrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import { validate } from '@pcpartdb/website/server/shared/types/validate';
import { GpuSort, GpusQuery } from '@pcpartdb/website/shared/gpus';
import { ParsedUrlQuery } from 'querystring';

export const getServerSideProps = ssrPageProps<ListGpusPageProps>(
  async (ctx: SsrContext) => {
    const query = getQuery(ctx.page.query);

    const gpus = await getGpusForQuery(query, ctx);
    const totalGpus = await getTotalGpus(ctx);

    return { query, gpus, totalGpus };
  },
);

function getQuery(query: ParsedUrlQuery) {
  const company = (query.company as string)?.split(',');
  const sort = (query.sort as string) || GpuSort.PerformanceRating;
  const order = query.order as string;
  const preset = query.preset as ListPresetSlug;

  if (preset != null && LIST_PRESETS[preset] != null) {
    return LIST_PRESETS[preset];
  }

  const gpusQuery = {
    filter: { company },
    orderBy: { sort, order },
  } as GpusQuery;
  validate(gpusQuery, gpusQueryValidator);

  return gpusQuery as GpusQuery;
}

async function getGpusForQuery(query: GpusQuery, ctx: Context) {
  return await getGpus(query, ctx);
}

async function getGpus(query: GpusQuery, ctx: Context) {
  return await gpuService.list(
    { query, includeRanks: true, includeImages: false },
    ctx,
  );
}

async function getTotalGpus(ctx: Context) {
  return await gpuService.count({}, ctx);
}

export default ListGpusPage;
