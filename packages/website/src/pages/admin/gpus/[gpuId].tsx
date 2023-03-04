import { NextPageContext } from 'next';
import { AdminEditGpuPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { gpuId: string };
  const gpuId = Number(query.gpuId);
  return await viewModelsClient.get(`admin/gpus/edit/${gpuId}`);
}

export default AdminEditGpuPage;
