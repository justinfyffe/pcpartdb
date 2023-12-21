import { User, UserSettings } from '../user';

export interface Config {
  env?: string;
  enableGtm?: boolean;
  gtmId?: string;
  disableAds?: boolean;
  isStaff?: boolean;
  user?: User;
  requireCookieConsent?: boolean;
  cookieConsent?: boolean;
  userCountry?: string;
  userSettings?: UserSettings;
}
