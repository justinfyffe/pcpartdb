import {
  ViewGpuPage,
  ViewGpuPageProps,
  ViewPageContentData,
} from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { serializeAsync } from '@server/shared/types/serialize';
import {
  filterProducts,
  Product,
  ProductsFilter,
  ProductsOrderBy,
  ProductType,
  sliceProducts,
  sortProducts,
} from '@shared/product';
import { formatSpec, hasSpec, SpecDateFormatter } from '@shared/spec';
import { NextPageContext } from 'next';

const TOTAL_RELATIVE_PERFORMANCE_PRODUCTS = 10;

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const slug = ctx.query.slug as string;
    const gpu = await getGpu(slug, { trx });

    const allRatedGpus = await getAllRatedGpus(ctx);
    const gpusByPerformance = sortProducts(
      allRatedGpus,
      ProductsOrderBy.PerformanceRating,
    );

    const performanceArchitectureGpus = getPerformanceArchitectureGpus(
      gpusByPerformance,
      gpu,
    );
    const performanceYearGpus = getPerformanceYearGpus(gpusByPerformance, gpu);

    const gpusByValue = sortProducts(allRatedGpus, ProductsOrderBy.ValueRating);

    const contentData: ViewPageContentData = {
      totalPerformanceRatedGpus: allRatedGpus.length,
      performanceArchitectureGpus,
      performanceYearGpus,
    };

    // TODO: determine this based on launch year, architecture, company
    const relatedProducts = await productService.getRelatedProducts(
      {
        type: ProductType.GPU,
        seed: gpu,
        prioritize: ProductsOrderBy.ReleaseDate,
      },
      { trx },
    );

    const pageProps: ViewGpuPageProps = {
      gpu: JSON.parse(JSON.stringify(gpu)),
      contentData: JSON.parse(JSON.stringify(contentData)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

async function getGpu(slug: string, ctx: Context) {
  const gpu: Product = await serializeAsync(productService.get(slug, ctx));
  await productService.populateRanks(gpu, ctx);
  return gpu;
}

async function getAllRatedGpus(ctx: Context) {
  return await productService.list(
    { type: ProductType.GPU, filter: { performanceRated: true } },
    ctx,
  );
}

function getPerformanceArchitectureGpus(gpus: Product[], seed: Product) {
  return getPerformanceGpus(gpus, seed, {
    architecture: formatSpec(seed.specs?.architecture),
  });
}

function getPerformanceYearGpus(gpus: Product[], seed: Product) {
  return getPerformanceGpus(gpus, seed, {
    year: Number(
      formatSpec(seed.specs?.releaseDate, {
        dateFormatter: SpecDateFormatter.Year,
      }),
    ),
  });
}

function getPerformanceGpus(
  gpus: Product[],
  seed: Product,
  filter: ProductsFilter,
) {
  const filteredGpus = filterProducts(gpus, filter);

  const seedIndex = filteredGpus.findIndex((gpu) => gpu.id === seed.id);
  const start = Math.max(
    0,
    seedIndex - TOTAL_RELATIVE_PERFORMANCE_PRODUCTS / 2,
  );
  return sliceProducts(
    filteredGpus,
    start,
    TOTAL_RELATIVE_PERFORMANCE_PRODUCTS,
  );
}

function getRelatedPerformanceGpus(allGpus: Product[], seedGpu: Product) {
  const performanceGpus = sortProducts(
    allGpus,
    ProductsOrderBy.PerformanceRating,
  );

  let launchYearGpus: Product[] = [];
  let architectureGpus: Product[] = [];

  // Year
  if (hasSpec(seedGpu.specs?.releaseDate)) {
    const year = Number(
      formatSpec(seedGpu.specs.releaseDate, {
        dateFormatter: SpecDateFormatter.Year,
      }),
    );
    const filteredGpus = filterProducts(performanceGpus, { year });

    const seedIndex = filteredGpus.findIndex((gpu) => gpu.id === seedGpu.id);
    const start = Math.max(
      0,
      seedIndex - TOTAL_RELATIVE_PERFORMANCE_PRODUCTS / 2,
    );
    launchYearGpus = sliceProducts(
      filteredGpus,
      start,
      TOTAL_RELATIVE_PERFORMANCE_PRODUCTS,
    );
  }

  // Architecture
  if (hasSpec(seedGpu.specs?.architecture)) {
    const filteredGpus = filterProducts(performanceGpus, {
      architecture: formatSpec(seedGpu.specs?.architecture),
    });

    const seedIndex = filteredGpus.findIndex((gpu) => gpu.id === seedGpu.id);
    const start = Math.max(
      0,
      seedIndex - TOTAL_RELATIVE_PERFORMANCE_PRODUCTS / 2,
    );
    architectureGpus = sliceProducts(
      filteredGpus,
      start,
      TOTAL_RELATIVE_PERFORMANCE_PRODUCTS,
    );
  }

  return { launchYearGpus, architectureGpus };
}

export default ViewGpuPage;
