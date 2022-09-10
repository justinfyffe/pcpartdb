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
  Product,
  ProductPropertyType,
  ProductRequest,
  ProductType,
} from '../../../types/product';
import { ProductBenchmark } from '../../../types/product-benchmark';
import { ProductMeta, ProductMetaKey } from '../../../types/product-meta';
import { ProductReview, ProductReviewKey } from '../../../types/product-review';
import {
  MarketSegment,
  ProductionStatus,
  ProductSpec,
  ProductSpecBoolean,
  ProductSpecKey,
} from '../../../types/product-spec';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
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
import { ProductAutocomplete } from './product-autocomplete';
import { ProductPropertyField } from './product-property-field';
import { ReviewFields } from './review-fields';

interface ProductReviewFormData {
  key: ProductReviewKey;
  value: string;
  source?: string;
}

interface ProductFormData {
  parentId?: number;

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
  cudaCores?: string;
  tmus?: string;
  rops?: string;
  tensorCores?: string;
  rtCores?: string;
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
  directXVersion?: string;
  openClVersion?: string;
  openGlVersion?: string;
  cudaVersion?: string;
  shaderModelVersion?: string;
  gSyncFreeSyncSupport?: string;
  sliCrossfireSupport?: string;
  vrReady?: string;

  reviews?: ProductReviewFormData[];
  benchmarks?: BenchmarkValue[];
}

const benchmarkValidator = Joi.object({
  id: Joi.any(),
  productId: Joi.any(),
  key: Joi.string().required(),
  value: Joi.string().allow(''),
  source: Joi.string().allow(''),
}).options({ abortEarly: false });

const reviewValidator = Joi.object({
  id: Joi.any(),
  productId: Joi.any(),
  key: Joi.string().required(),
  value: Joi.string().allow(''),
  source: Joi.string().allow(''),
}).options({ abortEarly: false });

