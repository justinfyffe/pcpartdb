import { CompareGpuPage, CompareGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { ProductComparison, ProductsSort, ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(nextCtx: NextPageContext) {
  return transaction(async (trx) => {
    const ctx = { trx };
    const slug = nextCtx.query.slug as string;

    const comparison = await getComparison(slug, ctx);

    const relatedProducts = await productService.getRelatedProducts(
      {
        type: ProductType.GPU,
        seed: comparison,
        prioritize: ProductsSort.ReleaseDate,
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

async function getComparison(
  slug: string,
  ctx: Context,
): Promise<ProductComparison> {
  const comparison = productService.getComparison(
    { slug, includeImages: true, includeRanks: true },
    ctx,
  );

  return serialize(comparison);
}

export default CompareGpuPage;
