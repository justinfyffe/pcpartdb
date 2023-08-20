import { joinUrlParts, ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditProductPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { gpuIdOrSlug: string };

  const endpoint = joinUrlParts('admin/products', query.gpuIdOrSlug);
  return await viewModelsClient.get(endpoint, {
    params: { productType: ProductType.Gpu },
  });
}

export default withStaffGuard(AdminEditProductPage);
