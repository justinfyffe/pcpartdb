import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { withGuestGuard } from '../client/auth/with-guest-guard';
import { Alert, AlertVariant } from '../client/shared/components/alert';
import { Article, ArticleHeader } from '../client/shared/components/article';
import { Button, ButtonVariant } from '../client/shared/components/button';
import { Field, FieldError } from '../client/shared/components/field';
import { Form, FormActions } from '../client/shared/components/form';
import { TextInput } from '../client/shared/components/input';
import { Spinner } from '../client/shared/components/spinner';
import {
  isInternalServerError,
  setValidationErrors,
} from '../client/shared/error/error.utils';
import { WebsiteLayout } from '../client/shared/layouts/website';
import { userService } from '../client/user/user.service';
import { ApiError, ValidationErrorType } from '../shared/error';
import { EMAIL_MAX_LENGTH } from '../shared/user';

interface RequestPasswordResetFormData {
  email: string;
}

const requestPasswordResetValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

interface ForgotPasswordPageProps {}

const ForgotPasswordPage = (_props: ForgotPasswordPageProps) => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestPasswordResetFormData>({
    resolver: joiResolver(requestPasswordResetValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleRequest = useCallback(
    async (formData: RequestPasswordResetFormData) => {
      setSuccess(false);
      setLoading(true);

      try {
        await userService.requestPasswordReset(formData);
        setSuccess(true);
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [setError],
  );

  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Forgot your Password?</h1>
        </ArticleHeader>

        {requestError && isInternalServerError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            An unknown error has occurred. Please try again later.
          </Alert>
        )}

        {success && (
          <Alert variant={AlertVariant.Success}>
            We have received your request to reset your password. If you have an
            account, then an email should be sent shortly with instructions to
            reset the password.
          </Alert>
        )}

        <p>
          Please enter your email to receive instructions on how to reset your
          password.
        </p>

        <Form onSubmit={handleSubmit(handleRequest)}>
          <Field>
            Email
            <Controller
              name="email"
              control={control}
              render={({ field }) => <TextInput {...field} ref={null} />}
            />
            {errors.email?.type === ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
            {errors.email?.type === ValidationErrorType.InvalidEmail && (
              <FieldError>Not a valid email</FieldError>
            )}
          </Field>

          <FormActions>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              disabled={loading}
            >
              {loading && <Spinner />}
              <span>Submit</span>
            </Button>
          </FormActions>
        </Form>

        <div className="mt-4 leading-[24px] text-[12px] text-center">
          Remember your password?{' '}
          <a href="/login" className="no-underline">
            Sign in
          </a>
          .
        </div>
      </Article>
    </WebsiteLayout>
  );
};

export default withGuestGuard(ForgotPasswordPage);
