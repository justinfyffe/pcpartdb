import { AdminListGpusPage, AdminListGpusPageProps } from '@client/admin/pages';
import { partService } from '@server/part/part-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';
import { PartType } from '@shared/part';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const gpus = await serializeAsync(
    partService.list({ type: PartType.GPU }, ctx),
  );

  return { gpus } as AdminListGpusPageProps;
});

export default AdminListGpusPage;
