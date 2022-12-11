import { ViewGpuPage, ViewGpuPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const slug = ctx.query.slug as string;
    const gpu = await serializeAsync(productService.get(slug, { trx }));
    await productService.populateRanks(gpu, { trx });

    const pageProps: ViewGpuPageProps = {
      gpu: JSON.parse(JSON.stringify(gpu)),

      relevantProducts: {
        comparisons: [],
        gpus: [],
      },
    };

    return { props: pageProps };
  });
}

export default ViewGpuPage;
