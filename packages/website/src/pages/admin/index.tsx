import { NextPageContext } from 'next';
import { AdminOverviewPage } from '../../client/admin/pages/AdminOverviewPage/AdminOverviewPage';
import { viewModelsClient } from '../../client/shared/api/viewModelsClient';
import { withStaffGuard } from '../../client/shared/guards/withStaffGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  return await viewModelsClient.get('admin/overview', {
    headers: { cookie: ctx.req?.headers?.cookie ?? undefined },
  });
}

export default withStaffGuard(AdminOverviewPage);
