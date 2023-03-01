import { ApiContext } from '../api/context';
import { SsrContext } from '../ssr/context';

export type Context = ApiContext | SsrContext;

export interface ContextProps {
  enableGoogleAnalytics?: boolean;
  googleAnalyticsId?: string;
  isStaff?: boolean;
}
