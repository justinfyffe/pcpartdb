import { User } from '../user';

export interface Config {
  disableAds?: boolean;
  bingAdsSiteId?: string;
  bingAdsPublisherId?: string;
  enableClarity?: boolean;
  clarityId?: string;
  enableGoogleAnalytics?: boolean;
  googleAnalyticsId?: string;
  isStaff?: boolean;
  user?: User;
  requireCookieConsent?: boolean;
  cookieConsent?: boolean;
  userCountry?: string;
}
