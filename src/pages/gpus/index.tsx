import { ListGpusPage, ListGpusPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { ProductsQuery, ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export enum ListPreset {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_PRESETS: Record<ListPreset, ProductsQuery> = {
  [ListPreset.BestPerformance]: {
    filter: { performanceRated: true },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestPerformanceAmd]: {
    filter: { performanceRated: true, company: ['amd'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestPerformanceNvidia]: {
    filter: { performanceRated: true, company: ['nvidia'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestValue]: {
    filter: { valueRated: true },
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPreset.BestValueAmd]: {
    filter: { valueRated: true, company: ['amd'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPreset.BestValueNvidia]: {
    filter: { valueRated: true, company: ['nvidia'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
};

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const ctx: Context = { trx };
    const query = getQuery(nextCtx.query);

    const gpus = await getGpusForQuery(query, ctx);
    const totalGpus = await getTotalGpus(ctx);

    const relatedProducts = await productService.getRelatedProducts(
      { type: ProductType.GPU, prioritize: ProductsSort.ReleaseDate },
      ctx,
    );

    const pageProps = {
      query: JSON.parse(JSON.stringify(query)),
      gpus: JSON.parse(JSON.stringify(gpus)),
      totalGpus,

      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    } as ListGpusPageProps;

    return { props: pageProps };
  });
}

function getQuery(query: ParsedUrlQuery) {
  const company = (query.company as string)?.split(',');
  const sort = query.sort as string;
  const order = query.order as string;

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
