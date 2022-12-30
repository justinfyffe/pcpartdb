import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@client/product/pages';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { Product, ProductsSort, ProductType } from '@shared/product';
import { formatSpec, SpecDateFormatter } from '@shared/spec';
import { NextPageContext } from 'next';

const TOTAL_COMPARED_PRODUCTS = 10;

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const ctx = { trx };

    const slug = nextCtx.query.slug as string;
    const gpu = await getGpu(slug, ctx);
    const contentData = await getContentData(gpu, ctx);
    const relatedProducts = await getRelatedGpus(gpu, ctx);

    const pageProps: ViewGpuPageProps = {
      gpu: JSON.parse(JSON.stringify(gpu)),
      contentData: JSON.parse(JSON.stringify(contentData)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

async function getGpu(slug: string, ctx: Context): Promise<Product> {
  const product = productService.get(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(product);
}

async function getContentData(gpu: Product, ctx: Context) {
  const totalRatedGpus = await getTotalRatedGpus(ctx);

  // TODO: how to handle when gpu is at the end of these lists?
  const {
    products: performanceArchitectureGpus,
    rank: performanceArchitectureRank,
  } = await getPerformanceArchitectureGpus(gpu, ctx);
  const { products: performanceYearGpus, rank: performanceYearRank } =
    await getPerformanceYearGpus(gpu, ctx);

  const { products: valueArchitectureGpus, rank: valueArchitectureRank } =
    await getValueArchitectureGpus(gpu, ctx);
  const { products: valueYearGpus, rank: valueYearRank } =
    await getValueYearGpus(gpu, ctx);

  return {
    totalPerformanceRatedGpus: totalRatedGpus,

    performanceYearGpus,
    performanceYearRank,
    performanceArchitectureGpus,
    performanceArchitectureRank,

    valueYearGpus,
    valueYearRank,
    valueArchitectureGpus,
    valueArchitectureRank,
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

async function getPerformanceArchitectureGpus(seed: Product, ctx: Context) {
  const company = formatSpec(seed.specs?.company);
  const architecture = formatSpec(seed.specs?.architecture);

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: {
          performanceRated: true,
          company: [company],
          architecture: [architecture],
        },
        orderBy: { sort: ProductsSort.PerformanceRating },
      },
    },
    ctx,
  );

  const seedIndex = results.findIndex((gpu) => gpu.id === seed.id);
  const sizePerSide = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  let start = Math.max(0, seedIndex - sizePerSide);
  let end = Math.min(seedIndex + sizePerSide, results.length);
  if (end - start !== TOTAL_COMPARED_PRODUCTS) {
    const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
    start = Math.max(0, start - diff);
    end = Math.min(end + diff, results.length);
  }
  const products: Product[] = serialize(results.slice(start, end));

  return { products, rank: seedIndex + 1 };
}

async function getPerformanceYearGpus(seed: Product, ctx: Context) {
  const year = Number(
    formatSpec(seed.specs?.releaseDate, {
      dateFormatter: SpecDateFormatter.Year,
    }),
  );

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: { performanceRated: true, year: [year] },
        orderBy: { sort: ProductsSort.PerformanceRating },
      },
    },
    ctx,
  );

  const seedIndex = results.findIndex((gpu) => gpu.id === seed.id);
  const sizePerSide = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  let start = Math.max(0, seedIndex - sizePerSide);
  let end = Math.min(seedIndex + sizePerSide, results.length);
  if (end - start !== TOTAL_COMPARED_PRODUCTS) {
    const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
    start = Math.max(0, start - diff);
    end = Math.min(end + diff, results.length);
  }
  const products: Product[] = serialize(results.slice(start, end));

  return { products, rank: seedIndex + 1 };
}

async function getValueArchitectureGpus(seed: Product, ctx: Context) {
  const company = formatSpec(seed.specs?.company);
  const architecture = formatSpec(seed.specs?.architecture);

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: {
          valueRated: true,
          company: [company],
          architecture: [architecture],
        },
        orderBy: { sort: ProductsSort.ValueRating },
      },
    },
    ctx,
  );

  const seedIndex = results.findIndex((gpu) => gpu.id === seed.id);
  const sizePerSide = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  let start = Math.max(0, seedIndex - sizePerSide);
  let end = Math.min(seedIndex + sizePerSide, results.length);
  if (end - start !== TOTAL_COMPARED_PRODUCTS) {
    const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
    start = Math.max(0, start - diff);
    end = Math.min(end + diff, results.length);
  }
  const products: Product[] = serialize(results.slice(start, end));

  return { products, rank: seedIndex + 1 };
}

async function getValueYearGpus(seed: Product, ctx: Context) {
  const year = Number(
    formatSpec(seed.specs?.releaseDate, {
      dateFormatter: SpecDateFormatter.Year,
    }),
  );

  const results = await productService.list(
    {
      type: ProductType.GPU,
      query: {
        filter: { valueRated: true, year: [year] },
        orderBy: { sort: ProductsSort.ValueRating },
      },
    },
    ctx,
  );

  const seedIndex = results.findIndex((gpu) => gpu.id === seed.id);
  const sizePerSide = Math.floor(TOTAL_COMPARED_PRODUCTS / 2);
  let start = Math.max(0, seedIndex - sizePerSide);
  let end = Math.min(seedIndex + sizePerSide, results.length);
  if (end - start !== TOTAL_COMPARED_PRODUCTS) {
    const diff = TOTAL_COMPARED_PRODUCTS - (end - start);
    start = Math.max(0, start - diff);
    end = Math.min(end + diff, results.length);
  }
  const products: Product[] = serialize(results.slice(start, end));

  return { products, rank: seedIndex + 1 };
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
