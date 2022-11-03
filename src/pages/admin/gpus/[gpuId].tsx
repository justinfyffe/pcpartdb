import { AdminEditGpuPage, AdminEditGpuPageProps } from '@client/admin';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { NextPageContext } from 'next';

export async function getServerSideProps(ctx: NextPageContext) {
  return transaction(async (trx) => {
    const query = ctx.query as { gpuId: string };
    const gpuId = parseInt(query.gpuId, 10);

    const gpu = await serializeAsync(productService.get(gpuId, { trx }));

    const pageProps: AdminEditGpuPageProps = {
      gpu: JSON.parse(JSON.stringify(gpu)),
    };

    return { props: pageProps };
  });
}

export default AdminEditGpuPage;
