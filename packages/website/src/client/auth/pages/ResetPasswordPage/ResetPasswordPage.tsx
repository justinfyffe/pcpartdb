import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  getHomePath,
  getLoginPath,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  HiddenInput,
  PasswordInput,
  Spinner,
} from '../../../shared/components';
import { ErrorAlert } from '../../../shared/components/Alert/ErrorAlert';
import { Breadcrumb } from '../../../shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../../shared/components/Breadcrumbs/Breadcrumbs';
import { PrimaryButton } from '../../../shared/components/Button/PrimaryButton';
import { Field, FieldError } from '../../../shared/components/Field/Field';
import { Form, FormActions } from '../../../shared/components/Form/Form';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import {
  isInternalServerError,
  setValidationErrors,
} from '../../../shared/error';
import { WebsiteLayout } from '../../../shared/layouts';
import { userService } from '../../../user';

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

interface ResetPasswordPageProps {
  token: string;
}

export const ResetPasswordPage = (props: ResetPasswordPageProps) => {
  const { token } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [requestError, setRequestError] = useState<ApiError>(null);

  useEffect(() => {
    if (token == null) {
      router.push(getHomePath());
    }
  }, [router, token]);

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
        await userService.resetPassword(formData);
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

  const pageTitle = 'Reset Password';
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

            <Field>
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
            Remember your password? <a href={loginHref}>Sign in</a>. .
          </div>
        </section>
      </article>
    </WebsiteLayout>
  );
};
