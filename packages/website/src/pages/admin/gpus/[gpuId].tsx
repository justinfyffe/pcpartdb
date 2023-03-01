import {
  AdminEditGpuPage,
  AdminEditGpuPageProps,
} from '@pcpartdb/website/client/admin/pages';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

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
