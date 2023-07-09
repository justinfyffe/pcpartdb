import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminAutopilotPage } from '../../../client/admin';

export default withStaffGuard(AdminAutopilotPage);
