'use client';

import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getAdminOverviewPath,
  getForgotPasswordPath,
  getHomePath,
  getRegisterPath,
  isForbiddenError,
  PASSWORD_MAX_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from 'packages/website/src/app/_common/auth/api';
import { ErrorAlert } from 'packages/website/src/app/_common/components/Alert/ErrorAlert';
import { SuccessAlert } from 'packages/website/src/app/_common/components/Alert/SuccessAlert';
import { PrimaryButton } from 'packages/website/src/app/_common/components/Button/PrimaryButton';
import { Checkbox } from 'packages/website/src/app/_common/components/Checkbox/Checkbox';
import { Field } from 'packages/website/src/app/_common/components/Field/Field';
import { FieldError } from 'packages/website/src/app/_common/components/Field/FieldError';
import { Form } from 'packages/website/src/app/_common/components/Form/Form';
import { FormActions } from 'packages/website/src/app/_common/components/Form/FormActions';
import { PasswordInput } from 'packages/website/src/app/_common/components/Input/PasswordInput';
import { TextInput } from 'packages/website/src/app/_common/components/Input/TextInput';
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
import { setValidationErrors } from 'packages/website/src/app/_common/utils/setValidationErrors';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [registered, setRegistered] = useState(
    searchParams.get('registered') === 'true',
  );
  const [resetPassword, setResetPassword] = useState(
    searchParams.get('reset_password') === 'true',
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
        const response = await login(formData);
        console.log(response);

        router.push(getHomePath());
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
    <>
      <section>
        {requestError && isForbiddenError(requestError) && (
          <ErrorAlert>Your credentials are incorrect.</ErrorAlert>
        )}

        {requestError && !isForbiddenError(requestError) && (
          <ErrorAlert>
            An unknown error has occurred. Please try again later.
          </ErrorAlert>
        )}

        {!requestError && registered && (
          <SuccessAlert>
            You have successfully created an account. You can sign in below.
          </SuccessAlert>
        )}

        {!requestError && resetPassword && (
          <SuccessAlert>
            Your password has changed. You can sign in below.
          </SuccessAlert>
        )}
      </section>

      <section>
        <p>Enter the following credentials to sign in.</p>

        <Form onSubmit={handleSubmit(handleLogin)}>
          <Field fieldId="email">
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

          <Field fieldId="password">
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
            <PrimaryButton type="submit" disabled={loading}>
              {loading && <Spinner />}
              <span>Sign in</span>
            </PrimaryButton>
          </FormActions>
        </Form>
      </section>

      <section>
        <div className="mt-4 leading-6 text-2xs text-center">
          Don&apos;t have an account?{' '}
          <a href={getRegisterPath()} className="no-underline">
            Register
          </a>
          .
        </div>

        <div className="leading-6 text-2xs text-center">
          Forgot your password?{' '}
          <a href={getForgotPasswordPath()} className="no-underline">
            Reset your password
          </a>
          .
        </div>
      </section>
    </>
  );
}
