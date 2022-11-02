import { CompareGpuPage, CompareGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const slug = ctx.query.slug as string;
    const gpus = await serializeAsync(
      productService.getComparison(slug, { trx }),
    );

    const pageProps: CompareGpuPageProps = {
      gpus: JSON.parse(JSON.stringify(gpus)),
    };

    return { props: pageProps };
  });
}

export default CompareGpuPage;
