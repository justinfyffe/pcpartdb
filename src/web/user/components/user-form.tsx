import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../types/error';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  User,
} from '../../../types/user';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Checkbox } from '../../shared/components/checkbox';
import {
  Field,
  FieldError,
  FieldHint,
  FieldOptional,
} from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { Input } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { userService } from '../user.service';

interface UserFormData {
  email: string;
  password?: string;
  isStaff?: boolean;
}

const createUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

const updateUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .allow(null, '')
    .optional(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

interface UserFormProps {
  user?: User;
}

const formOptions = (user?: User): UseFormProps<UserFormData> => ({
  resolver: joiResolver(
    user != null ? updateUserValidator : createUserValidator,
  ),
  mode: 'onBlur',
  defaultValues: {
    email: user?.email ?? '',
    password: '',
    isStaff: user?.isStaff ?? false,
  },
});

export const UserForm: FunctionComponent<UserFormProps> = (props) => {
  const { user } = props;
  const isUpdate = user != null;

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormData>(formOptions(user));

  const handleSave = useCallback(
    async (formData: UserFormData) => {
      setSaving(true);

      try {
        if (isUpdate) {
          await userService.update(user.id, formData);
        } else {
          await userService.create(formData);
        }
        router.push('/admin/users');
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [user, isUpdate, router, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await userService.delete(user.id);
      router.push('/admin/users');
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [user, router, setError]);

  return (
    <Form onSubmit={handleSubmit(handleSave)}>
      {requestError && isBadRequestError(requestError) && (
        <Alert variant={AlertVariant.Error}>
          Please fix the form errors and try again.
        </Alert>
      )}

      {requestError && !isBadRequestError(requestError) && (
        <Alert variant={AlertVariant.Error}>
          An unknown error has occurred. Please try again later.
        </Alert>
      )}

      <section>
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
            <FieldError>Please enter a valid email</FieldError>
          )}
        </Field>

        <Field>
          Password {isUpdate && <FieldOptional>(Optional)</FieldOptional>}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input type="password" {...field} ref={null} />
            )}
          />
          {isUpdate && (
            <FieldHint>Leave blank to not change password</FieldHint>
          )}
          {errors.password?.type === ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>

        <Field>
          <Controller
            name="isStaff"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} ref={null}>
                Staff
              </Checkbox>
            )}
          />
        </Field>
      </section>

      <FormActions>
        {isUpdate && (
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            onClick={handleDelete}
            disabled={saving || deleting}
            className="mr-4"
          >
            {deleting && <Spinner />}
            <span>Delete</span>
          </Button>
        )}

        <Button
          type="submit"
          variant={ButtonVariant.Primary}
          disabled={saving || deleting}
        >
          {saving && <Spinner />}
          <span>Save</span>
        </Button>
      </FormActions>
    </Form>
  );
};
