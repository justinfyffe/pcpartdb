import { OverviewGpusPage, OverviewGpusPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { Product, ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

const TOTAL_PRODUCTS_PER_LIST = 5;

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    const bestPerforming: Product[] = await serializeAsync(
      productService.list(
        {
          type: ProductType.GPU,
          sort: ProductsSort.PerformanceRating,
          limit: TOTAL_PRODUCTS_PER_LIST,
        },
        { trx },
      ),
    );

    const bestValue: Product[] = await serializeAsync(
      productService.list(
        {
          type: ProductType.GPU,
          sort: ProductsSort.ValueRating,
          limit: TOTAL_PRODUCTS_PER_LIST,
        },
        { trx },
      ),
    );

    const relatedProducts = await productService.getRelatedProducts(
      { type: ProductType.GPU, prioritize: ProductsSort.ReleaseDate },
      { trx },
    );

    const pageProps = {
      gpusByPerformance: JSON.parse(JSON.stringify(bestPerforming)),
      gpusByValue: JSON.parse(JSON.stringify(bestValue)),

      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    } as OverviewGpusPageProps;

    return { props: pageProps };
  });
}

export default OverviewGpusPage;
