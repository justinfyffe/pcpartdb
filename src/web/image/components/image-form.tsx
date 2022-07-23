import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Controller,
  FieldError as FormFieldError,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../types/error';
import {
  createImageValidator,
  Image,
  ImageFormData,
  ImageMeta,
  updateImageValidator,
} from '../../../types/image';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import {
  Field,
  FieldError,
  FieldHint,
  FieldOptional,
} from '../../shared/components/field';
import { File } from '../../shared/components/file';
import { Form, FormActions } from '../../shared/components/form';
import { Input } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { imageService } from '../image.service';
import { formatDimensions, formatFileSize, getImageMeta } from '../image.utils';

interface ImageFormProps {
  image?: Image;
  redirectOnSuccess?: boolean;
  onSuccess?: (image: Image) => void;
}

const formOptions = (image?: Image): UseFormProps<ImageFormData> => ({
  resolver: joiResolver(
    image != null ? updateImageValidator : createImageValidator,
  ),
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

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ImageFormData>(formOptions(image));

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
      const data = { ...formData, fileSize, width, height } as ImageFormData;

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

      <section>
        <div className="flex m-[0_-8px]">
          <Field className="flex-[1_0_0] m-[0_8px_0]">
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

          <Field>
            Path
            <Controller
              name="path"
              control={control}
              render={({ field }) => (
                <Input name="path" {...field} ref={null} />
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
            render={({ field }) => <Input name="name" {...field} ref={null} />}
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
              <Input name="sourceName" {...field} ref={null} />
            )}
          />
          {errors.sourceName?.type ===
            ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>

        <Field>
          Source Url
          <Controller
            name="sourceUrl"
            control={control}
            render={({ field }) => (
              <Input name="sourceUrl" {...field} ref={null} />
            )}
          />
          {errors.sourceUrl?.type ===
            ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>
      </section>

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
