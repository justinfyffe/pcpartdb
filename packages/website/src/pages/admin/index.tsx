import { ApiError } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminOverviewPage } from '../../client/admin/pages/AdminOverviewPage/AdminOverviewPage';
import { viewModelsClient } from '../../client/shared/api/viewModelsClient';
import { withStaffGuard } from '../../client/shared/guards/withStaffGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const response = await viewModelsClient.get('admin/overview', {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminOverviewPage);
