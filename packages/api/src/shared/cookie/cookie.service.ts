import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Context } from '../context';

interface CookieOptions {
  expires?: number;
}

@Injectable()
export class CookieService {
  get(request: Request, name: string) {
    return request['cookies'][name];
  }

  save(name: string, value: unknown, options: CookieOptions, ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.WEBSITE_URL.startsWith('https'),
    };

    if (options?.expires != null) {
      cookieOptions.expires = new Date(options?.expires);
    }

    ctx.res?.cookie(name, value, cookieOptions);
  }

  clear(name: string, ctx: Context) {
    ctx.res?.clearCookie(name);
  }
}
