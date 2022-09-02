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
  ProductPropertyType,
  ProductRequest,
  ProductType,
} from '../../../types/product';
import { ProductBenchmark } from '../../../types/product-benchmark';
import { ProductMeta, ProductMetaKey } from '../../../types/product-meta';
import { ProductReview, ProductReviewKey } from '../../../types/product-review';
import {
  GpuSpecKey,
  MarketSegment,
  ProductionStatus,
  ProductSpec,
  ProductSpecKey,
} from '../../../types/product-spec';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Checkbox } from '../../shared/components/checkbox';
import { Field, FieldError } from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { Input } from '../../shared/components/input';
import { Select, SelectOption } from '../../shared/components/select';
import { Spinner } from '../../shared/components/spinner';
import { Textarea } from '../../shared/components/textarea';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { productService } from '../product.service';
import { BenchmarkFields, BenchmarkValue } from './benchmark-fields';
import { ProductPropertyAutocomplete } from './product-property-autocomplete';
import { ProductPropertyField } from './product-property-field';
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
  launchPrice?: string;
  releaseDate?: string;
  productionStatus?: string;

  // Processor
  gpuName?: string;
  gpuVariant?: string;
  architecture?: string;
  foundry?: string;
  lithography?: string;
  transistors?: string;
  dieSize?: string;

  // Board Compatibility & Dimensions
  slotWidth?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  busInterface?: string;
  tdp?: string;
  suggestedPsu?: string;
  powerConnectors?: string;
  boardNumber?: string;

  // Cores & Clock Speeds
  cudaCores?: number;
  tmus?: number;
  rops?: number;
  tensorCores?: number;
  rtCores?: number;
  baseClock?: string;
  boostClock?: string;
  l1Cache?: string;
  l2Cache?: string;

  // Theoretical Performance
  pixelRate?: string;
  textureRate?: string;
  fp32Performance?: string;
  fp64Performance?: string;

  // Memory
  memorySize?: string;
  memoryType?: string;
  memoryInterface?: string;
  memoryBandwidth?: string;

  // Display Connectivity
  maxResolution?: string;
  displayPorts?: string;
  hdmiPorts?: string;

  // API Support
  directX?: number;
  openCl?: number;
  openGl?: number;
  cuda?: number;
  shaderModel?: number;
  gSyncFreeSync?: boolean;
  sliCrossfire?: boolean;
  vrReady?: boolean;

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

  // General
  company: Joi.string().optional(),
  generation: Joi.string().optional(),
  marketSegment: Joi.string().optional(),
  launchPrice: Joi.string().optional(),
  releaseDate: Joi.string().optional(),
  productionStatus: Joi.string().optional(),

  // Processor
  gpuName: Joi.string().optional(),
  architecture: Joi.string().optional(),
  foundry: Joi.string().optional(),
  processSize: Joi.string().optional(),
  transistors: Joi.string().optional(),
  dieSize: Joi.string().optional(),

  // Board Compatibility & Dimensions
  slotWidth: Joi.string().optional(),
  length: Joi.string().optional(),
  width: Joi.string().optional(),
  height: Joi.string().optional(),
  weight: Joi.string().optional(),
  busInterface: Joi.string().optional(),
  tdp: Joi.string().optional(),
  suggestedPsu: Joi.string().optional(),
  powerConnectors: Joi.string().optional(),
  boardNumber: Joi.string().optional(),

  // Cores & Clock Speed
  cudaCores: Joi.number().optional(),
  tmus: Joi.number().optional(),
  rops: Joi.number().optional(),
  tensorCores: Joi.number().optional(),
  rtCores: Joi.number().optional(),
  baseClock: Joi.string().optional(),
  boostClock: Joi.string().optional(),
  l1Cache: Joi.string().optional(),
  l2Cache: Joi.string().optional(),

  // Theoretical Performance
  pixelRate: Joi.string().optional(),
  textureRate: Joi.string().optional(),
  fp32Performance: Joi.string().optional(),
  fp64Performance: Joi.string().optional(),

  // Memory
  memorySize: Joi.string().optional(),
  memoryType: Joi.string().optional(),
  memoryInterface: Joi.string().optional(),
  memoryBandwidth: Joi.string().optional(),

  // Display Connectivity
  maxResolution: Joi.string().optional(),
  displayPorts: Joi.string().optional(),
  hdmiPorts: Joi.string().optional(),

  // API Support
  directX: Joi.number().optional(),
  openCl: Joi.number().optional(),
  openGl: Joi.number().optional(),
  cuda: Joi.number().optional(),
  shaderModel: Joi.number().optional(),
  gSyncFreeSync: Joi.boolean().optional(),
  sliCrossfire: Joi.boolean().optional(),
  vrReady: Joi.boolean().optional(),

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
        (meta.get(ProductMetaKey.Description)?.value as string) ?? '',

      // General
      company: (specs.get(GpuSpecKey.Company)?.value as string) ?? '',
      generation: (specs.get(GpuSpecKey.Generation)?.value as string) ?? '',
      marketSegment:
        (specs.get(GpuSpecKey.MarketSegment)?.value as string) ?? '',
      launchPrice: (specs.get(GpuSpecKey.MSRP)?.value as string) ?? '',
      releaseDate: (specs.get(GpuSpecKey.ReleaseDate)?.value as string) ?? '',
      productionStatus:
        (specs.get(GpuSpecKey.ProductionStatus)?.value as string) ?? '',

      // Processor
      gpuName: (specs.get(GpuSpecKey.GpuName)?.value as string) ?? '',
      gpuVariant: (specs.get(GpuSpecKey.GpuVariant)?.value as string) ?? '',
      architecture: (specs.get(GpuSpecKey.Architecture)?.value as string) ?? '',
      foundry: (specs.get(GpuSpecKey.Foundry)?.value as string) ?? '',
      lithography: (specs.get(GpuSpecKey.Lithography)?.value as string) ?? '',
      transistors: (specs.get(GpuSpecKey.Transistors)?.value as string) ?? '',
      dieSize: (specs.get(GpuSpecKey.DieSize)?.value as string) ?? '',

      // Board Compatibility & Dimensions
      slotWidth: (specs.get(GpuSpecKey.SlotWidth)?.value as string) ?? '',
      length: (specs.get(GpuSpecKey.Length)?.value as string) ?? '',
      width: (specs.get(GpuSpecKey.Width)?.value as string) ?? '',
      height: (specs.get(GpuSpecKey.Height)?.value as string) ?? '',
      weight: (specs.get(GpuSpecKey.Weight)?.value as string) ?? '',
      busInterface: (specs.get(GpuSpecKey.BusInterface)?.value as string) ?? '',
      tdp: (specs.get(GpuSpecKey.Tdp)?.value as string) ?? '',
      suggestedPsu: (specs.get(GpuSpecKey.SuggestedPsu)?.value as string) ?? '',
      powerConnectors:
        (specs.get(GpuSpecKey.PowerConnectors)?.value as string) ?? '',

      // Cores & Clock Speeds
      cudaCores: specs.has(GpuSpecKey.CudaCores)
        ? Number(specs.get(GpuSpecKey.CudaCores))
        : undefined,
      tmus: specs.has(GpuSpecKey.Tmus)
        ? Number(specs.get(GpuSpecKey.Tmus))
        : undefined,
      rops: specs.has(GpuSpecKey.Rops)
        ? Number(specs.get(GpuSpecKey.Rops))
        : undefined,
      tensorCores: specs.has(GpuSpecKey.TensorCores)
        ? Number(specs.get(GpuSpecKey.TensorCores))
        : undefined,
      rtCores: specs.has(GpuSpecKey.RtCores)
        ? Number(specs.get(GpuSpecKey.RtCores))
        : undefined,
      baseClock: (specs.get(GpuSpecKey.ClockSpeedBase)?.value as string) ?? '',
      boostClock:
        (specs.get(GpuSpecKey.ClockSpeedBoost)?.value as string) ?? '',
      l1Cache: (specs.get(GpuSpecKey.L1Cache)?.value as string) ?? '',
      l2Cache: (specs.get(GpuSpecKey.L2Cache)?.value as string) ?? '',

      // Theoretical Performance
      pixelRate: (specs.get(GpuSpecKey.PixelRate)?.value as string) ?? '',
      textureRate: (specs.get(GpuSpecKey.TextureRate)?.value as string) ?? '',
      fp32Performance:
        (specs.get(GpuSpecKey.Fp32Performance)?.value as string) ?? '',
      fp64Performance:
        (specs.get(GpuSpecKey.Fp64Performance)?.value as string) ?? '',

      // Memory
      memorySize: (specs.get(GpuSpecKey.MemorySize)?.value as string) ?? '',
      memoryType: (specs.get(GpuSpecKey.MemoryType)?.value as string) ?? '',
      memoryInterface:
        (specs.get(GpuSpecKey.MemoryInterface)?.value as string) ?? '',
      memoryBandwidth:
        (specs.get(GpuSpecKey.MemoryBandwidth)?.value as string) ?? '',

      // Display Connectivity
      maxResolution: (specs.get(GpuSpecKey.Foundry)?.value as string) ?? '',
      displayPorts: (specs.get(GpuSpecKey.DisplayPorts)?.value as string) ?? '',
      hdmiPorts: (specs.get(GpuSpecKey.HdmiPorts)?.value as string) ?? '',

      // API Support
      directX: specs.has(GpuSpecKey.DirectX)
        ? Number(specs.get(GpuSpecKey.DirectX))
        : undefined,
      openCl: specs.has(GpuSpecKey.OpenCl)
        ? Number(specs.get(GpuSpecKey.OpenCl))
        : undefined,
      openGl: specs.has(GpuSpecKey.OpenGl)
        ? Number(specs.get(GpuSpecKey.OpenGl))
        : undefined,
      cuda: specs.has(GpuSpecKey.Cuda)
        ? Number(specs.get(GpuSpecKey.Cuda))
        : undefined,
      shaderModel: specs.has(GpuSpecKey.ShaderModel)
        ? Number(specs.get(GpuSpecKey.ShaderModel))
        : undefined,
      gSyncFreeSync: specs.has(GpuSpecKey.GSyncFreeSync)
        ? Boolean(specs.get(GpuSpecKey.GSyncFreeSync))
        : undefined,
      sliCrossfire: specs.has(GpuSpecKey.SliCrossfire)
        ? Boolean(specs.get(GpuSpecKey.SliCrossfire))
        : undefined,
      vrReady: specs.has(GpuSpecKey.VrReady)
        ? Boolean(specs.get(GpuSpecKey.VrReady))
        : undefined,

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
              <ProductPropertyField
                propertyType={ProductPropertyType.Spec}
                field={GpuSpecKey.Company}
                autocomplete
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
              <ProductPropertyField
                propertyType={ProductPropertyType.Spec}
                field={GpuSpecKey.Generation}
                autocomplete
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
              <Select {...field} ref={null}>
                <SelectOption label="Unknown" value={MarketSegment.Unknown}>
                  Unknown
                </SelectOption>
                <SelectOption label="Desktop" value={MarketSegment.Desktop}>
                  Desktop
                </SelectOption>
                <SelectOption label="Laptop" value={MarketSegment.Laptop}>
                  Laptop
                </SelectOption>
                <SelectOption label="Server" value={MarketSegment.Server}>
                  Server
                </SelectOption>
              </Select>
            )}
          />
        </Field>

        <Field>
          Launch Price
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => (
              <ProductPropertyField
                propertyType={ProductPropertyType.Spec}
                field={GpuSpecKey.MSRP}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Release Date
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <ProductPropertyField
                type="date"
                propertyType={ProductPropertyType.Spec}
                field={GpuSpecKey.ReleaseDate}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Production Status
          <Controller
            name="productionStatus"
            control={control}
            render={({ field }) => (
              <Select {...field} ref={null}>
                <SelectOption label="Unknown" value={ProductionStatus.Unknown}>
                  Unknown
                </SelectOption>
                <SelectOption label="Active" value={ProductionStatus.Active}>
                  Active
                </SelectOption>
                <SelectOption
                  label="End-Of-Life"
                  value={ProductionStatus.EndOfLife}
                >
                  End-Of-Life
                </SelectOption>
                <SelectOption
                  label="Unreleased"
                  value={ProductionStatus.Unreleased}
                >
                  Unreleased
                </SelectOption>
              </Select>
            )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.GpuName}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            GPU Variant
            <Controller
              name="gpuVariant"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.GpuVariant}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Architecture}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Foundry
            <Controller
              name="foundry"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Foundry}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Lithography
            <Controller
              name="lithography"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Lithography}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Transistors}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Die Size
            <Controller
              name="dieSize"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.DieSize}
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.SlotWidth}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Length}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Width}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Height}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Weight}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.BusInterface}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            TDP
            <Controller
              name="tdp"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Tdp}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Suggested PSU
            <Controller
              name="suggestedPsu"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.SuggestedPsu}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.PowerConnectors}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.CudaCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            TMUs
            <Controller
              name="tmus"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Tmus}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            ROPs
            <Controller
              name="rops"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Rops}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Tensor Cores
            <Controller
              name="tensorCores"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.TensorCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            RT Cores
            <Controller
              name="rtCores"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.RtCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Base Clock
            <Controller
              name="baseClock"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.ClockSpeedBase}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Boost Clock
            <Controller
              name="boostClock"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.ClockSpeedBoost}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            L1 Cache
            <Controller
              name="l1Cache"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.L1Cache}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.L2Cache}
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.PixelRate}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Texture Rate
            <Controller
              name="textureRate"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.TextureRate}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            FP32 Performance
            <Controller
              name="fp32Performance"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Fp32Performance}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            FP64 Performance
            <Controller
              name="fp64Performance"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.Fp64Performance}
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.MemorySize}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.MemoryType}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.MemoryInterface}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Memory Bandwidth
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.MemoryBandwidth}
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.MaxResolution}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Display Ports
            <Controller
              name="displayPorts"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.DisplayPorts}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            HDMI Ports
            <Controller
              name="hdmiPorts"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.HdmiPorts}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.DirectX}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
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
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.OpenCl}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Open GL
            <Controller
              name="openGl"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.OpenGl}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Shader Model
            <Controller
              name="shaderModel"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={GpuSpecKey.ShaderModel}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
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
  ];
}

