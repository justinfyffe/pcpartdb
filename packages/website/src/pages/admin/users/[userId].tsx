import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditUserPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { userId: string };
  const userId = Number(query.userId);
  return await viewModelsClient.get(`admin/users/edit/${userId}`);
}

export default withStaffGuard(AdminEditUserPage);
