import { joinUrlParts, ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminEditProductPage } from 'packages/website/src/client/admin/pages/product/AdminEditProductPage/AdminEditProductPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { cpuIdOrSlug: string };

  const endpoint = joinUrlParts('admin/products', query.cpuIdOrSlug);
  return await viewModelsClient.get(endpoint, {
    params: { productType: ProductType.Cpu },
  });
}

export default withStaffGuard(AdminEditProductPage);
