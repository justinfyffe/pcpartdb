import { Injectable } from '@nestjs/common';
import {
  UpdateUserSettingsRequest,
  updateUserSettingsRequestSchema,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { CookieService } from '../shared/cookie/cookie.service';
import { SETTINGS_COOKIE } from '../shared/cookie/cookies';
import { validate } from '../shared/validation/validate';

@Injectable()
export class UserSettingsService {
  constructor(private cookies: CookieService) {}

  async updateUserSettings(request: UpdateUserSettingsRequest, ctx: Context) {
    validate(request, updateUserSettingsRequestSchema);
    const { settings } = request;

    // Save settings
    ctx.config.userSettings = settings;
    const base64Settings = Buffer.from(JSON.stringify(settings)).toString(
      'base64',
    );
    this.cookies.save(SETTINGS_COOKIE, base64Settings, {}, ctx);
  }
}
