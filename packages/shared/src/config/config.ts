import { User } from '../user';

export interface Config {
  enableGoogleAnalytics?: boolean;
  googleAnalyticsId?: string;
  isStaff?: boolean;
  user?: User;
}
