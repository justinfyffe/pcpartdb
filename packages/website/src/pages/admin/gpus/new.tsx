import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminNewGpuPage } from '../../../client/admin/pages';

export default withStaffGuard(AdminNewGpuPage);
