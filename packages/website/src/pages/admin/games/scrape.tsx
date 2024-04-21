import { AdminScrapeGamesPage } from 'packages/website/src/client/admin/pages/game/AdminScrapeGamesPage/AdminScrapeGamesPage';
import { withStaffGuard } from 'packages/website/src/client/shared/guards/withStaffGuard';

export default withStaffGuard(AdminScrapeGamesPage);
