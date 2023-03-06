import { RegisterPage } from '../client/auth/pages';
import { withGuestGuard } from '../client/shared/guards';

export default withGuestGuard(RegisterPage);
