import { AdminListGpusPage, AdminListGpusPageProps } from '@client/admin/pages';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { PartType } from '@shared/part';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const gpus = await getGpus(ctx);

  return { gpus } as AdminListGpusPageProps;
});

async function getGpus(ctx: Context) {
  const gpus = partService.list({ type: PartType.GPU }, ctx);

  return serialize(gpus);
}

export default AdminListGpusPage;
