import { AdminListGamesPage } from 'packages/website/src/client/admin/pages/game/AdminListGamesPage/AdminListGamesPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminListGamesPage);
