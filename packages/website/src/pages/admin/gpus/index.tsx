import {
  AdminListGpusPage,
  AdminListGpusPageProps,
} from '@pcpartdb/website/client/admin/pages';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const gpus = await getGpus(ctx);

  return { gpus } as AdminListGpusPageProps;
});

async function getGpus(ctx: Context) {
  return await gpuService.list({}, ctx);
}

export default AdminListGpusPage;
