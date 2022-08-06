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
import { ProductReview, ProductReviewKey } from '../../../types/product-review';
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

interface ProductReviewFormData {
  key: ProductReviewKey;
  value: number;
  source?: string;
}

interface ProductBenchmarkFormData {
  key: ProductBenchmarkKey;
  value: number;
  source?: string;
}

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;
  description?: string;
  company?: string;
  generation?: string;
  marketSegment?: string;
  launchPrice?: number;
  releaseDate?: string;
  productionStatus?: string;

  // Processor
  gpuName?: string;
  architecture?: string;
  foundry?: string;
  processSize?: number;
  transistors?: number;
  dieSize?: number;

  // Board Compatibility & Dimensions
  slotWidth?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  busInterface?: string;
  tdp?: number;
  suggestedPsu?: number;
  powerConnectors?: string;

  // Cores & Clock Speeds
  cudaCores?: number;
  tmus?: number;
  rops?: number;
  tensorCores?: number;
  rtCores?: number;
  baseClock?: number;
  boostClock?: number;
  l1Cache?: number;
  l2Cache?: number;

  // Theoretical Performance
  pixelRate?: number;
  textureRate?: number;
  fp32Performance?: number;
  fp64Performance?: number;

  // Memory
  memorySize?: number;
  memoryType?: string;
  memoryInterface?: number;
  memoryBandwidth?: number;

  // Display Connectivity
  maxResolution?: string;
  displayPorts?: string;
  hdmiPorts?: string;
  usbC?: string;
  dualLinkDvi?: string;
  singleLinkDvi?: string;
  vga?: string;

  // API Support
  directX?: number;
  gSyncFreeSync?: boolean;
  sliCrossfire?: boolean;
  vrReady?: boolean;
  openCl?: number;
  openGl?: number;
  shaderModel?: number;

  reviews?: ProductReviewFormData[];
  benchmarks?: ProductBenchmarkFormData[];
}

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  company: Joi.string().optional(),
  generation: Joi.string().optional(),
  marketSegment: Joi.string().optional(),
  launchPrice: Joi.number().optional(),
  releaseDate: Joi.string().optional(),
  productionStatus: Joi.string().optional(),

  // Processor
  gpuName: Joi.string().optional(),
  architecture: Joi.string().optional(),
  foundry: Joi.string().optional(),
  processSize: Joi.number().optional(),
  transistors: Joi.number().optional(),
  dieSize: Joi.number().optional(),
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
        (meta.get(ProductMetaKey.Description)?.value as string) ?? undefined,
      company: undefined,
      generation: undefined,
      marketSegment: undefined,
      launchPrice: undefined,
      releaseDate: undefined,
      productionStatus: undefined,

      // Processor
      gpuName: undefined,
      architecture: undefined,
      foundry: undefined,
      processSize: undefined,
      transistors: undefined,
      dieSize: undefined,
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
        reviews: toReviewsArray(formData),
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

      <section>
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
      </section>

      <section>
        <h2>General Info</h2>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>

        <Field>
          Generation
          <Controller
            name="generation"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>

        <Field>
          Launch Price
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>

        <Field>
          Release Date
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>

        <Field>
          Production Status
          <Controller
            name="productionStatus"
            control={control}
            render={({ field }) => <Input {...field} ref={null} />}
          />
        </Field>
      </section>

      <section>
        <h2>Technical Specs</h2>

        <section>
          <h3>Processor</h3>

          <Field>
            GPU Name
            <Controller
              name="gpuName"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Foundry
            <Controller
              name="foundry"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Die Size
            <Controller
              name="dieSize"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3>Board Compatibility &amp; Dimensions</h3>
        </section>

        <section>
          <h3>Cores &amp; Clock Speeds</h3>
        </section>

        <section>
          <h3>Theoretical Performance</h3>
        </section>

        <section>
          <h3>Memory</h3>
        </section>

        <section>
          <h3>Display Connectivity</h3>
        </section>

        <section>
          <h3>API Support</h3>
        </section>
      </section>

      <section>
        <h2>Benchmarks</h2>
      </section>

      <section>
        <h2>Reviews</h2>
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

function getReviewsMap(gpu?: GpuProduct) {
  const map = new Map<ProductReviewKey, ProductReview>();

  gpu?.reviews?.forEach((review) => {
    map.set(review.key, review);
  });

  return map;
}

function toReviewsArray(_formData: ProductFormData): ProductReview[] {
  return [];
}
