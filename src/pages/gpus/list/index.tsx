import { ListGpusPage, ListGpusPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const { query } = ctx;

    const company = query.company as string;
    const sort = query.sort as ProductsSort;

    const gpus = await serializeAsync(
      productService.list(
        {
          type: ProductType.GPU,
          filter: { company },
          sort: sort,
          includeRanks: true,
        },
        { trx },
      ),
    );

    const relatedProducts = await productService.getRelatedProducts(
      { type: ProductType.GPU, prioritize: ProductsSort.ReleaseDate },
      { trx },
    );

    const pageProps: ListGpusPageProps = {
      gpus: JSON.parse(JSON.stringify(gpus)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

export default ListGpusPage;
