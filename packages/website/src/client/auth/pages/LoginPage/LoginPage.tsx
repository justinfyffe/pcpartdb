import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getAdminOverviewPath,
  getForgotPasswordPath,
  getHomePath,
  getRegisterPath,
  PASSWORD_MAX_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/dist/client/router';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  MetaRobots,
  PasswordInput,
  Seo,
  Spinner,
  TextInput,
} from '../../../shared/components';
import { isForbiddenError, setValidationErrors } from '../../../shared/error';
import { WebsiteLayout } from '../../../shared/layouts';
import { authService } from '../../authService';

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
    router.query.reset_password === 'true',
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
        router.push(getAdminOverviewPath());
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [router, setError],
  );

  const pageTitle = 'Sign in to your Account';
  const seoTitle = `${pageTitle}`;
  const seoRobots = [MetaRobots.NOINDEX];

  const homeHref = useMemo(() => getHomePath(), []);
  const registerHref = useMemo(() => getRegisterPath(), []);
  const forgotPasswordHref = useMemo(() => getForgotPasswordPath(), []);

  return (
    <WebsiteLayout>
      <Seo title={seoTitle} robots={seoRobots} />
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={homeHref}>Home</Breadcrumb>
        <Breadcrumb>{pageTitle}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

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
          <div className="mt-4 leading-6 text-2xs text-center">
            Don&apos;t have an account?{' '}
            <a href={registerHref} className="no-underline">
              Register
            </a>
            .
          </div>

          <div className="leading-6 text-2xs text-center">
            Forgot your password?{' '}
            <a href={forgotPasswordHref} className="no-underline">
              Reset your password
            </a>
            .
          </div>
        </section>
      </article>
    </WebsiteLayout>
  );
};
