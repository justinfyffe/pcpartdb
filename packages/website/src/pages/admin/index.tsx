import { AdminOverviewPage } from '../../client/admin/pages';
import { withStaffGuard } from '../../client/shared/guards';

export default withStaffGuard(AdminOverviewPage);
