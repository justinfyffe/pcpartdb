import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditImagePage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { imageId: string };
  const imageId = Number(query.imageId);
  return await viewModelsClient.get(`admin/images/edit/${imageId}`);
}

export default withStaffGuard(AdminEditImagePage);
