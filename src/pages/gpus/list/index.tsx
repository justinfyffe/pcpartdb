import {
  LIST_PRESETS,
  ListGpusPage,
  ListGpusPageProps,
  ListPresetSlug,
} from '@client/product/pages';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { ProductsQuery, ProductType } from '@shared/product';
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
  } as ProductsQuery;
}

async function getGpusForQuery(query: ProductsQuery, ctx: Context) {
  return await getGpus(query, ctx);
}

async function getGpus(query: ProductsQuery, ctx: Context) {
  const gpus = await productService.list(
    { type: ProductType.GPU, query, includeRanks: true },
    ctx,
  );

  return serialize(gpus);
}

async function getTotalGpus(ctx: Context) {
  return await productService.count({ type: ProductType.GPU }, ctx);
}

export default ListGpusPage;
