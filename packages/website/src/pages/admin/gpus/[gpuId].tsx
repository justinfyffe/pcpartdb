import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditGpuPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { gpuId: string };
  const gpuId = Number(query.gpuId);

  const endpoint = joinUrlParts('admin/gpus/edit', String(gpuId));
  return await viewModelsClient.get(endpoint);
}

export default withStaffGuard(AdminEditGpuPage);
