import { NextPageContext } from 'next';
import { AdminEditImagePage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { imageId: string };
  const imageId = Number(query.imageId);
  return await viewModelsClient.get(`admin/images/edit/${imageId}`);
}

export default AdminEditImagePage;
