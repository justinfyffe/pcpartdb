import { LoginPage } from '../client/auth/pages/LoginPage/LoginPage';
import { withGuestGuard } from '../client/shared/guards/withGuestGuard';

export default withGuestGuard(LoginPage);
