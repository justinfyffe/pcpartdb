import {
  LIST_PRESETS,
  ListGpusPage,
  ListGpusPageProps,
  ListPresetSlug,
} from '@client/part/pages';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { PartsQuery, PartType } from '@shared/part';
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

  return {
    filter: { company },
    orderBy: { sort, order },
  } as PartsQuery;
}

async function getGpusForQuery(query: PartsQuery, ctx: Context) {
  return await getGpus(query, ctx);
}

async function getGpus(query: PartsQuery, ctx: Context) {
  const gpus = await partService.list(
    { type: PartType.GPU, query, includeRanks: true },
    ctx,
  );

  return serialize(gpus);
}

async function getTotalGpus(ctx: Context) {
  return await partService.count({ type: PartType.GPU }, ctx);
}

export default ListGpusPage;
