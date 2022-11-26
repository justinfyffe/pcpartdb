import 'reflect-metadata';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Field,
  FieldError,
  Form,
  FormActions,
  Spinner,
  TextInput,
} from '@client/shared/components';
import {
  isInternalServerError,
  setValidationErrors,
} from '@client/shared/error';
import { WebsiteLayout } from '@client/shared/layouts';
import { userService } from '@client/user';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApiError, ValidationErrorType } from '@shared/error';
import { EMAIL_MAX_LENGTH } from '@shared/user';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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

export const ForgotPasswordPage = (_props: ForgotPasswordPageProps) => {
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
      <article>
        <h1 className="font-semibold mb-4">Forgot your Password?</h1>

        <section>
          {requestError && isInternalServerError(requestError) && (
            <Alert variant={AlertVariant.Error}>
              An unknown error has occurred. Please try again later.
            </Alert>
          )}

          {success && (
            <Alert variant={AlertVariant.Success}>
              We have received your request to reset your password. If you have
              an account, then an email should be sent shortly with instructions
              to reset the password.
            </Alert>
          )}
        </section>

        <section>
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
              {errors.email?.type ===
                ValidationErrorType.MissingStringValue && (
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
        </section>

        <section>
          <div className="mt-4 leading-[24px] text-[12px] text-center">
            Remember your password?{' '}
            <a href="/login" className="no-underline">
              Sign in
            </a>
            .
          </div>
        </section>
      </article>
    </WebsiteLayout>
  );
};
