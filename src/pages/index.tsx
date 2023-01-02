import { HomePage, HomePageProps } from '@client/home/pages';
import { productService } from '@server/product/product-service';
import { filterProducts, sortProducts } from '@server/product/product-utils';
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

export const getServerSideProps = ssrPageProps<HomePageProps>(
  async (ctx: SsrContext) => {
    const gpus = await getAllGpus(ctx);
    const nvidiaGpus = getNvidiaGpus(gpus);
    const amdGpus = getAmdGpus(gpus);

    const nvidiaVsAmdGpus = [
      [nvidiaGpus[0], amdGpus[0]],
      [nvidiaGpus[1], amdGpus[1]],
      [nvidiaGpus[2], amdGpus[2]],
    ].filter(([p1, p2]) => p1 != null && p2 != null) as ProductComparison[];

    return { nvidiaVsAmdGpus, nvidiaGpus, amdGpus };
  },
);

async function getAllGpus(ctx: Context) {
  const gpus = await productService.list({ type: ProductType.GPU }, ctx);
  return serialize(gpus) as Product[];
}

function getNvidiaGpus(gpus: Product[]) {
  const nvidiaGpus = filterProducts(gpus, { company: ['nvidia'] });

  const bestPerformingGpus =
    sortProducts(nvidiaGpus, {
      sort: ProductsSort.PerformanceRating,
    }) ?? [];

  const bestValueGpus =
    sortProducts(nvidiaGpus, {
      sort: ProductsSort.PerformanceRating,
    }) ?? [];

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.max(nvidiaGpus.length - 1, 10))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

function getAmdGpus(gpus: Product[]) {
  const amdGpus = filterProducts(gpus, { company: ['amd'] });

  const bestPerformingGpus =
    sortProducts(amdGpus, {
      sort: ProductsSort.PerformanceRating,
    }) ?? [];

  const bestValueGpus =
    sortProducts(amdGpus, {
      sort: ProductsSort.PerformanceRating,
    }) ?? [];

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.max(amdGpus.length - 1, 10))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

export default HomePage;
