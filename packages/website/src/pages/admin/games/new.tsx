import { AdminNewGamePage } from 'packages/website/src/client/admin/pages/game/AdminNewGamePage/AdminNewGamePage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminNewGamePage);
