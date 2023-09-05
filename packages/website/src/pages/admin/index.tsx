import { NextPageContext } from 'next';
import { AdminOverviewPage } from '../../client/admin/pages/AdminOverviewPage/AdminOverviewPage';
import { viewModelsClient } from '../../client/shared/api/viewModelsClient';
import { withStaffGuard } from '../../client/shared/guards/withStaffGuard';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/overview');
}

export default withStaffGuard(AdminOverviewPage);
