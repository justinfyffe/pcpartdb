import { CompareGpuPage, CompareGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductsOrderBy, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const slug = ctx.query.slug as string;
    const comparison = await serializeAsync(
      productService.getComparison(slug, { trx }),
    );
    await productService.populateRanks(comparison, { trx });

    const relatedProducts = await productService.getRelatedProducts(
      {
        type: ProductType.GPU,
        seed: comparison,
        prioritize: ProductsOrderBy.ReleaseDate,
      },
      { trx },
    );

    const pageProps: CompareGpuPageProps = {
      comparison: JSON.parse(JSON.stringify(comparison)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };

    return { props: pageProps };
  });
}

export default CompareGpuPage;
