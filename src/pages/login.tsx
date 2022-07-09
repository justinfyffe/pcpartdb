import 'reflect-metadata';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/dist/client/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginValidator } from '../types/auth';
import { ApiError, ValidationErrorType } from '../types/error';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '../types/user';
import { authService } from '../web/auth/auth.service';
import { withGuestGuard } from '../web/auth/with-guest-guard';
import { Alert, AlertVariant } from '../web/shared/components/alert';
import { Button, ButtonVariant } from '../web/shared/components/button';
import { Checkbox } from '../web/shared/components/checkbox';
import { Field, FieldError } from '../web/shared/components/field';
import { Form, FormActions } from '../web/shared/components/form';
import { Input } from '../web/shared/components/input';
import { Spinner } from '../web/shared/components/spinner';
import {
  isForbiddenError,
  setValidationErrors,
} from '../web/shared/error/error.utils';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = (
  _props: LoginPageProps,
) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [registered, setRegistered] = useState(
    router.query.registered === 'true',
  );
  const [resetPassword, setResetPassword] = useState(
    router.query.resetpassword === 'true',
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleLogin = useCallback(
    async (formData: LoginFormData) => {
      setRegistered(false);
      setResetPassword(false);
      setLoading(true);

      try {
        await authService.login(formData);
        router.push('/admin');
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [router, setError],
  );

  return (
    <WebsiteLayout>
      <article>
        <header>
          <h1>Sign in to your Account</h1>
        </header>

        {requestError && isForbiddenError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            Your credentials are incorrect.
          </Alert>
        )}

        {requestError && !isForbiddenError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            An unknown error has occurred. Please try again later.
          </Alert>
        )}

        {!requestError && registered && (
          <Alert variant={AlertVariant.Success}>
            You have successfully created an account. You can sign in below.
          </Alert>
        )}

        {!requestError && resetPassword && (
          <Alert variant={AlertVariant.Success}>
            Your password has changed. You can sign in below.
          </Alert>
        )}

        <section>
          <p>Enter the following credentials to sign in.</p>

          <Form onSubmit={handleSubmit(handleLogin)}>
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

            <Field>
              Password
              <Input
                type="password"
                name="password"
                maxLength={PASSWORD_MAX_LENGTH}
                innerRef={register}
              />
              {errors.password?.type ===
                ValidationErrorType.MissingStringValue && (
                <FieldError>Required</FieldError>
              )}
            </Field>

            <Checkbox name="remember" innerRef={register}>
              Remember me
            </Checkbox>

            <FormActions>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={loading}
              >
                {loading && <Spinner />}
                <span>Sign in</span>
              </Button>
            </FormActions>
          </Form>

          <div className="mt-4 leading-[24px] text-[12px] text-center">
            Don&apos;t have an account?{' '}
            <a href="/register" className="no-underline">
              Register
            </a>
            .
          </div>

          <div className="leading-[24px] text-[12px] text-center">
            Forgot your password?{' '}
            <a href="/forgot-password" className="no-underline">
              Reset your password
            </a>
            .
          </div>
        </section>
      </article>
    </WebsiteLayout>
  );
};

export default withGuestGuard(LoginPage);
