import { ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminImportProductsPage } from 'packages/website/src/client/admin/pages/AdminImportProductsPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';

export async function getServerSideProps(_ctx: NextPageContext) {
  return { props: { productType: ProductType.Cpu } };
}

export default withStaffGuard(AdminImportProductsPage);
