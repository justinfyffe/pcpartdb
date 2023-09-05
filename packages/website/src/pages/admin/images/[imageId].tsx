import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditImagePage } from 'packages/website/src/client/admin/pages/image/AdminEditImagePage/AdminEditImagePage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { imageId: string };
  const imageId = Number(query.imageId);

  const endpoint = joinUrlParts('admin/images/edit', String(imageId));
  return await viewModelsClient.get(endpoint);
}

export default withStaffGuard(AdminEditImagePage);
