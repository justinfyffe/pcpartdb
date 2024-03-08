'use client';

import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getLoginPath,
  isInternalServerError,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { ErrorAlert } from 'packages/website/src/app/_common/components/Alert/ErrorAlert';
import { SuccessAlert } from 'packages/website/src/app/_common/components/Alert/SuccessAlert';
import { PrimaryButton } from 'packages/website/src/app/_common/components/Button/PrimaryButton';
import { Field } from 'packages/website/src/app/_common/components/Field/Field';
import { FieldError } from 'packages/website/src/app/_common/components/Field/FieldError';
import { Form } from 'packages/website/src/app/_common/components/Form/Form';
import { FormActions } from 'packages/website/src/app/_common/components/Form/FormActions';
import { TextInput } from 'packages/website/src/app/_common/components/Input/TextInput';
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
import { setValidationErrors } from 'packages/website/src/app/_common/utils/setValidationErrors';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { requestPasswordReset } from '../../../_common/user/api';

interface RequestPasswordResetFormData {
  email: string;
}

const requestPasswordResetValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestPasswordResetFormData>({
    resolver: joiResolver(requestPasswordResetValidator),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleRequest = useCallback(
    async (formData: RequestPasswordResetFormData) => {
      setSuccess(false);
      setLoading(true);

      try {
        await requestPasswordReset(formData);
        setSuccess(true);
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setLoading(false);
      }
    },
    [setError],
  );

  return (
    <>
      <section>
        {requestError && isInternalServerError(requestError) && (
          <ErrorAlert>
            An unknown error has occurred. Please try again later.
          </ErrorAlert>
        )}

        {success && (
          <SuccessAlert>
            We have received your request to reset your password. If you have an
            account, then an email should be sent shortly with instructions to
            reset the password.
          </SuccessAlert>
        )}
      </section>

      <section>
        <p>
          Please enter your email to receive instructions on how to reset your
          password.
        </p>

        <Form onSubmit={handleSubmit(handleRequest)}>
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

          <FormActions>
            <PrimaryButton type="submit" disabled={loading}>
              {loading && <Spinner />}
              <span>Submit</span>
            </PrimaryButton>
          </FormActions>
        </Form>
      </section>

      <section>
        <div className="mt-4 leading-6 text-2xs text-center">
          Remember your password?{' '}
          <a href={getLoginPath()} className="no-underline">
            Sign in
          </a>
          .
        </div>
      </section>
    </>
  );
}
