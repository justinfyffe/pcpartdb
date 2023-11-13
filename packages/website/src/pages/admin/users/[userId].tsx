import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditUserPage } from 'packages/website/src/client/admin/pages/user/AdminEditUserPage/AdminEditUserPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { userId: string };
  const userId = Number(query.userId);

  const endpoint = joinUrlParts('admin/users/edit', String(userId));
  return await viewModelsClient.get(endpoint, {
    headers: { cookie: ctx.req?.headers?.cookie ?? '' },
  });
}

export default withStaffGuard(AdminEditUserPage);
