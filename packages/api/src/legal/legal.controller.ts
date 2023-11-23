import { Body, Controller, Post } from '@nestjs/common';
import { UpdateCookieConsentRequest } from '@pcpartdb/shared';
import { Context, Ctx } from '../shared/context';
import { CookieService } from '../shared/cookie/cookie.service';
import { COOKIE_CONSENT_COOKIE } from '../shared/cookie/cookies';

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

@Controller('legal')
export class LegalController {
  constructor(private cookieService: CookieService) {}

  @Post('cookie-consent')
  async updateCookieConsent(
    @Body() body: UpdateCookieConsentRequest,
    @Ctx() ctx: Context,
  ) {
    await this.cookieService.save(
      COOKIE_CONSENT_COOKIE,
      body.consent ? '1' : '0',
      { expires: new Date().getTime() + SIX_MONTHS_MS },
      ctx,
    );
  }
}
