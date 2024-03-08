'use client';

import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getLoginPath,
  isBadRequestError,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/navigation';
import { ErrorAlert } from 'packages/website/src/app/_common/components/Alert/ErrorAlert';
import { PrimaryButton } from 'packages/website/src/app/_common/components/Button/PrimaryButton';
import { Field } from 'packages/website/src/app/_common/components/Field/Field';
import { FieldError } from 'packages/website/src/app/_common/components/Field/FieldError';
import { Form } from 'packages/website/src/app/_common/components/Form/Form';
import { FormActions } from 'packages/website/src/app/_common/components/Form/FormActions';
import { PasswordInput } from 'packages/website/src/app/_common/components/Input/PasswordInput';
import { TextInput } from 'packages/website/src/app/_common/components/Input/TextInput';
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
import { register } from 'packages/website/src/app/_common/user/api';
import { setValidationErrors } from 'packages/website/src/app/_common/utils/setValidationErrors';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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

export function RegisterForm() {
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
        await register(data);
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

  return (
    <>
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
            {errors.email?.type === ValidationErrorType.EmailExists && (
              <FieldError>
                An account associated with this email already exists
              </FieldError>
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
            {errors.password?.type === ValidationErrorType.MinLength && (
              <FieldError>Must be at least 5 characters</FieldError>
            )}
          </Field>

          <FormActions>
            <PrimaryButton type="submit" disabled={loading}>
              {loading && <Spinner />}
              <span>Create account</span>
            </PrimaryButton>
          </FormActions>
        </Form>
      </section>

      <section>
        <div className="mt-4 leading-6 text-2xs text-center">
          Already have an account?{' '}
          <a href={getLoginPath()} className="no-underline">
            Sign in here
          </a>
          .
        </div>
      </section>
    </>
  );
}
