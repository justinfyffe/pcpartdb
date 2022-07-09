import 'reflect-metadata';
import { joiResolver } from '@hookform/resolvers/joi';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../types/error';
import {
  EMAIL_MAX_LENGTH,
  RequestPasswordResetFormData,
  requestPasswordResetValidator,
} from '../types/user';
import { withGuestGuard } from '../web/auth/with-guest-guard';
import { Alert, AlertVariant } from '../web/shared/components/alert';
import { Button, ButtonVariant } from '../web/shared/components/button';
import { Field, FieldError } from '../web/shared/components/field';
import { Form, FormActions } from '../web/shared/components/form';
import { Input } from '../web/shared/components/input';
import { Spinner } from '../web/shared/components/spinner';
import {
  isInternalServerError,
  setValidationErrors,
} from '../web/shared/error/error.utils';
import { WebsiteLayout } from '../web/shared/layouts/website';
import { userService } from '../web/user/user.service';

interface ForgotPasswordPageProps {}

const ForgotPasswordPage = (_props: ForgotPasswordPageProps) => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
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
    [],
  );

  return (
    <WebsiteLayout>
      <article>
        <header>
          <h1>Forgot your Password?</h1>
        </header>

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

        <section>
          <p>
            Please enter your email to receive instructions on how to reset your
            password.
          </p>

          <Form onSubmit={handleSubmit(handleRequest)}>
            <Field>
              Email
              <Input
                name="email"
                maxLength={EMAIL_MAX_LENGTH}
                innerRef={register}
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

export default withGuestGuard(ForgotPasswordPage);
