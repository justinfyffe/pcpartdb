import { ContactRequest } from '../../types/contact';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'contact';

export class ContactService {
  constructor(private api: ApiClient) {}

  async send(data: ContactRequest) {
    return await this.api.post(PATH, data);
  }
}

export const contactService = new ContactService(apiClient);
