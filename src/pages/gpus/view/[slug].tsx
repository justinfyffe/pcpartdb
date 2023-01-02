import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@client/product/pages';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { Product, ProductsSort, ProductType } from '@shared/product';

const TOTAL_COMPARED_PRODUCTS = 10;

export const getServerSideProps = ssrPageProps<ViewGpuPageProps>(
  async (ctx: SsrContext) => {
    const slug = ctx.page.query.slug as string;
    const gpu = await getGpu(slug, ctx);
    const contentData = await getContentData(gpu, ctx);
    const relatedProducts = await getRelatedGpus(gpu, ctx);

    return { gpu, contentData, relatedProducts };
  },
);

async function getGpu(slug: string, ctx: Context): Promise<Product> {
  const product = productService.get(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(product);
}

async function getContentData(gpu: Product, ctx: Context) {
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

async function getPerformanceGpus(seed: Product, ctx: Context) {
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

  return serialize(
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_PRODUCTS),
  );
}

async function getValueGpus(seed: Product, ctx: Context) {
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

  return serialize(
    await getSurroundingGpus(results, seed, TOTAL_COMPARED_PRODUCTS),
  );
}

// TODO: determine this based on gpus fetched for content tables
async function getRelatedGpus(seed: Product, ctx: Context) {
  return await productService.getRelatedProducts(
    {
      type: ProductType.GPU,
      seed,
      prioritize: ProductsSort.ReleaseDate,
    },
    ctx,
  );
}

export default ViewGpuPage;
