import 'reflect-metadata';
import { joiResolver } from '@hookform/resolvers/joi';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  contactValidator,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH,
} from '../types/contact';
import { ValidationErrorType } from '../types/error';
import { contactService } from '../web/contact/contact.service';
import { Alert, AlertVariant } from '../web/shared/components/alert';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { Button, ButtonVariant } from '../web/shared/components/button';
import {
  Field,
  FieldError,
  FieldOptional,
} from '../web/shared/components/field';
import { Form, FormActions } from '../web/shared/components/form';
import { Input } from '../web/shared/components/input';
import { Spinner } from '../web/shared/components/spinner';
import { Textarea } from '../web/shared/components/textarea';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface ContactPageProps {}

interface FormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const ContactPage = (_props: ContactPageProps) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: joiResolver(contactValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleSend = useCallback(async (formData: FormData) => {
    setSuccess(false);
    setFailed(false);
    setSending(true);

    try {
      const subject = `Contact Us: ${formData.subject}`;
      const message = `Name: ${formData.name}\nEmail: ${formData.email}\n\nSubject:\n${formData.subject}\n\nMessage:\n${formData.message}`;

      await contactService.send({
        ...formData,
        subject,
        message,
      });
      setSuccess(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }, []);

  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Contact Us</h1>
        </ArticleHeader>

        {success && (
          <Alert variant={AlertVariant.Success}>
            Your message has been sent to us. We will try to respond as soon as
            possible.
          </Alert>
        )}

        {failed && (
          <Alert variant={AlertVariant.Error}>
            An error has occurred. Please try again later.
          </Alert>
        )}

        <p>Please fill in the following details to contact us.</p>

        <Form onSubmit={handleSubmit(handleSend)}>
          <Field>
            Your Name
            <Input
              name="name"
              {...register('name', { maxLength: NAME_MAX_LENGTH })}
            />
            {errors.name?.type === ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
          </Field>

          <Field>
            Your Email
            <Input
              name="email"
              {...register('email', { maxLength: EMAIL_MAX_LENGTH })}
            />
            {errors.email?.type === ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
            {errors.email?.type === ValidationErrorType.InvalidEmail && (
              <FieldError>Please enter a valid email</FieldError>
            )}
          </Field>

          <Field>
            Subject <FieldOptional>(Optional)</FieldOptional>
            <Input
              name="subject"
              {...register('subject', { maxLength: SUBJECT_MAX_LENGTH })}
            />
          </Field>

          <Field>
            Your Message
            <Textarea
              name="message"
              {...register('message', { maxLength: MESSAGE_MAX_LENGTH })}
            />
            {errors.message?.type ===
              ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
          </Field>

          <FormActions>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              disabled={sending}
            >
              {sending && <Spinner />}
              <span>Send</span>
            </Button>
          </FormActions>
        </Form>
      </Article>
    </WebsiteLayout>
  );
};

export default ContactPage;
