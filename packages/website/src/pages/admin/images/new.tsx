import { AdminNewImagePage } from 'packages/website/src/client/admin/pages/image/AdminNewImagePage/AdminNewImagePage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminNewImagePage);
