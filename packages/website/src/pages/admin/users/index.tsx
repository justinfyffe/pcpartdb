import { NextPageContext } from 'next';
import { AdminListUsersPage } from 'packages/website/src/client/admin/pages/user/AdminListUsersPage/AdminListUsersPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  return await viewModelsClient.get('admin/users/list', {
    headers: { cookie: ctx.req?.headers?.cookie ?? '' },
  });
}

export default withStaffGuard(AdminListUsersPage);
