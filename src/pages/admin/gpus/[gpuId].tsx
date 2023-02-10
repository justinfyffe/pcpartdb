import { AdminEditGpuPage, AdminEditGpuPageProps } from '@client/admin/pages';
import { gpuService } from '@server/gpus/gpu-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  const gpu = await getGpu(gpuId, ctx);

  return { gpu } as AdminEditGpuPageProps;
});

async function getGpu(id: number, ctx: Context) {
  return await gpuService.getById(id, { includeImages: true }, ctx);
}

export default AdminEditGpuPage;
