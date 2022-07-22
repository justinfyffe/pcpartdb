import 'reflect-metadata';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../types/error';
import { createUserValidator, UserFormData } from '../types/user';
import { authService } from '../web/auth/auth.service';
import { withGuestGuard } from '../web/auth/with-guest-guard';
import { Alert, AlertVariant } from '../web/shared/components/alert';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { Button, ButtonVariant } from '../web/shared/components/button';
import { Field, FieldError } from '../web/shared/components/field';
import { Form, FormActions } from '../web/shared/components/form';
import { Input } from '../web/shared/components/input';
import { Spinner } from '../web/shared/components/spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from '../web/shared/error/error.utils';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface RegisterPageProps {}

const RegisterPage = (_props: RegisterPageProps) => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: joiResolver(createUserValidator),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = useCallback(
    async (data: UserFormData) => {
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
              render={({ field }) => <Input {...field} ref={null} />}
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
              render={({ field }) => (
                <Input type="password" {...field} ref={null} />
              )}
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

export default withGuestGuard(RegisterPage);
