import { Injectable } from '@nestjs/common';
import express from 'express';

interface CookieOptions {
  expires?: number;
}

@Injectable()
export class CookieService {
  get(request: express.Request, name: string) {
    return request['cookies'][name];
  }

  save(
    response: express.Response,
    name: string,
    value: unknown,
    options?: CookieOptions,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.WEBSITE_URL.startsWith('https'),
    };

    if (options?.expires != null) {
      cookieOptions.expires = new Date(options?.expires);
    }

    response.cookie(name, value, cookieOptions);
  }

  clear(response: express.Response, name: string) {
    response.clearCookie(name);
  }
}
