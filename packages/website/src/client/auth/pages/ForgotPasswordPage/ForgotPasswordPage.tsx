import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  getLoginPath,
  ValidationErrorType,
} from '@pcpartdb/shared';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorAlert } from '../../../shared/components/Alert/ErrorAlert';
import { SuccessAlert } from '../../../shared/components/Alert/SuccessAlert';
import { PrimaryButton } from '../../../shared/components/Button/PrimaryButton';
import { Field, FieldError } from '../../../shared/components/Field/Field';
import { Form, FormActions } from '../../../shared/components/Form/Form';
import { TextInput } from '../../../shared/components/Input/TextInput';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import { Spinner } from '../../../shared/components/Spinner/Spinner';
import {
  isInternalServerError,
  setValidationErrors,
} from '../../../shared/error/utils';
import { WebsiteLayout } from '../../../shared/layouts/website/WebsiteLayout';
import { userService } from '../../../user/userService';

interface RequestPasswordResetFormData {
  email: string;
}

const requestPasswordResetValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

interface ForgotPasswordPageProps {}

export const ForgotPasswordPage = (_props: ForgotPasswordPageProps) => {
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
        await userService.requestPasswordReset(formData);
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

  const pageTitle = 'Forgot your Password?';
  const seoTitle = `${pageTitle}`;
  const seoRobots = [MetaRobots.NOINDEX];

  return (
    <WebsiteLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <section>
          {requestError && isInternalServerError(requestError) && (
            <ErrorAlert>
              An unknown error has occurred. Please try again later.
            </ErrorAlert>
          )}

          {success && (
            <SuccessAlert>
              We have received your request to reset your password. If you have
              an account, then an email should be sent shortly with instructions
              to reset the password.
            </SuccessAlert>
          )}
        </section>

        <section>
          <p>
            Please enter your email to receive instructions on how to reset your
            password.
          </p>

          <Form onSubmit={handleSubmit(handleRequest)}>
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
      </article>
    </WebsiteLayout>
  );
};
