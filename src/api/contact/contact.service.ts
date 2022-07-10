import { Injectable } from '@nestjs/common';
import { ContactFormData, contactValidator } from '../../types/contact';
import { sendEmail } from '../shared/email/email.utils';
import { internalServerError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';

@Injectable()
export class ContactService {
  constructor() {}

  async send(data: ContactFormData, _ctx: ServiceContext) {
    validate(data, contactValidator);

    const websiteEmail = process.env.WEBSITE_EMAIL;
    if (!websiteEmail) {
      throw internalServerError();
    }

    await sendEmail({
      from: 'Finest PC <hello@finestpc.com>',
      replyTo: data.email,
      to: websiteEmail,
      subject: data.subject,
      text: data.message,
    });
  }
}
