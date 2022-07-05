import * as nodemailer from 'nodemailer';
import { internalServerError } from '../errors/errors';

export interface EmailOptions {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export async function sendEmail(options: EmailOptions) {
  const transporter = nodemailer.createTransport(getSmtpSettings());

  try {
    await transporter.sendMail({
      from: options.from,
      replyTo: options.replyTo,
      to: options.to,
      subject: options.subject,
      text: options.text
    });
  } catch (e) {
    console.error('Error occurred while sending email', e);
    throw internalServerError();
  } finally {
    transporter.close();
  }
}
function getSmtpSettings() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const secure = port === 465;
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;

  return { host, port, secure, auth: { user, pass } };
}
