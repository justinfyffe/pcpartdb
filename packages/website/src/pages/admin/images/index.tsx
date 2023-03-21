import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListImagesPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/images/list');
}

export default withStaffGuard(AdminListImagesPage);
