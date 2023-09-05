import { ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminImportProductsPage } from 'packages/website/src/client/admin/pages/product/AdminImportProductsPage/AdminImportProductsPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export async function getServerSideProps(_ctx: NextPageContext) {
  return { props: { productType: ProductType.Gpu } };
}

export default withStaffGuard(AdminImportProductsPage);
