import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/dist/client/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../shared/error';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '../../../shared/user';
import { authService } from '../../auth/auth.service';
import { withGuestGuard } from '../../auth/with-guest-guard';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Article, ArticleHeader } from '../../shared/components/article';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Checkbox } from '../../shared/components/checkbox';
import { Field, FieldError } from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { PasswordInput, TextInput } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import {
  isForbiddenError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { WebsiteLayout } from '../../shared/layouts/website';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const loginFormValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string().max(PASSWORD_MAX_LENGTH).required(),
  remember: Joi.boolean(),
}).options({ abortEarly: false });

interface LoginPageProps {}

const LoginPageImpl: FunctionComponent<LoginPageProps> = (
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
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginFormValidator),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
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
      <Article>
        <ArticleHeader>
          <h1>Sign in to your Account</h1>
        </ArticleHeader>

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

        <p>Enter the following credentials to sign in.</p>

        <Form onSubmit={handleSubmit(handleLogin)}>
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

          <Field>
            Password
            <Controller
              name="password"
              control={control}
              render={({ field }) => <PasswordInput {...field} ref={null} />}
            />
            {errors.password?.type ===
              ValidationErrorType.MissingStringValue && (
              <FieldError>Required</FieldError>
            )}
          </Field>

          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox className="pb-6" {...field} ref={null}>
                Remember me
              </Checkbox>
            )}
          />

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
      </Article>
    </WebsiteLayout>
  );
};

export const LoginPage = withGuestGuard(LoginPageImpl);
