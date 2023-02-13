import { AdminListGpusPage, AdminListGpusPageProps } from '@client/admin/pages';
import { gpuService } from '@server/gpus/gpu-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const gpus = await getGpus(ctx);

  return { gpus } as AdminListGpusPageProps;
});

async function getGpus(ctx: Context) {
  return await gpuService.list({}, ctx);
}

export default AdminListGpusPage;
