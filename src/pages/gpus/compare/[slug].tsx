import { CompareGpuPage, CompareGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { ProductComparison, ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

const TOTAL_COMPARED_PRODUCTS = 10;

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const ctx = { trx };
    const slug = nextCtx.query.slug as string;

    const comparison = await getComparison(slug, ctx);
    const contentData = await getContentData(comparison, ctx);
    const relatedProducts = getRelatedGpus(comparison, ctx);

    const pageProps: CompareGpuPageProps = {
      comparison: JSON.parse(JSON.stringify(comparison)),
      contentData: JSON.parse(JSON.stringify(contentData)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

async function getComparison(
  slug: string,
  ctx: Context,
): Promise<ProductComparison> {
  const comparison = productService.getComparison(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(comparison);
}

async function getContentData(comparison: ProductComparison, ctx: Context) {
  return {};
}

async function getPerformanceGpus(seed: ProductComparison, ctx: Context) {
  const [seedGpu1, seedGpu2] = seed;

  const results = await productService.list(
    {
      type: ProductType.GPU,
      filter: { performanceRated: true },
      sort: ProductsSort.PerformanceRating,
    },
    ctx,
  );

  const seedIndex1 = results.findIndex((gpu) => gpu.id === seedGpu1.id);
  const seedIndex2 = results.findIndex((gpu) => gpu.id === seedGpu2.id);
  const sizePerProduct = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
}

async function getValueGpus(seed: ProductComparison, ctx: Context) {
  const [seedGpu1, seedGpu2] = seed;

  const results = await productService.list(
    {
      type: ProductType.GPU,
      filter: { valueRated: true },
      sort: ProductsSort.ValueRating,
    },
    ctx,
  );

  const seedIndex1 = results.findIndex((gpu) => gpu.id === seedGpu1.id);
  const seedIndex2 = results.findIndex((gpu) => gpu.id === seedGpu2.id);
  const sizePerProduct = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus(seed: ProductComparison, ctx: Context) {
  return await productService.getRelatedProducts(
    {
      type: ProductType.GPU,
      seed,
      prioritize: ProductsSort.ReleaseDate,
    },
    ctx,
  );
}

export default CompareGpuPage;
