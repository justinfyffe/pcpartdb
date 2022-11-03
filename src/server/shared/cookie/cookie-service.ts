import { getCookie, removeCookies, setCookie } from 'cookies-next';
import { ServiceContext } from '../service/context';

interface CookieOptions {
  expires?: number;
}

export class CookieService {
  get(name: string, ctx: ServiceContext) {
    return getCookie(name, { req: ctx.api.req, res: ctx.api.res });
  }

  save(
    name: string,
    value: unknown,
    options: CookieOptions,
    ctx: ServiceContext,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.WEBSITE_URL.startsWith('https'),
    };

    if (options?.expires != null) {
      cookieOptions.expires = new Date(options?.expires);
    }

    setCookie(name, value, {
      ...cookieOptions,
      req: ctx.api.req,
      res: ctx.api.res,
    });
  }

  clear(name: string, ctx: ServiceContext) {
    removeCookies(name, {
      req: ctx.api.req,
      res: ctx.api.res,
      expires: new Date(Date.now() - 3600),
    });
  }
}

export const cookieService = new CookieService();
