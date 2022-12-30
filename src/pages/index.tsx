import { HomePage, HomePageProps } from '@client/home/pages';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { filterProducts, sortProducts } from '@server/product/product-utils';
import { serializeAsync } from '@server/shared/types/serialize';
import { Product, ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    // TODO - NVIDA vs AMD
    // 3rd option

    // TODO - NVIDIA
    // 3rd option

    // TODO - AMD
    // 3rd option

    const gpus: Product[] = await serializeAsync(
      productService.list({ type: ProductType.GPU }, { trx }),
    );

    const nvidia = filterProducts(gpus, { company: ['nvidia'] });
    const amd = filterProducts(gpus, { company: ['amd'] });

    const bestPerformingNvidia =
      sortProducts(nvidia, { sort: ProductsSort.PerformanceRating })[0] ?? null;
    const bestPerformingAmd =
      sortProducts(amd, { sort: ProductsSort.PerformanceRating })[0] ?? null;

    const bestValueNvidia =
      sortProducts(nvidia, { sort: ProductsSort.ValueRating })[0] ?? null;
    const bestValueAmd =
      sortProducts(amd, { sort: ProductsSort.ValueRating })[0] ?? null;

    const nvidiaVsAmdGpus = [];
    if (bestPerformingNvidia != null && bestPerformingAmd != null) {
      nvidiaVsAmdGpus.push([bestPerformingNvidia, bestPerformingAmd]);
    }
    if (bestValueNvidia != null && bestValueAmd != null) {
      nvidiaVsAmdGpus.push([bestValueNvidia, bestValueAmd]);
    }

    const nvidiaGpus = [bestPerformingNvidia, bestValueNvidia].filter(
      (gpu) => gpu != null,
    );
    const amdGpus = [bestPerformingAmd, bestValueAmd].filter(
      (gpu) => gpu != null,
    );

    const pageProps: HomePageProps = {
      nvidiaVsAmdGpus: JSON.parse(JSON.stringify(nvidiaVsAmdGpus)),
      nvidiaGpus: JSON.parse(JSON.stringify(nvidiaGpus)),
      amdGpus: JSON.parse(JSON.stringify(amdGpus)),
    };

    return { props: pageProps };
  });
}

export default HomePage;
