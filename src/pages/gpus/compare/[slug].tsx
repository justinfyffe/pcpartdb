import {
  CompareGpuPage,
  CompareGpuPageProps,
} from '@client/product/pages/compare-gpus';
import { ComparePageContentData } from '@client/product/pages/compare-gpus/types';
import { productService } from '@server/product/product-service';
import { sortProducts } from '@server/product/product-utils';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import {
  Product,
  ProductComparison,
  ProductsSort,
  ProductType,
} from '@shared/product';

const TOTAL_COMPARED_PRODUCTS = 10;

export const getServerSideProps = ssrPageProps<CompareGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;

    const comparison = await getComparison(slug, ctx);
    const contentData = await getContentData(comparison, ctx);
    const relatedProducts = await getRelatedGpus(comparison, ctx);

    return { comparison, contentData, relatedProducts };
  },
);

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

function getSurroundingGpus(gpus: Product[], seed: Product, total: number) {
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

function getSurroundingGpus2(
  gpus: Product[],
  seed: ProductComparison,
  total: number,
) {
  const seedIndex1 = gpus.findIndex((gpu) => gpu.id === seed[0].id);
  const seedIndex2 = gpus.findIndex((gpu) => gpu.id === seed[1].id);

  if (Math.abs(seedIndex2 - seedIndex1) > total) {
    return [
      ...getSurroundingGpus(gpus, seed[0], Math.floor(total / 2)),
      ...getSurroundingGpus(gpus, seed[1], Math.floor(total / 2)),
    ];
  } else {
    const seedIndex = Math.floor((seedIndex1 + seedIndex2) / 2);
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
}

async function getPerformanceGpus(seed: ProductComparison, ctx: Context) {
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

  const sortedSeed = sortProducts(seed, {
    sort: ProductsSort.PerformanceRating,
  }) as ProductComparison;

  return serialize(
    await getSurroundingGpus2(results, sortedSeed, TOTAL_COMPARED_PRODUCTS),
  );
}

async function getValueGpus(seed: ProductComparison, ctx: Context) {
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

  const sortedSeed = sortProducts(seed, {
    sort: ProductsSort.ValueRating,
  }) as ProductComparison;

  return serialize(
    await getSurroundingGpus2(results, sortedSeed, TOTAL_COMPARED_PRODUCTS),
  );
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
