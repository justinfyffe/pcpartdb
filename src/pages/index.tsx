import { HomePage, HomePageProps } from '@client/home';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { filterProducts, sortProducts } from '@server/product/product-utils';
import { serializeAsync } from '@server/shared/types/serialize';
import { Product, ProductsOrderBy, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    // TODO - NVIDA vs AMD
    // Popular

    // TODO - NVIDIA
    // Most Popular

    // TODO - AMD
    // Most Popular

    const gpus: Product[] = await serializeAsync(
      productService.list({ type: ProductType.GPU }, { trx }),
    );

    const nvidiaGpus = filterProducts(gpus, { company: 'NVIDIA' });
    const amdGpus = filterProducts(gpus, { company: 'AMD' });

    const bestPerformingNvidiaGpu =
      sortProducts(nvidiaGpus, ProductsOrderBy.PerformanceRating)[0] ?? null;
    const bestPerformingAmdGpu =
      sortProducts(amdGpus, ProductsOrderBy.PerformanceRating)[0] ?? null;

    const bestValueNvidiaGpu =
      sortProducts(nvidiaGpus, ProductsOrderBy.ValueRating)[0] ?? null;
    const bestValueAmdGpu =
      sortProducts(amdGpus, ProductsOrderBy.ValueRating)[0] ?? null;

    const nvidiaVsAmdGpus = [];
    if (bestPerformingNvidiaGpu != null && bestPerformingAmdGpu != null) {
      nvidiaVsAmdGpus.push([bestPerformingNvidiaGpu, bestPerformingAmdGpu]);
    }
    if (bestValueNvidiaGpu != null && bestValueAmdGpu != null) {
      nvidiaVsAmdGpus.push([bestValueNvidiaGpu, bestValueAmdGpu]);
    }

    const nvidia = await serializeAsync(
      productService.list(
        { type: ProductType.GPU, filter: { company: 'nvidia' }, limit: 3 },
        { trx },
      ),
    );

    const amd = await serializeAsync(
      productService.list(
        { type: ProductType.GPU, filter: { company: 'amd' }, limit: 3 },
        { trx },
      ),
    );

    const pageProps: HomePageProps = {
      nvidiaVsAmdGpus: JSON.parse(JSON.stringify(nvidiaVsAmdGpus)),
      nvidiaGpus: JSON.parse(JSON.stringify(nvidia)),
      amdGpus: JSON.parse(JSON.stringify(amd)),
    };

    return { props: pageProps };
  });
}

export default HomePage;
