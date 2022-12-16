import { ViewGpuPage, ViewGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductsOrderBy, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const slug = ctx.query.slug as string;
    const gpu = await serializeAsync(productService.get(slug, { trx }));
    await productService.populateRanks(gpu, { trx });

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
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

export default ViewGpuPage;
