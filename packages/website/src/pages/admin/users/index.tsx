import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListUsersPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/users/list');
}

export default withStaffGuard(AdminListUsersPage);
