import { NextPageContext } from 'next';
import { AdminEditUserPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { userId: string };
  const userId = Number(query.userId);
  return await viewModelsClient.get(`admin/users/edit/${userId}`);
}

export default AdminEditUserPage;
