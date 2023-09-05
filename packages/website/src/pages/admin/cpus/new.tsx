import { ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminNewProductPage } from 'packages/website/src/client/admin/pages/product/AdminNewProductPage/AdminNewProductPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export async function getServerSideProps(_ctx: NextPageContext) {
  return { props: { productType: ProductType.Cpu } };
}

export default withStaffGuard(AdminNewProductPage);
