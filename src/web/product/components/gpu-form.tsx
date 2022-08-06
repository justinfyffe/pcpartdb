import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../types/error';
import {
  GpuProduct,
  ProductRequest,
  ProductType,
} from '../../../types/product';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
} from '../../../types/product-benchmark';
import { ProductMeta, ProductMetaKey } from '../../../types/product-meta';
import { ProductSpec, ProductSpecKey } from '../../../types/product-spec';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Field, FieldError } from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { Input } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import { Textarea } from '../../shared/components/textarea';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { productService } from '../product.service';

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;
  description: string;
}

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  description: Joi.string().optional(),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: GpuProduct;
}

function formOptions(gpu?: GpuProduct): UseFormProps<ProductFormData> {
  const meta = getMetaMap(gpu);
  const specs = getSpecsMap(gpu);
  const benchmarks = getBenchmarksMap(gpu);

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug ?? '',
      type: ProductType.GPU,
      name: gpu?.name ?? '',
      description:
        (meta.get(ProductMetaKey.Description)?.value as string) ?? '',
    },
  };
}

export const GpuForm: FunctionComponent<GpuFormProps> = (props) => {
  const { gpu } = props;
  const isUpdate = gpu != null;

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>(formOptions(gpu));

  const handleSave = useCallback(
    async (formData: ProductFormData) => {
      setSaving(true);

      const request: ProductRequest = {
        ...formData,
        meta: toMetaArray(formData),
        specs: toSpecsArray(formData),
        benchmarks: toBenchmarksArray(formData),
      };

      try {
        if (isUpdate) {
          await productService.update(gpu.id, request);
        } else {
          await productService.create(request);
        }
        router.push('/admin/users');
      } catch (err) {
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [gpu, isUpdate, router, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await productService.delete(gpu.id);
      router.push('/admin/gpus');
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [gpu, router, setError]);

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
        Name
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} ref={null} />}
        />
        {errors.name?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Slug
        <Controller
          name="slug"
          control={control}
          render={({ field }) => <Input {...field} ref={null} />}
        />
        {errors.name?.type === ValidationErrorType.MissingStringValue && (
          <FieldError>Required</FieldError>
        )}
      </Field>

      <Field>
        Description
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} ref={null} />}
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

function getMetaMap(gpu?: GpuProduct) {
  const map = new Map<ProductMetaKey, ProductMeta>();

  gpu?.meta?.forEach((meta) => {
    map.set(meta.key, meta);
  });

  return map;
}

function toMetaArray(formData: ProductFormData): ProductMeta[] {
  return [
    {
      key: ProductMetaKey.Description,
      value: formData.description,
    },
  ];
}

function getSpecsMap(gpu?: GpuProduct) {
  const map = new Map<ProductSpecKey, ProductSpec>();

  gpu?.specs?.forEach((spec) => {
    map.set(spec.key, spec);
  });

  return map;
}

function toSpecsArray(_formData: ProductFormData): ProductSpec[] {
  return [];
}

function getBenchmarksMap(gpu?: GpuProduct) {
  const map = new Map<ProductBenchmarkKey, ProductBenchmark>();

  gpu?.benchmarks?.forEach((benchmark) => {
    map.set(benchmark.key, benchmark);
  });

  return map;
}

function toBenchmarksArray(_formData: ProductFormData): ProductBenchmark[] {
  return [];
}
