import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApiError, ValidationErrorType } from '@pcpartdb/shared/error';
import { CreateImageRequest, Image, ImageMeta } from '@pcpartdb/shared/image';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Controller,
  FieldError as FormFieldError,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import {
  formatDimensions,
  formatFileSize,
  getImageMeta,
  imageService,
} from '../../../../image';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Field,
  FieldError,
  FieldHint,
  FieldOptional,
  File,
  Form,
  FormActions,
  Spinner,
  TextInput,
} from '../../../../shared/components';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../../../shared/error';

interface ImageFormData {
  path: string;
  name: string;

  sourceName?: string;
  sourceUrl?: string;

  file?: File;
}

const imageValidator = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  sourceName: Joi.string().allow('', null),
  sourceUrl: Joi.string().allow('', null),
  file: Joi.any(),
}).options({ abortEarly: false });

interface ImageFormProps {
  image?: Image;
  redirectOnSuccess?: boolean;
  onSuccess?: (image: Image) => void;
}

const formOptions = (image?: Image): UseFormProps<ImageFormData> => ({
  resolver: joiResolver(imageValidator),
  mode: 'onBlur',
  defaultValues: {
    path: image?.path ?? '',
    name: image?.name ?? '',
    sourceName: image?.sourceName ?? '',
    sourceUrl: image?.sourceUrl ?? '',
  },
});

export const ImageForm: FunctionComponent<ImageFormProps> = (props) => {
  const { image, redirectOnSuccess = true, onSuccess } = props;
  const isUpdate = image != null;

  const router = useRouter();
  const [imageMeta, setImageMeta] = useState<ImageMeta>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const form = useMemo(() => formOptions(image), [image]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateImageRequest>(form);

  // https://github.com/react-hook-form/react-hook-form/issues/127
  useEffect(() => {
    register('file');
  }, [register]);

  const handleSave = useCallback(
    async (formData: ImageFormData) => {
      setSaving(true);

      const fileSize = imageMeta?.fileSize ?? image?.fileSize;
      const width = imageMeta?.width ?? image?.width;
      const height = imageMeta?.height ?? image?.height;
      const data: CreateImageRequest = { ...formData, fileSize, width, height };

      try {
        const savedImage = isUpdate
          ? await imageService.update(image.id, data)
          : await imageService.create(data);

        onSuccess?.(savedImage);

        if (redirectOnSuccess) {
          router.push('/admin/images');
        }
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [
      image,
      imageMeta,
      isUpdate,
      redirectOnSuccess,
      router,
      setError,
      onSuccess,
    ],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await imageService.delete(image.id);

      if (redirectOnSuccess) {
        router.push('/admin/images');
      }
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [image, redirectOnSuccess, router, setError]);

  const handleFileChange = useCallback(
    async (file: File) => {
      setImageMeta(await getImageMeta(file));
      setValue('file', file);
      if (!isUpdate) {
        setValue('path', file.name);
      }
    },
    [isUpdate, setValue],
  );

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

      <div className="flex -mx-2">
        <Field className="flex-1 mx-2">
          File {isUpdate && <FieldOptional>(Optional)</FieldOptional>}
          <File name="file" onChange={handleFileChange} />
          {(errors.file as unknown as FormFieldError)?.type ===
            ValidationErrorType.MissingRequiredAny && (
            <FieldError>Required</FieldError>
          )}
          {imageMeta == null && isUpdate && (
            <FieldHint>
              Uploading a new file will replace the previous file.
            </FieldHint>
          )}
          {imageMeta != null && (
            <FieldHint className="flex justify-between">
              <span>Size: {formatFileSize(imageMeta.fileSize)}</span>
              <span>
                Dimensions:{' '}
                {formatDimensions(imageMeta.width, imageMeta.height)}
              </span>
            </FieldHint>
          )}
        </Field>

        <Field className="flex-1 mx-2">
          Path
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <TextInput name="path" {...field} ref={null} />
            )}
          />
          {errors.path?.type === ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>
      </div>

      <Field>
        Name
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput name="name" {...field} ref={null} />
          )}
        />
        {errors.name?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Source Name
        <Controller
          name="sourceName"
          control={control}
          render={({ field }) => (
            <TextInput name="sourceName" {...field} ref={null} />
          )}
        />
        {errors.sourceName?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Source Url
        <Controller
          name="sourceUrl"
          control={control}
          render={({ field }) => (
            <TextInput name="sourceUrl" {...field} ref={null} />
          )}
        />
        {errors.sourceUrl?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <FormActions>
        {isUpdate && (
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            disabled={saving || deleting}
            onClick={handleDelete}
          >
            {deleting && <Spinner />}
            <span>Delete</span>
          </Button>
        )}
        {isUpdate && (
          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            disabled={saving || deleting}
          >
            {saving && <Spinner />}
            <span>Save</span>
          </Button>
        )}
        {!isUpdate && (
          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            disabled={saving}
          >
            {saving && <Spinner />}
            <span>Upload</span>
          </Button>
        )}
      </FormActions>
    </Form>
  );
};
