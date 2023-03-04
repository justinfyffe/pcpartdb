import { NextPageContext } from 'next';
import { AdminListUsersPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/users/list');
}

export default AdminListUsersPage;
