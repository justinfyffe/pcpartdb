import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../shared/error';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../shared/user';
import { authService } from '../../auth/auth.service';
import { withGuestGuard } from '../../auth/with-guest-guard';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Article, ArticleHeader } from '../../shared/components/article';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Field, FieldError } from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { PasswordInput, TextInput } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { WebsiteLayout } from '../../shared/layouts/website';

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

const RegisterPageImpl = (_props: RegisterPageProps) => {
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
        router.push('/login?registered=true');
      } catch (err) {
        setRequestError(err);
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
          <h1>Create Account</h1>
        </ArticleHeader>

        {requestError && isBadRequestError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            Please correct the errors and try again.
          </Alert>
        )}

        {requestError && !isBadRequestError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            An unknown error has occurred. Please try again later.
          </Alert>
        )}

        <p>Enter the following information to create an account.</p>

        <Form onSubmit={handleSubmit(handleRegister)}>
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

        <div className="mt-4 leading-[24px] text-[12px] text-center">
          Already have an account?{' '}
          <a href="/login" className="no-underline">
            Sign in here
          </a>
          .
        </div>
      </Article>
    </WebsiteLayout>
  );
};

export const RegisterPage = withGuestGuard(RegisterPageImpl);
