import {
  LIST_PRESETS,
  ListGpusPage,
  ListGpusPageProps,
  ListPresetSlug,
} from '@client/gpus/pages';
import { gpuService } from '@server/gpus/gpu-service';
import { gpusQueryValidator } from '@server/gpus/gpu-validators';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { validate } from '@server/shared/types/validate';
import { GpusQuery } from '@shared/gpus';
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
  const sort = query.sort as string;
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
  const gpus = await gpuService.list(
    { query, includeRanks: true, includeImages: false },
    ctx,
  );

  return serialize(gpus);
}

async function getTotalGpus(ctx: Context) {
  return await gpuService.count({}, ctx);
}

export default ListGpusPage;
