import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH,
} from '../../../shared/contact';
import { ValidationErrorType } from '../../../shared/error';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Article, ArticleHeader } from '../../shared/components/article';
import { Button, ButtonVariant } from '../../shared/components/button';
import {
  Field,
  FieldError,
  FieldOptional,
} from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { TextInput } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import { Textarea } from '../../shared/components/textarea';
import { WebsiteLayout } from '../../shared/layouts/website';
import { contactService } from '../contact.service';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const contactValidator = Joi.object({
  name: Joi.string().max(NAME_MAX_LENGTH).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  subject: Joi.string().max(SUBJECT_MAX_LENGTH).allow('', null),
  message: Joi.string().max(MESSAGE_MAX_LENGTH).required(),
}).options({ abortEarly: false });

interface ContactPageProps {}

export const ContactPage = (_props: ContactPageProps) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: joiResolver(contactValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleSend = useCallback(async (formData: ContactFormData) => {
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
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextInput {...field} ref={null} />}
            />
            {errors.name?.type === ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
          </Field>

          <Field>
            Your Email
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextInput {...field} ref={null} />}
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
            <Controller
              name="subject"
              control={control}
              render={({ field }) => <TextInput {...field} ref={null} />}
            />
          </Field>

          <Field>
            Your Message
            <Controller
              name="message"
              control={control}
              render={({ field }) => <Textarea {...field} ref={null} />}
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
