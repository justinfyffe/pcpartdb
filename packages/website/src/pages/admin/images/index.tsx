import { NextPageContext } from 'next';
import { AdminListImagesPage } from 'packages/website/src/client/admin/pages/image/AdminListImagesPage/AdminListImagesPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  return await viewModelsClient.get('admin/images/list', {
    nextPageContext: ctx,
  });
}

export default withStaffGuard(AdminListImagesPage);
