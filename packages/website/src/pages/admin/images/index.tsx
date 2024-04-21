import { AdminListImagesPage } from 'packages/website/src/client/admin/pages/image/AdminListImagesPage/AdminListImagesPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminListImagesPage);
