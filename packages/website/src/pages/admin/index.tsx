import { NextPageContext } from 'next';
import { AdminOverviewPage } from '../../client/admin/pages';
import { viewModelsClient } from '../../client/shared/api';
import { withStaffGuard } from '../../client/shared/guards';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/overview');
}

export default withStaffGuard(AdminOverviewPage);
