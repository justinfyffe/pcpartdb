import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminAutomationPage } from '../../../client/admin';

export default withStaffGuard(AdminAutomationPage);
