import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListGpusPage } from '../../../client/admin/pages';

export default withStaffGuard(AdminListGpusPage);