function getSpecsMap(gpu?: GpuProduct) {
  const map = new Map<ProductSpecKey, ProductSpec>();

  gpu?.specs?.forEach((spec) => {
    map.set(spec.key, spec);
  });

  return map;
}

function toSpecsArray(formData: ProductFormData): ProductSpec[] {
  return [
    // General
    { key: GpuSpecKey.Company, value: formData.company },
    { key: GpuSpecKey.Generation, value: formData.generation },
    { key: GpuSpecKey.MarketSegment, value: formData.marketSegment },
    { key: GpuSpecKey.MSRP, value: Number(formData.launchPrice) || undefined },
    { key: GpuSpecKey.ReleaseDate, value: formData.releaseDate },
    { key: GpuSpecKey.ProductionStatus, value: formData.productionStatus },

    // Processor
    { key: GpuSpecKey.GpuName, value: formData.gpuName },
    { key: GpuSpecKey.GpuVariant, value: formData.gpuVariant },
    { key: GpuSpecKey.Architecture, value: formData.architecture },
    { key: GpuSpecKey.Foundry, value: formData.foundry },
    { key: GpuSpecKey.Lithography, value: formData.lithography },
    { key: GpuSpecKey.Transistors, value: formData.transistors },
    { key: GpuSpecKey.DieSize, value: formData.dieSize },

    // Board Compatibility & Dimensions
    { key: GpuSpecKey.SlotWidth, value: formData.slotWidth },
    { key: GpuSpecKey.Length, value: formData.length },
    { key: GpuSpecKey.Width, value: formData.width },
    { key: GpuSpecKey.Height, value: formData.height },
    { key: GpuSpecKey.Weight, value: formData.weight },
    { key: GpuSpecKey.BusInterface, value: formData.busInterface },
    { key: GpuSpecKey.Tdp, value: formData.tdp },
    { key: GpuSpecKey.SuggestedPsu, value: formData.suggestedPsu },
    { key: GpuSpecKey.BoardNumber, value: formData.boardNumber },

    // Cores & Clock Speeds
    { key: GpuSpecKey.CudaCores, value: formData.cudaCores },
    { key: GpuSpecKey.Tmus, value: formData.tmus },
    { key: GpuSpecKey.Rops, value: formData.rops },
    { key: GpuSpecKey.TensorCores, value: formData.tensorCores },
    { key: GpuSpecKey.RtCores, value: formData.rtCores },
    { key: GpuSpecKey.ClockSpeedBase, value: formData.baseClock },
    { key: GpuSpecKey.ClockSpeedBoost, value: formData.boostClock },
    { key: GpuSpecKey.L1Cache, value: formData.l1Cache },
    { key: GpuSpecKey.L2Cache, value: formData.l2Cache },

    // Theoretical Performance
    { key: GpuSpecKey.PixelRate, value: formData.pixelRate },
    { key: GpuSpecKey.TextureRate, value: formData.textureRate },
    { key: GpuSpecKey.Fp32Performance, value: formData.fp32Performance },
    { key: GpuSpecKey.Fp64Performance, value: formData.fp64Performance },

    // Memory
    { key: GpuSpecKey.MemorySize, value: formData.memorySize },
    { key: GpuSpecKey.MemoryType, value: formData.memoryType },
    { key: GpuSpecKey.MemoryInterface, value: formData.memoryInterface },
    { key: GpuSpecKey.MemoryBandwidth, value: formData.memoryBandwidth },

    // Display Connectivity
    { key: GpuSpecKey.MaxResolution, value: formData.maxResolution },
    { key: GpuSpecKey.DisplayPorts, value: formData.displayPorts },
    { key: GpuSpecKey.HdmiPorts, value: formData.hdmiPorts },

    // API Support
    { key: GpuSpecKey.DirectX, value: formData.directX },
    { key: GpuSpecKey.OpenCl, value: formData.openCl },
    { key: GpuSpecKey.OpenGl, value: formData.openGl },
    { key: GpuSpecKey.Cuda, value: formData.cuda },
    { key: GpuSpecKey.ShaderModel, value: formData.shaderModel },
    { key: GpuSpecKey.GSyncFreeSync, value: formData.gSyncFreeSync },
    { key: GpuSpecKey.SliCrossfire, value: formData.sliCrossfire },
    { key: GpuSpecKey.VrReady, value: formData.vrReady },
  ];
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
