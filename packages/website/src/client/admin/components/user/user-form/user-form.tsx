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
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Field,
  FieldError,
  FieldHint,
  FieldOptional,
  Form,
  FormActions,
  PasswordInput,
  Spinner,
  TextInput,
} from '../../../../shared/components';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../../../shared/error';
import { userService } from '../../../../user';

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
        <Alert variant={AlertVariant.Error}>
          Please fix the form errors and try again.
        </Alert>
      )}

      {requestError && !isBadRequestError(requestError) && (
        <Alert variant={AlertVariant.Error}>
          An unknown error has occurred. Please try again later.
        </Alert>
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
