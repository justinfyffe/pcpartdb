import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListCpusPage } from '../../../client/admin/pages';

export default withStaffGuard(AdminListCpusPage);
