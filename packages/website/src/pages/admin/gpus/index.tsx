import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListGpusPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/gpus/list');
}

export default withStaffGuard(AdminListGpusPage);
