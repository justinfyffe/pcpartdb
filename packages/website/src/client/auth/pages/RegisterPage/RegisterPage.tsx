import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getHomePath,
  getLoginPath,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Breadcrumb,
  Breadcrumbs,
  Button,
  ButtonVariant,
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
import { ErrorAlert } from '../../../shared/components/Alert/ErrorAlert';
import { isBadRequestError, setValidationErrors } from '../../../shared/error';
import { WebsiteLayout } from '../../../shared/layouts';
import { authService } from '../../authService';

interface RegisterFormData {
  email: string;
  password: string;
}

const registerValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

interface RegisterPageProps {}

export const RegisterPage = (_props: RegisterPageProps) => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerValidator),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = useCallback(
    async (data: RegisterFormData) => {
      setLoading(true);

      try {
        await authService.register(data);
        router.push(`${getLoginPath()}?registered=true`);
      } catch (err) {
        setRequestError(err);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [router, setError],
  );

  const pageTitle = 'Create Account';
  const seoTitle = `${pageTitle}`;
  const seoRobots = [MetaRobots.NOINDEX];

  const homeHref = useMemo(() => getHomePath(), []);
  const loginHref = useMemo(() => getLoginPath(), []);

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
          {requestError && isBadRequestError(requestError) && (
            <ErrorAlert>Please correct the errors and try again.</ErrorAlert>
          )}

          {requestError && !isBadRequestError(requestError) && (
            <ErrorAlert>
              An unknown error has occurred. Please try again later.
            </ErrorAlert>
          )}
        </section>

        <section>
          <p>Enter the following information to create an account.</p>

          <Form onSubmit={handleSubmit(handleRegister)}>
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
              {errors.email?.type === ValidationErrorType.EmailExists && (
                <FieldError>
                  An account associated with this email already exists
                </FieldError>
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
              {errors.password?.type === ValidationErrorType.MinLength && (
                <FieldError>Must be at least 5 characters</FieldError>
              )}
            </Field>

            <FormActions>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={loading}
              >
                {loading && <Spinner />}
                <span>Create account</span>
              </Button>
            </FormActions>
          </Form>
        </section>

        <section>
          <div className="mt-4 leading-6 text-2xs text-center">
            Already have an account?{' '}
            <a href={loginHref} className="no-underline">
              Sign in here
            </a>
            .
          </div>
        </section>
      </article>
    </WebsiteLayout>
  );
};
