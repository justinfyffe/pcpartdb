import {
  LIST_PRESETS,
  ListGpusPage,
  ListGpusPageProps,
  ListPreset,
} from '@client/product/pages';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { ProductsQuery, ProductType } from '@shared/product';
import { NextPageContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const ctx: Context = { trx };
    const query = getQuery(nextCtx.query);

    const gpus = await getGpusForQuery(query, ctx);
    const totalGpus = await getTotalGpus(ctx);

    const pageProps = {
      query: JSON.parse(JSON.stringify(query)),
      gpus: JSON.parse(JSON.stringify(gpus)),
      totalGpus,
    } as ListGpusPageProps;

    return { props: pageProps };
  });
}

function getQuery(query: ParsedUrlQuery) {
  const company = (query.company as string)?.split(',');
  const sort = query.sort as string;
  const order = query.order as string;
  const preset = query.preset as ListPreset;

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
