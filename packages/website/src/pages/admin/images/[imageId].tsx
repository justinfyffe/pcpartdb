import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditImagePage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { imageId: string };
  const imageId = Number(query.imageId);

  const endpoint = joinUrlParts('admin/images/edit', String(imageId));
  return await viewModelsClient.get(endpoint);
}

export default withStaffGuard(AdminEditImagePage);
