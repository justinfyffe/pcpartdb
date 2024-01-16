import { ApiError, joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditProductPage } from 'packages/website/src/client/admin/pages/product/AdminEditProductPage/AdminEditProductPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { idOrSlug: string; type?: string };

  const idOrSlug = query.idOrSlug;
  const productType = query.type?.toUpperCase();

  const endpoint = joinUrlParts('admin/products', idOrSlug);
  try {
    const response = await viewModelsClient.get(endpoint, {
      nextPageContext: ctx,
      params: { productType },
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withStaffGuard(AdminEditProductPage);
