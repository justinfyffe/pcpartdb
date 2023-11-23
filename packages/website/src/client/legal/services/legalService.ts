import { joinUrlParts, UpdateCookieConsentRequest } from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';

const PATH = 'legal';

export class LegalService {
  constructor(private api: ApiClient) {}

  async updateCookieConsent(request: UpdateCookieConsentRequest) {
    const path = joinUrlParts(PATH, 'cookie-consent');
    await this.api.post(path, request);
  }
}

export const legalService = new LegalService(apiClient);
