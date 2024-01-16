import { ApiError, joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditUserPage } from 'packages/website/src/client/admin/pages/user/AdminEditUserPage/AdminEditUserPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { userId: string };
  const userId = Number(query.userId);

  const endpoint = joinUrlParts('admin/users/edit', String(userId));
  try {
    const response = await viewModelsClient.get(endpoint, {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminEditUserPage);
