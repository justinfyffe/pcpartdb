import { ContactRequest } from '../../shared/contact';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'contact';

export class ContactService {
  constructor(private api: ApiClient) {}

  async send(data: ContactRequest) {
    await this.api.post(PATH, data);
  }
}

export const contactService = new ContactService(apiClient);
