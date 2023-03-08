import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminNewImagePage } from '../../../client/admin/pages';

export default withStaffGuard(AdminNewImagePage);
