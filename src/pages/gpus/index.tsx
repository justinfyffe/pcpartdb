import {
  ListQuery,
  OverviewGpusPage,
  OverviewGpusPageProps,
} from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const { query } = nextCtx;
    const company = query.company as string;
    const sort = query.sort as ProductsSort;
    const ctx = { trx };

    const listQuery: ListQuery = { company, sort };

    const gpus = await serializeAsync(
      productService.list(
        {
          type: ProductType.GPU,
          filter: { company },
          sort: sort,
          includeRanks: true,
        },
        ctx,
      ),
    );

    const relatedProducts = await productService.getRelatedProducts(
      { type: ProductType.GPU, prioritize: ProductsSort.ReleaseDate },
      ctx,
    );

    const pageProps = {
      listQuery,
      gpus: JSON.parse(JSON.stringify(gpus)),

      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    } as OverviewGpusPageProps;

    return { props: pageProps };
  });
}

export default OverviewGpusPage;