const productValidator = Joi.object({
  parentId: Joi.number(),

  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  description: Joi.string().allow(''),

  // General
  company: Joi.string().allow(''),
  generation: Joi.string().allow(''),
  marketSegment: Joi.string().allow(''),
  launchPrice: Joi.string().allow(''),
  releaseDate: Joi.string().allow(''),
  productionStatus: Joi.string().allow(''),

  // Processor
  gpuName: Joi.string().allow(''),
  gpuVariant: Joi.string().allow(''),
  architecture: Joi.string().allow(''),
  foundry: Joi.string().allow(''),
  lithography: Joi.string().allow(''),
  processSize: Joi.string().allow(''),
  transistors: Joi.string().allow(''),
  dieSize: Joi.string().allow(''),

  // Board Compatibility & Dimensions
  slotWidth: Joi.string().allow(''),
  length: Joi.string().allow(''),
  width: Joi.string().allow(''),
  height: Joi.string().allow(''),
  weight: Joi.string().allow(''),
  busInterface: Joi.string().allow(''),
  tdp: Joi.string().allow(''),
  suggestedPsu: Joi.string().allow(''),
  powerConnectors: Joi.string().allow(''),
  boardNumber: Joi.string().allow(''),

  // Cores & Clock Speed
  cudaCores: Joi.string().allow(''),
  tmus: Joi.string().allow(''),
  rops: Joi.string().allow(''),
  tensorCores: Joi.string().allow(''),
  rtCores: Joi.string().allow(''),
  baseClock: Joi.string().allow(''),
  boostClock: Joi.string().allow(''),
  l1Cache: Joi.string().allow(''),
  l2Cache: Joi.string().allow(''),

  // Theoretical Performance
  pixelRate: Joi.string().allow(''),
  textureRate: Joi.string().allow(''),
  fp32Performance: Joi.string().allow(''),
  fp64Performance: Joi.string().allow(''),

  // Memory
  memorySize: Joi.string().allow(''),
  memoryType: Joi.string().allow(''),
  memoryInterface: Joi.string().allow(''),
  memoryBandwidth: Joi.string().allow(''),

  // Display Connectivity
  maxResolution: Joi.string().allow(''),
  displayPorts: Joi.string().allow(''),
  hdmiPorts: Joi.string().allow(''),

  // API Support
  directXVersion: Joi.string().allow(''),
  openClVersion: Joi.string().allow(''),
  openGlVersion: Joi.string().allow(''),
  cudaVersion: Joi.string().allow(''),
  shaderModelVersion: Joi.string().allow(''),
  gSyncFreeSyncSupport: Joi.string().allow(''),
  sliCrossfireSupport: Joi.string().allow(''),
  vrReady: Joi.string().allow(''),

  // TODO: add validator for unique keys
  benchmarks: Joi.array().items(benchmarkValidator),
  reviews: Joi.array().items(reviewValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = getMetaMap(gpu);
  const specs = getSpecsMap(gpu);

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      parentId: gpu?.parentId ?? 0,

      slug: gpu?.slug ?? '',
      type: ProductType.GPU,
      name: gpu?.name ?? '',
      description: meta.get(ProductMetaKey.Description)?.value ?? '',

      // General
      company: specs.get(ProductSpecKey.Company)?.value ?? '',
      generation: specs.get(ProductSpecKey.Generation)?.value ?? '',
      marketSegment: specs.get(ProductSpecKey.MarketSegment)?.value ?? '',
      launchPrice: specs.get(ProductSpecKey.LaunchPrice)?.value ?? '',
      releaseDate: specs.get(ProductSpecKey.ReleaseDate)?.value ?? '',
      productionStatus: specs.get(ProductSpecKey.ProductionStatus)?.value ?? '',

      // Processor
      gpuName: specs.get(ProductSpecKey.GpuName)?.value ?? '',
      gpuVariant: specs.get(ProductSpecKey.GpuVariant)?.value ?? '',
      architecture: specs.get(ProductSpecKey.Architecture)?.value ?? '',
      foundry: specs.get(ProductSpecKey.Foundry)?.value ?? '',
      lithography: specs.get(ProductSpecKey.Lithography)?.value ?? '',
      transistors: specs.get(ProductSpecKey.Transistors)?.value ?? '',
      dieSize: specs.get(ProductSpecKey.DieSize)?.value ?? '',

      // Board Compatibility & Dimensions
      slotWidth: specs.get(ProductSpecKey.SlotWidth)?.value ?? '',
      length: specs.get(ProductSpecKey.Length)?.value ?? '',
      width: specs.get(ProductSpecKey.Width)?.value ?? '',
      height: specs.get(ProductSpecKey.Height)?.value ?? '',
      weight: specs.get(ProductSpecKey.Weight)?.value ?? '',
      busInterface: specs.get(ProductSpecKey.BusInterface)?.value ?? '',
      tdp: specs.get(ProductSpecKey.Tdp)?.value ?? '',
      suggestedPsu: specs.get(ProductSpecKey.SuggestedPsu)?.value ?? '',
      powerConnectors: specs.get(ProductSpecKey.PowerConnectors)?.value ?? '',

      // Cores & Clock Speeds
      cudaCores: specs.get(ProductSpecKey.CudaCores)?.value ?? '',
      tmus: specs.get(ProductSpecKey.Tmus)?.value ?? '',
      rops: specs.get(ProductSpecKey.Rops)?.value ?? '',
      tensorCores: specs.get(ProductSpecKey.TensorCores)?.value ?? '',
      rtCores: specs.get(ProductSpecKey.RtCores)?.value ?? '',
      baseClock: specs.get(ProductSpecKey.ClockSpeedBase)?.value ?? '',
      boostClock: specs.get(ProductSpecKey.ClockSpeedBoost)?.value ?? '',
      l1Cache: specs.get(ProductSpecKey.L1Cache)?.value ?? '',
      l2Cache: specs.get(ProductSpecKey.L2Cache)?.value ?? '',

      // Theoretical Performance
      pixelRate: specs.get(ProductSpecKey.PixelFillRate)?.value ?? '',
      textureRate: specs.get(ProductSpecKey.TextureRate)?.value ?? '',
      fp32Performance: specs.get(ProductSpecKey.Fp32Performance)?.value ?? '',
      fp64Performance: specs.get(ProductSpecKey.Fp64Performance)?.value ?? '',

      // Memory
      memorySize: specs.get(ProductSpecKey.MemorySize)?.value ?? '',
      memoryType: specs.get(ProductSpecKey.MemoryType)?.value ?? '',
      memoryInterface: specs.get(ProductSpecKey.MemoryInterface)?.value ?? '',
      memoryBandwidth: specs.get(ProductSpecKey.MemoryBandwidth)?.value ?? '',

      // Display Connectivity
      maxResolution: specs.get(ProductSpecKey.MaxResolution)?.value ?? '',
      displayPorts: specs.get(ProductSpecKey.DisplayPorts)?.value ?? '',
      hdmiPorts: specs.get(ProductSpecKey.HdmiPorts)?.value ?? '',

      // API Support
      directXVersion: specs.get(ProductSpecKey.DirectXVersion)?.value ?? '',
      openClVersion: specs.get(ProductSpecKey.OpenClVersion)?.value ?? '',
      openGlVersion: specs.get(ProductSpecKey.OpenGlVersion)?.value ?? '',
      cudaVersion: specs.get(ProductSpecKey.CudaVersion)?.value ?? '',
      shaderModelVersion:
        specs.get(ProductSpecKey.ShaderModelVersion)?.value ?? '',
      gSyncFreeSyncSupport:
        specs.get(ProductSpecKey.GSyncFreeSyncSupport)?.value ??
        ProductSpecBoolean.Unknown,
      sliCrossfireSupport:
        specs.get(ProductSpecKey.SliCrossfireSupport)?.value ??
        ProductSpecBoolean.Unknown,
      vrReady:
        specs.get(ProductSpecKey.VrReady)?.value ?? ProductSpecBoolean.Unknown,

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

  console.log(errors);

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

      const request: ProductRequest = {
        parentId:
          formData.parentId != null && formData.parentId != 0
            ? formData.parentId
            : undefined,
        slug: formData.slug,
        type: formData.type,
        name: formData.name,
        meta: toMetaArray(formData),
        specs: toSpecsArray(formData),
        benchmarks: toRequestBenchmarks(formData),
        reviews: toRequestReviews(formData),
      };

      try {
        if (isUpdate) {
          await productService.update(gpu.id, request);
        } else {
          await productService.create(request);
        }

        router.push('/admin/gpus');
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
          Parent Product
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <ProductAutocomplete
                productType={ProductType.GPU}
                excludeProductId={gpu?.id}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>
      </section>

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
                field={ProductSpecKey.Company}
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
                field={ProductSpecKey.Generation}
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
                field={ProductSpecKey.LaunchPrice}
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
                field={ProductSpecKey.ReleaseDate}
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
                  field={ProductSpecKey.GpuName}
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
                  field={ProductSpecKey.GpuVariant}
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
                  field={ProductSpecKey.Architecture}
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
                  field={ProductSpecKey.Foundry}
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
                  field={ProductSpecKey.Lithography}
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
                  field={ProductSpecKey.Transistors}
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
                  field={ProductSpecKey.DieSize}
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
                  field={ProductSpecKey.SlotWidth}
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
                  field={ProductSpecKey.Length}
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
                  field={ProductSpecKey.Width}
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
                  field={ProductSpecKey.Height}
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
                  field={ProductSpecKey.Weight}
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
                  field={ProductSpecKey.BusInterface}
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
                  field={ProductSpecKey.Tdp}
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
                  field={ProductSpecKey.SuggestedPsu}
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
                  field={ProductSpecKey.PowerConnectors}
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
                  field={ProductSpecKey.CudaCores}
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
                  field={ProductSpecKey.Tmus}
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
                  field={ProductSpecKey.Rops}
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
                  field={ProductSpecKey.TensorCores}
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
                  field={ProductSpecKey.RtCores}
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
                  field={ProductSpecKey.ClockSpeedBase}
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
                  field={ProductSpecKey.ClockSpeedBoost}
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
                  field={ProductSpecKey.L1Cache}
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
                  field={ProductSpecKey.L2Cache}
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
            Pixel Fill Rate
            <Controller
              name="pixelRate"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.PixelFillRate}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Texture Fill Rate
            <Controller
              name="textureRate"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.TextureRate}
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
                  field={ProductSpecKey.Fp32Performance}
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
                  field={ProductSpecKey.Fp64Performance}
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
                  field={ProductSpecKey.MemorySize}
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
                  field={ProductSpecKey.MemoryType}
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
                  field={ProductSpecKey.MemoryInterface}
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
                  field={ProductSpecKey.MemoryBandwidth}
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
                  field={ProductSpecKey.MaxResolution}
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
                  field={ProductSpecKey.DisplayPorts}
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
                  field={ProductSpecKey.HdmiPorts}
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
            Direct X Version
            <Controller
              name="directXVersion"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.DirectXVersion}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            G-Sync / Free-Sync Support
            <Controller
              name="gSyncFreeSyncSupport"
              control={control}
              render={({ field }) => (
                <Select {...field} ref={null}>
                  <SelectOption
                    label="Unknown"
                    value={ProductSpecBoolean.Unknown}
                  >
                    Unknown
                  </SelectOption>
                  <SelectOption label="True" value={ProductSpecBoolean.True}>
                    True
                  </SelectOption>
                  <SelectOption label="False" value={ProductSpecBoolean.False}>
                    False
                  </SelectOption>
                </Select>
              )}
            />
          </Field>

          <Field>
            SLI / Crossfire Support
            <Controller
              name="sliCrossfireSupport"
              control={control}
              render={({ field }) => (
                <Select {...field} ref={null}>
                  <SelectOption
                    label="Unknown"
                    value={ProductSpecBoolean.Unknown}
                  >
                    Unknown
                  </SelectOption>
                  <SelectOption label="True" value={ProductSpecBoolean.True}>
                    True
                  </SelectOption>
                  <SelectOption label="False" value={ProductSpecBoolean.False}>
                    False
                  </SelectOption>
                </Select>
              )}
            />
          </Field>

          <Field>
            VR Ready
            <Controller
              name="vrReady"
              control={control}
              render={({ field }) => (
                <Select {...field} ref={null}>
                  <SelectOption
                    label="Unknown"
                    value={ProductSpecBoolean.Unknown}
                  >
                    Unknown
                  </SelectOption>
                  <SelectOption label="True" value={ProductSpecBoolean.True}>
                    True
                  </SelectOption>
                  <SelectOption label="False" value={ProductSpecBoolean.False}>
                    False
                  </SelectOption>
                </Select>
              )}
            />
          </Field>

          <Field>
            Open CL Version
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.OpenClVersion}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Open GL Version
            <Controller
              name="openGlVersion"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.OpenGlVersion}
                  autocomplete
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Shader Model Version
            <Controller
              name="shaderModelVersion"
              control={control}
              render={({ field }) => (
                <ProductPropertyField
                  propertyType={ProductPropertyType.Spec}
                  field={ProductSpecKey.ShaderModelVersion}
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
              onAppend={() => appendBenchmark({ value: '', source: '' })}
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
              onAppend={() => appendReview({ value: '', source: '' })}
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

function getMetaMap(gpu?: Product) {
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

function getSpecsMap(gpu?: Product) {
  const map = new Map<ProductSpecKey, ProductSpec>();

  gpu?.specs?.forEach((spec) => {
    map.set(spec.key, spec);
  });

  return map;
}

function toSpecsArray(formData: ProductFormData): ProductSpec[] {
  return [
    // General
    { key: ProductSpecKey.Company, value: formData.company },
    { key: ProductSpecKey.Generation, value: formData.generation },
    { key: ProductSpecKey.MarketSegment, value: formData.marketSegment },
    { key: ProductSpecKey.LaunchPrice, value: formData.launchPrice },
    { key: ProductSpecKey.ReleaseDate, value: formData.releaseDate },
    { key: ProductSpecKey.ProductionStatus, value: formData.productionStatus },

    // Processor
    { key: ProductSpecKey.GpuName, value: formData.gpuName },
    { key: ProductSpecKey.GpuVariant, value: formData.gpuVariant },
    { key: ProductSpecKey.Architecture, value: formData.architecture },
    { key: ProductSpecKey.Foundry, value: formData.foundry },
    { key: ProductSpecKey.Lithography, value: formData.lithography },
    { key: ProductSpecKey.Transistors, value: formData.transistors },
    { key: ProductSpecKey.DieSize, value: formData.dieSize },

    // Board Compatibility & Dimensions
    { key: ProductSpecKey.SlotWidth, value: formData.slotWidth },
    { key: ProductSpecKey.Length, value: formData.length },
    { key: ProductSpecKey.Width, value: formData.width },
    { key: ProductSpecKey.Height, value: formData.height },
    { key: ProductSpecKey.Weight, value: formData.weight },
    { key: ProductSpecKey.BusInterface, value: formData.busInterface },
    { key: ProductSpecKey.Tdp, value: formData.tdp },
    { key: ProductSpecKey.SuggestedPsu, value: formData.suggestedPsu },
    { key: ProductSpecKey.BoardNumber, value: formData.boardNumber },

    // Cores & Clock Speeds
    { key: ProductSpecKey.CudaCores, value: formData.cudaCores },
    { key: ProductSpecKey.Tmus, value: formData.tmus },
    { key: ProductSpecKey.Rops, value: formData.rops },
    { key: ProductSpecKey.TensorCores, value: formData.tensorCores },
    { key: ProductSpecKey.RtCores, value: formData.rtCores },
    { key: ProductSpecKey.ClockSpeedBase, value: formData.baseClock },
    { key: ProductSpecKey.ClockSpeedBoost, value: formData.boostClock },
    { key: ProductSpecKey.L1Cache, value: formData.l1Cache },
    { key: ProductSpecKey.L2Cache, value: formData.l2Cache },

    // Theoretical Performance
    { key: ProductSpecKey.PixelFillRate, value: formData.pixelRate },
    { key: ProductSpecKey.TextureRate, value: formData.textureRate },
    { key: ProductSpecKey.Fp32Performance, value: formData.fp32Performance },
    { key: ProductSpecKey.Fp64Performance, value: formData.fp64Performance },

    // Memory
    { key: ProductSpecKey.MemorySize, value: formData.memorySize },
    { key: ProductSpecKey.MemoryType, value: formData.memoryType },
    { key: ProductSpecKey.MemoryInterface, value: formData.memoryInterface },
    { key: ProductSpecKey.MemoryBandwidth, value: formData.memoryBandwidth },

    // Display Connectivity
    { key: ProductSpecKey.MaxResolution, value: formData.maxResolution },
    { key: ProductSpecKey.DisplayPorts, value: formData.displayPorts },
    { key: ProductSpecKey.HdmiPorts, value: formData.hdmiPorts },

    // API Support
    { key: ProductSpecKey.DirectXVersion, value: formData.directXVersion },
    { key: ProductSpecKey.OpenClVersion, value: formData.openClVersion },
    { key: ProductSpecKey.OpenGlVersion, value: formData.openGlVersion },
    { key: ProductSpecKey.CudaVersion, value: formData.cudaVersion },
    {
      key: ProductSpecKey.ShaderModelVersion,
      value: formData.shaderModelVersion,
    },
    {
      key: ProductSpecKey.GSyncFreeSyncSupport,
      value: formData.gSyncFreeSyncSupport,
    },
    {
      key: ProductSpecKey.SliCrossfireSupport,
      value: formData.sliCrossfireSupport,
    },
    { key: ProductSpecKey.VrReady, value: formData.vrReady },
  ];
}

function toFormBenchmarks(gpu?: Product) {
  return (
    gpu?.benchmarks?.map((benchmark) => ({
      ...benchmark,
      id: undefined,
      productId: undefined,
    })) ?? []
  );
}

function toRequestBenchmarks(formData: ProductFormData): ProductBenchmark[] {
  return (
    formData.benchmarks?.map((benchmark) => ({
      ...benchmark,
      id: undefined,
      productId: undefined,
    })) ?? []
  );
}

function toFormReviews(gpu?: Product): ProductReview[] {
  return (
    gpu?.reviews?.map((review) => ({
      ...review,
      id: undefined,
      productId: undefined,
    })) ?? []
  );
}

function toRequestReviews(formData: ProductFormData): ProductReview[] {
  return (
    formData.reviews?.map((review) => ({
      ...review,
      id: undefined,
      productId: undefined,
    })) ?? []
  );
}
