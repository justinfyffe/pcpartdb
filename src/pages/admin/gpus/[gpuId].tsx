import { AdminEditGpuPage, AdminEditGpuPageProps } from '@client/admin';
import { productService } from '@server/product/product-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  const gpu = await serializeAsync(productService.get({ id: gpuId }, ctx));

  return { gpu } as AdminEditGpuPageProps;
});

export default AdminEditGpuPage;
