'use client';

import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  getLoginPath,
  isInternalServerError,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorAlert } from 'packages/website/src/app/_common/components/Alert/ErrorAlert';
import { PrimaryButton } from 'packages/website/src/app/_common/components/Button/PrimaryButton';
import { Field } from 'packages/website/src/app/_common/components/Field/Field';
import { FieldError } from 'packages/website/src/app/_common/components/Field/FieldError';
import { Form } from 'packages/website/src/app/_common/components/Form/Form';
import { FormActions } from 'packages/website/src/app/_common/components/Form/FormActions';
import { HiddenInput } from 'packages/website/src/app/_common/components/Input/HiddenInput';
import { PasswordInput } from 'packages/website/src/app/_common/components/Input/PasswordInput';
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
import { resetPassword } from 'packages/website/src/app/_common/user/api';
import { setValidationErrors } from 'packages/website/src/app/_common/utils/setValidationErrors';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ResetPasswordFormData {
  token: string;
  password: string;
}

const resetPasswordValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: joiResolver(resetPasswordValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      token,
      password: '',
    },
  });

  const handleReset = useCallback(
    async (formData: ResetPasswordFormData) => {
      setLoading(true);

      try {
        await resetPassword(formData);
        router.push(`${getLoginPath()}?reset_password=true`);
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [setError, router],
  );

  return (
    <>
      <section>
        {errors.token?.type === ValidationErrorType.InvalidToken && (
          <ErrorAlert>
            The reset token is either invalid or has expired.
          </ErrorAlert>
        )}

        {requestError && isInternalServerError(requestError) && (
          <ErrorAlert>
            An unknown error has occurred. Please try again later.
          </ErrorAlert>
        )}
      </section>

      <section>
        <p>
          Please enter the following information to change your account&apos;s
          password.
        </p>

        <Form onSubmit={handleSubmit(handleReset)}>
          <Controller
            name="token"
            control={control}
            render={({ field }) => <HiddenInput {...field} ref={null} />}
          />

          <Field fieldId="password">
            New Password
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
              <span>Change Password</span>
            </PrimaryButton>
          </FormActions>
        </Form>
      </section>

      <section>
        <div className="mt-4 leading-6 text-2xs text-center">
          Remember your password? <a href={getLoginPath()}>Sign in</a>. .
        </div>
      </section>
    </>
  );
}
