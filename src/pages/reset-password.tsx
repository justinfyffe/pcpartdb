import 'reflect-metadata';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../types/error';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../types/user';
import { withGuestGuard } from '../web/auth/with-guest-guard';
import { Alert, AlertVariant } from '../web/shared/components/alert';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { Button, ButtonVariant } from '../web/shared/components/button';
import { Field, FieldError } from '../web/shared/components/field';
import { Form, FormActions } from '../web/shared/components/form';
import { Input } from '../web/shared/components/input';
import { Spinner } from '../web/shared/components/spinner';
import {
  isInternalServerError,
  setValidationErrors,
} from '../web/shared/error/error.utils';
import { WebsiteLayout } from '../web/shared/layouts/website';
import { userService } from '../web/user/user.service';

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

const ResetPasswordPage = (props: ResetPasswordPageProps) => {
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
    register,
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
          <Input type="hidden" name="token" {...register('token')} />

          <Field>
            <label>
              New Password
              <Input
                type="password"
                name="password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...register('password', { maxLength: PASSWORD_MAX_LENGTH })}
              />
              {errors.password?.type ===
                ValidationErrorType.MissingStringValue && (
                <FieldError>Required</FieldError>
              )}
              {errors.password?.type === ValidationErrorType.MinLength && (
                <FieldError>Must be at least 5 characters</FieldError>
              )}
            </label>
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

ResetPasswordPage.getInitialProps = (ctx: NextPageContext) => {
  const { token } = ctx.query as { token: string };

  return { token };
};

export default withGuestGuard(ResetPasswordPage);
