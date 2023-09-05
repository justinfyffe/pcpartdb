import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  User,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import {
  Field,
  FieldError,
  FieldHint,
  FieldOptional,
} from 'packages/website/src/client/shared/components/Field/Field';
import {
  Form,
  FormActions,
} from 'packages/website/src/client/shared/components/Form/Form';
import { PasswordInput } from 'packages/website/src/client/shared/components/Input/PasswordInput';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import { userService } from 'packages/website/src/client/user/userService';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../../../shared/error/utils';

interface UserFormData {
  email: string;
  password: string;
  isStaff: boolean;
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

  const form = useMemo(() => formOptions(user), [user]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormData>(form);

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
        <ErrorAlert>Please fix the form errors and try again.</ErrorAlert>
      )}

      {requestError && !isBadRequestError(requestError) && (
        <ErrorAlert>
          An unknown error has occurred. Please try again later.
        </ErrorAlert>
      )}

      <Field>
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
          <FieldError>Please enter a valid email</FieldError>
        )}
      </Field>

      <Field>
        Password {isUpdate && <FieldOptional>(Optional)</FieldOptional>}
        <Controller
          name="password"
          control={control}
          render={({ field }) => <PasswordInput {...field} ref={null} />}
        />
        {isUpdate && <FieldHint>Leave blank to not change password</FieldHint>}
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

      <FormActions>
        {isUpdate && (
          <WarningButton
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="mr-4"
          >
            {deleting && <Spinner />}
            <span>Delete</span>
          </WarningButton>
        )}

        <PrimaryButton type="submit" disabled={saving || deleting}>
          {saving && <Spinner />}
          <span>Save</span>
        </PrimaryButton>
      </FormActions>
    </Form>
  );
};
