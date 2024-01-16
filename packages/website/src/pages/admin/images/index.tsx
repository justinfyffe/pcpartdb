import { ApiError } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminListImagesPage } from 'packages/website/src/client/admin/pages/image/AdminListImagesPage/AdminListImagesPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const response = await viewModelsClient.get('admin/images/list', {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminListImagesPage);
