import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { ApiError, ValidationErrorType } from '../../../types/error';
import {
  GpuProduct,
  ProductRequest,
  ProductType,
} from '../../../types/product';
import { ProductBenchmark } from '../../../types/product-benchmark';
import { ProductMeta, ProductMetaKey } from '../../../types/product-meta';
import { ProductReview, ProductReviewKey } from '../../../types/product-review';
import { ProductSpec, ProductSpecKey } from '../../../types/product-spec';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Checkbox } from '../../shared/components/checkbox';
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
import { BenchmarkFields, BenchmarkValue } from './benchmark-fields';
import {
  ProductAutocomplete,
  ProductAutocompleteType,
} from './product-autocomplete';
import { ReviewFields } from './review-fields';

interface ProductReviewFormData {
  key: ProductReviewKey;
  value: number | string;
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
  gpuVariant?: string;
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
  benchmarks?: BenchmarkValue[];
}

const benchmarkValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  source: Joi.string().optional(),
}).options({ abortEarly: false });

const reviewValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  source: Joi.string().optional(),
}).options({ abortEarly: false });

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

  benchmarks: Joi.array().items(benchmarkValidator),
  reviews: Joi.array().items(reviewValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: GpuProduct;
}

function formOptions(gpu?: GpuProduct): UseFormProps<ProductFormData> {
  const meta = getMetaMap(gpu);
  const specs = getSpecsMap(gpu);

  return {
    // resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug ?? '',
      type: ProductType.GPU,
      name: gpu?.name ?? '',
      description:
        (meta.get(ProductMetaKey.Description)?.value as string) ?? undefined,
      company: (meta.get(ProductMetaKey.Company)?.value as string) ?? undefined,
      generation:
        (meta.get(ProductMetaKey.Generation)?.value as string) ?? undefined,
      marketSegment:
        (meta.get(ProductMetaKey.MarketSegment)?.value as string) ?? undefined,
      launchPrice: 0,
      releaseDate: '',
      productionStatus: '',

      // Processor
      gpuName: '',
      architecture: '',
      foundry: '',
      processSize: 0,
      transistors: 0,
      dieSize: 0,

      benchmarks: toFormBenchmarks(gpu),
      reviews: toFormReviews(gpu),
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

  const {
    fields: benchmarkFields,
    append: appendBenchmark,
    remove: removeBenchmark,
  } = useFieldArray({
    control,
    name: 'benchmarks',
  });

  const {
    fields: reviewFields,
    append: appendReview,
    remove: removeReview,
  } = useFieldArray({
    control,
    name: 'reviews',
  });

  const handleSave = useCallback(
    async (formData: ProductFormData) => {
      setSaving(true);

      console.log(formData);

      const request: ProductRequest = {
        ...formData,
        meta: toMetaArray(formData),
        specs: toSpecsArray(formData),
        benchmarks: toRequestBenchmarks(formData),
        reviews: toRequestReviews(formData),
      };

      try {
        if (isUpdate) {
          // await productService.update(gpu.id, request);
        } else {
          // await productService.create(request);
        }
        //router.push('/admin/gpus');
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
        <h2 className="mb-4">General Info</h2>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <ProductAutocomplete
                type={ProductAutocompleteType.Meta}
                key={ProductMetaKey.Company}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Generation
          <Controller
            name="generation"
            control={control}
            render={({ field }) => (
              <ProductAutocomplete
                type={ProductAutocompleteType.Meta}
                key={ProductMetaKey.Generation}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <ProductAutocomplete
                type={ProductAutocompleteType.Meta}
                key={ProductMetaKey.MarketSegment}
                {...field}
                ref={null}
              />
            )}
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
        <h2 className="mb-4">Technical Specs</h2>

        <section>
          <h3 className="mb-4">Processor</h3>

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
          <h3 className="mb-4">Board Compatibility &amp; Dimensions</h3>

          <Field>
            Slot Width
            <Controller
              name="slotWidth"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            TDP
            <Controller
              name="tdp"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Suggested PSU
            <Controller
              name="suggestedPsu"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Cores &amp; Clock Speeds</h3>

          <Field>
            CUDA Cores
            <Controller
              name="cudaCores"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            TMUs
            <Controller
              name="tmus"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            ROPs
            <Controller
              name="rops"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Tensor Cores
            <Controller
              name="tensorCores"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            RT Cores
            <Controller
              name="rtCores"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Base Clock
            <Controller
              name="rtCores"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Boost Clock
            <Controller
              name="boostClock"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            L1 Cache
            <Controller
              name="l1Cache"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Theoretical Performance</h3>

          <Field>
            Pixel Rate
            <Controller
              name="pixelRate"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Texture Rate
            <Controller
              name="textureRate"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            FP32 Performance
            <Controller
              name="fp32Performance"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            FP64 Performance
            <Controller
              name="fp64Performance"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Memory</h3>

          <Field>
            Memory Size
            <Controller
              name="memorySize"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Memory Bandwidth
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Display Connectivity</h3>

          <Field>
            Max Resolution
            <Controller
              name="maxResolution"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Display Ports
            <Controller
              name="displayPorts"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            HDMI Ports
            <Controller
              name="hdmiPorts"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            USB-C
            <Controller
              name="usbC"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Dual Link DVI
            <Controller
              name="dualLinkDvi"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Single Link DVI
            <Controller
              name="singleLinkDvi"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            VGA
            <Controller
              name="vga"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">API Support</h3>

          <Field>
            Direct X
            <Controller
              name="directX"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            G-Sync / Free-Sync
            <Controller
              name="gSyncFreeSync"
              control={control}
              render={({ field }) => <Checkbox {...field} ref={null} />}
            />
          </Field>

          <Field>
            SLI / Crossfire
            <Controller
              name="sliCrossfire"
              control={control}
              render={({ field }) => <Checkbox {...field} ref={null} />}
            />
          </Field>

          <Field>
            VR Ready
            <Controller
              name="vrReady"
              control={control}
              render={({ field }) => <Checkbox {...field} ref={null} />}
            />
          </Field>

          <Field>
            Open CL
            <Controller
              name="openCl"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Open GL
            <Controller
              name="openGl"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>

          <Field>
            Shader Model
            <Controller
              name="shaderModel"
              control={control}
              render={({ field }) => <Input {...field} ref={null} />}
            />
          </Field>
        </section>
      </section>

      <section>
        <h2 className="mb-4">Benchmarks</h2>

        <Controller
          name="benchmarks"
          control={control}
          render={({ field }) => (
            <BenchmarkFields
              fields={benchmarkFields}
              onAppend={() => appendBenchmark({})}
              onRemove={(i) => removeBenchmark(i)}
              {...field}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Reviews</h2>

        <Controller
          name="reviews"
          control={control}
          render={({ field }) => (
            <ReviewFields
              fields={reviewFields}
              onAppend={() => appendReview({})}
              onRemove={(i) => removeReview(i)}
              {...field}
              ref={null}
            />
          )}
        />
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
    {
      key: ProductMetaKey.Company,
      value: formData.company,
    },
    {
      key: ProductMetaKey.Generation,
      value: formData.generation,
    },
    {
      key: ProductMetaKey.MarketSegment,
      value: formData.marketSegment,
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

function toFormBenchmarks(gpu?: GpuProduct) {
  return gpu?.benchmarks?.map((benchmark) => ({ ...benchmark })) ?? [];
}

function toRequestBenchmarks(formData: ProductFormData): ProductBenchmark[] {
  return formData.benchmarks?.map((benchmark) => benchmark) ?? [];
}

function toFormReviews(gpu?: GpuProduct): ProductReview[] {
  return gpu?.reviews?.map((review) => ({ ...review })) ?? [];
}

function toRequestReviews(formData: ProductFormData): ProductReview[] {
  return formData.reviews?.map((review) => review) ?? [];
}
