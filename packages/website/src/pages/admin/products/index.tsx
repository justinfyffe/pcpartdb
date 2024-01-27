import { AdminListProductsPage } from 'packages/website/src/client/admin/pages/product/AdminListProductsPage/AdminListProductsPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminListProductsPage);
