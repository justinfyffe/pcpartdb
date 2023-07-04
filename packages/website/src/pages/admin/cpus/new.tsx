import { ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminNewProductPage } from 'packages/website/src/client/admin';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';

export async function getServerSideProps(_ctx: NextPageContext) {
  return { props: { productType: ProductType.Cpu } };
}

export default withStaffGuard(AdminNewProductPage);
