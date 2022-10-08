import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { sendEmail } from '@server/shared/email/email-utils';
import { internalServerError } from '@server/shared/errors/errors';
import { ServiceContext } from '@server/shared/service/context';
import { validate } from '@server/shared/types/validate';
import {
  ContactRequest,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH,
} from '@shared/contact';
import { EMAIL_MAX_LENGTH } from '@shared/user';

const contactValidator = Joi.object({
  name: Joi.string().max(NAME_MAX_LENGTH).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  subject: Joi.string().max(SUBJECT_MAX_LENGTH).allow('', null),
  message: Joi.string().max(MESSAGE_MAX_LENGTH).required(),
}).options({ abortEarly: false });

@Injectable()
export class ContactService {
  constructor() {}

  async send(data: ContactRequest, _ctx: ServiceContext) {
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
