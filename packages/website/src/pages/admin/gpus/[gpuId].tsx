import { joinUrlParts, ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminEditProductPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = ctx.query as { gpuId: string };
  const gpuId = Number(query.gpuId);

  const endpoint = joinUrlParts('admin/products', String(gpuId));
  return await viewModelsClient.get(endpoint, {
    params: { productType: ProductType.Gpu },
  });
}

export default withStaffGuard(AdminEditProductPage);
