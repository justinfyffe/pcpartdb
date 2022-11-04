import { getCookie, removeCookies, setCookie } from 'cookies-next';
import { ApiContext } from '../api/context';
import { SsrContext } from '../ssr/context';

interface CookieOptions {
  expires?: number;
}

export class CookieService {
  get(name: string, ctx: ApiContext | SsrContext) {
    const { req, res } = ctx;
    return getCookie(name, { req, res });
  }

  save(
    name: string,
    value: unknown,
    options: CookieOptions,
    ctx: ApiContext | SsrContext,
  ) {
    const { req, res } = ctx;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.WEBSITE_URL.startsWith('https'),
    };

    if (options?.expires != null) {
      cookieOptions.expires = new Date(options?.expires);
    }

    setCookie(name, value, { ...cookieOptions, req, res });
  }

  clear(name: string, ctx: ApiContext | SsrContext) {
    const { req, res } = ctx;
    removeCookies(name, { req, res, expires: new Date(Date.now() - 3600) });
  }
}

export const cookieService = new CookieService();
