import { ApiError, joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditImagePage } from 'packages/website/src/client/admin/pages/image/AdminEditImagePage/AdminEditImagePage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { imageId: string };
  const imageId = Number(query.imageId);

  const endpoint = joinUrlParts('admin/images/edit', String(imageId));
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

export default withStaffGuard(AdminEditImagePage);
