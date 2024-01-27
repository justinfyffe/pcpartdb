import { ProductType } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import {
  AdminNewProductPage,
  AdminNewProductPageProps,
} from 'packages/website/src/client/admin/pages/product/AdminNewProductPage/AdminNewProductPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  const productType = (ctx.query?.type as string)?.toUpperCase() as ProductType;
  const props: AdminNewProductPageProps = {};
  if (productType != null) {
    props.productType = productType;
  }

  return { props };
}

export default withStaffGuard(AdminNewProductPage);
