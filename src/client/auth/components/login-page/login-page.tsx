import 'reflect-metadata';
import {
  Alert,
  AlertVariant,
  Breadcrumb,
  Breadcrumbs,
  Button,
  ButtonVariant,
  Checkbox,
  Field,
  FieldError,
  Form,
  FormActions,
  PasswordInput,
  Spinner,
  TextInput,
} from '@client/shared/components';
import { isForbiddenError, setValidationErrors } from '@client/shared/error';
import { WebsiteLayout } from '@client/shared/layouts';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApiError, ValidationErrorType } from '@shared/error';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@shared/user';
import { useRouter } from 'next/dist/client/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { authService } from '../../auth-service';

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

export const LoginPage: FunctionComponent<LoginPageProps> = (
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
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>Sign in</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">Sign in to your Account</h1>

        <section>
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
        </section>

        <section>
          <p>Enter the following credentials to sign in.</p>

          <Form onSubmit={handleSubmit(handleLogin)}>
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
        </section>

        <section>
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
