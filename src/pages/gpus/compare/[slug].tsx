import {
  CompareGpuPage,
  CompareGpuPageProps,
} from '@client/product/pages/compare-gpus';
import { ComparePageContentData } from '@client/product/pages/compare-gpus/types';
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
    const relatedProducts = await getRelatedGpus(comparison, ctx);

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
  const totalRatedGpus = await getTotalRatedGpus(ctx);

  return {
    totalPerformanceRatedGpus: totalRatedGpus,

    relativePerformanceGpus: await getPerformanceGpus(comparison, ctx),
    relativeValueGpus: await getValueGpus(comparison, ctx),
  } as ComparePageContentData;
}

async function getTotalRatedGpus(ctx: Context) {
  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: { filter: { performanceRated: true } },
    },
    ctx,
  );
  return results.length;
}

async function getPerformanceGpus(seed: ProductComparison, ctx: Context) {
  const [seedGpu1, seedGpu2] = seed;

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: { performanceRated: true },
        orderBy: { sort: ProductsSort.PerformanceRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  const sizePerProduct = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  const seedIndex1 = results.findIndex((gpu) => gpu.id === seedGpu1.id);
  const seedIndex2 = results.findIndex((gpu) => gpu.id === seedGpu2.id);

  if (Math.abs(seedIndex2 - seedIndex1) < sizePerProduct) {
    // Within same group
    const midIndex = Math.floor((seedIndex2 + seedIndex1) / 2);
    let start = Math.max(0, midIndex - sizePerProduct);
    let end = Math.min(midIndex + sizePerProduct, results.length);
    if (end - start !== TOTAL_COMPARED_PRODUCTS) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
      start = Math.max(0, start - diff);
      end = Math.min(end + diff, results.length);
    }

    return serialize(results.slice(start, end));
  } else {
    // Split groups
    const sizePerSide = Math.floor(sizePerProduct / 2);
    let start1 = Math.max(0, seedIndex1 - sizePerSide);
    let end1 = Math.min(seedIndex1 + sizePerSide, results.length);
    if (end1 - start1 !== sizePerSide) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end1 - start1);
      start1 = Math.max(0, start1 - diff);
      end1 = Math.min(end1 + diff, results.length);
    }

    let start2 = Math.max(0, seedIndex2 - sizePerSide);
    let end2 = Math.min(seedIndex2 + sizePerSide, results.length);
    if (end2 - start2 !== sizePerSide) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end1 - start2);
      start2 = Math.max(0, start2 - diff);
      end2 = Math.min(end2 + diff, results.length);
    }

    const products1 = results.slice(start1, end1);
    const products2 = results.slice(start2, end2);

    if (start1 < start2) {
      return serialize([...products1, ...products2]);
    } else {
      return serialize([...products2, ...products1]);
    }
  }
}

async function getValueGpus(seed: ProductComparison, ctx: Context) {
  const [seedGpu1, seedGpu2] = seed;

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: { valueRated: true },
        orderBy: { sort: ProductsSort.ValueRating },
      },
      includeRanks: true,
    },
    ctx,
  );

  const sizePerProduct = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  const seedIndex1 = results.findIndex((gpu) => gpu.id === seedGpu1.id);
  const seedIndex2 = results.findIndex((gpu) => gpu.id === seedGpu2.id);

  if (Math.abs(seedIndex2 - seedIndex1) < sizePerProduct) {
    // Within same group
    const midIndex = Math.floor((seedIndex2 + seedIndex1) / 2);
    let start = Math.max(0, midIndex - sizePerProduct);
    let end = Math.min(midIndex + sizePerProduct, results.length);
    if (end - start !== TOTAL_COMPARED_PRODUCTS) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
      start = Math.max(0, start - diff);
      end = Math.min(end + diff, results.length);
    }

    return serialize(results.slice(start, end));
  } else {
    // Split groups
    const sizePerSide = Math.floor(sizePerProduct / 2);
    let start1 = Math.max(0, seedIndex1 - sizePerSide);
    let end1 = Math.min(seedIndex1 + sizePerSide, results.length);
    if (end1 - start1 !== sizePerSide) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end1 - start1);
      start1 = Math.max(0, start1 - diff);
      end1 = Math.min(end1 + diff, results.length);
    }

    let start2 = Math.max(0, seedIndex2 - sizePerSide);
    let end2 = Math.min(seedIndex2 + sizePerSide, results.length);
    if (end2 - start2 !== sizePerSide) {
      const diff = TOTAL_COMPARED_PRODUCTS - (end1 - start2);
      start2 = Math.max(0, start2 - diff);
      end2 = Math.min(end2 + diff, results.length);
    }

    const products1 = results.slice(start1, end1);
    const products2 = results.slice(start2, end2);

    if (start1 < start2) {
      return serialize([...products1, ...products2]);
    } else {
      return serialize([...products2, ...products1]);
    }
  }
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
