import { AdminEditGpuPage, AdminEditGpuPageProps } from '@client/admin/pages';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  const gpu = await getGpu(gpuId, ctx);

  return { gpu } as AdminEditGpuPageProps;
});

async function getGpu(id: number, ctx: Context) {
  const gpu = await partService.get({ id, includeImages: true }, ctx);

  return serialize(gpu);
}

export default AdminEditGpuPage;
