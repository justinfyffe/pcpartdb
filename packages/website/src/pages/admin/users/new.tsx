import { AdminNewUserPage } from 'packages/website/src/client/admin/pages/user/AdminNewUserPage/AdminNewUserPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminNewUserPage);
