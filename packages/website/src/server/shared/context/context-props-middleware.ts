import { ApiContext } from '@pcpartdb/website/server/shared/api/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';

export async function contextPropsMiddleware(ctx: ApiContext | SsrContext) {
  ctx.props = ctx.props ?? {};

  ctx.props.enableGoogleAnalytics =
    process.env.ENABLE_GOOGLE_ANALYTICS === 'true';
  ctx.props.googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

  ctx.props.isStaff = ctx.user?.isStaff ?? false;
}
