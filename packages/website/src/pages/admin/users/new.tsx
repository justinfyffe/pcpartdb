import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminNewUserPage } from '../../../client/admin/pages';

export default withStaffGuard(AdminNewUserPage);
