import { OverviewGpusPage, OverviewGpusPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { limitProducts, sortProducts } from '@server/product/product-utils';
import { serializeAsync } from '@server/shared/types/serialize';
import { Product, ProductsOrderBy, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

const TOTAL_PRODUCTS_PER_LIST = 5;

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    const gpus: Product[] = await serializeAsync(
      productService.list({ type: ProductType.GPU }, { trx }),
    );

    const bestPerforming = limitProducts(
      sortProducts(gpus, ProductsOrderBy.PerformanceRating),
      TOTAL_PRODUCTS_PER_LIST,
    );
    const bestValue = limitProducts(
      sortProducts(gpus, ProductsOrderBy.ValueRating),
      TOTAL_PRODUCTS_PER_LIST,
    );

    const pageProps = {
      gpusByPerformance: bestPerforming,
      gpusByValue: bestValue,

      relatedProducts: {
        comparisons: [],
        gpus: [],
      },
    } as OverviewGpusPageProps;

    return { props: pageProps };
  });
}

export default OverviewGpusPage;
