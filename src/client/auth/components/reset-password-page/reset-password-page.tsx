import 'reflect-metadata';
import {
  Alert,
  AlertVariant,
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
  Field,
  FieldError,
  Form,
  FormActions,
  HiddenInput,
  PasswordInput,
  Spinner,
} from '@client/shared/components';
import {
  isInternalServerError,
  setValidationErrors,
} from '@client/shared/error';
import { WebsiteLayout } from '@client/shared/layouts';
import { userService } from '@client/user';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApiError, ValidationErrorType } from '@shared/error';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/user';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
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
      router.push('/');
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
        router.push('/login?resetpassword=true');
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
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Reset Password</h1>
        </ArticleHeader>

        {errors.token?.type === ValidationErrorType.InvalidToken && (
          <Alert variant={AlertVariant.Error}>
            The reset token is either invalid or has expired.
          </Alert>
        )}

        {requestError && isInternalServerError(requestError) && (
          <Alert variant={AlertVariant.Error}>
            An unknown error has occurred. Please try again later.
          </Alert>
        )}

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
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              disabled={loading}
            >
              {loading && <Spinner />}
              <span>Change Password</span>
            </Button>
          </FormActions>
        </Form>

        <div className="mt-4 leading-[24px] text-[12px] text-center">
          Remember your password? <a href="/login">Sign in</a>. .
        </div>
      </Article>
    </WebsiteLayout>
  );
};
