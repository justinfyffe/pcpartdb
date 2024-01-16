import { ApiError } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminListUsersPage } from 'packages/website/src/client/admin/pages/user/AdminListUsersPage/AdminListUsersPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const response = await viewModelsClient.get('admin/users/list', {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminListUsersPage);
