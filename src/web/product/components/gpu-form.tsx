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
import { Image } from '../../../types/image';
import {
  getProductMeta,
  getProductSpecs,
  Product,
  ProductRequest,
  ProductType,
} from '../../../types/product';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
} from '../../../types/product-benchmark';
import { ProductImage, ProductImageType } from '../../../types/product-image';
import {
  ProductMeta,
  ProductMetaKey,
  productMetaValidator,
} from '../../../types/product-meta';
import { ProductReview, ProductReviewKey } from '../../../types/product-review';
import {
  ProductSpec,
  ProductSpecKey,
  productSpecValidator,
} from '../../../types/product-spec';
import { Alert, AlertVariant } from '../../shared/components/alert';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Field, FieldError } from '../../shared/components/field';
import { Form, FormActions } from '../../shared/components/form';
import { TextInput } from '../../shared/components/input';
import { Spinner } from '../../shared/components/spinner';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../shared/error/error.utils';
import { productService } from '../product.service';
import { BenchmarksField } from './benchmarks-field';
import { ProductAutocomplete } from './product-autocomplete';
import { ProductImageField } from './product-image-field';
import { ProductImagesField } from './product-images-field';
import { ProductMetaField } from './product-meta-field';
import { ProductSpecField } from './product-spec-field';
import { ReviewsField } from './reviews-field';

interface ProductReviewFormData {
  key: ProductReviewKey;
  value: string;
  source: string;
}

interface ProductBenchmarkFormData {
  key: ProductBenchmarkKey;
  value: string;
  source: string;
}

interface ProductImageFormData {
  type: ProductImageType;
  image: Image;
}

interface ProductFormData {
  parentId: number;

  slug: string;
  type: ProductType;
  name: string;
  description?: ProductMeta;

  // General
  company?: ProductSpec;
  generation?: ProductSpec;
  marketSegment?: ProductSpec;
  launchPrice?: ProductSpec;
  releaseDate?: ProductSpec;
  productionStatus?: ProductSpec;

  // Processor
  gpuName?: ProductSpec;
  gpuVariant?: ProductSpec;
  architecture?: ProductSpec;
  foundry?: ProductSpec;
  lithography?: ProductSpec;
  transistors?: ProductSpec;
  dieSize?: ProductSpec;

  // Board Compatibility & Dimensions
  slotWidth?: ProductSpec;
  length?: ProductSpec;
  width?: ProductSpec;
  height?: ProductSpec;
  weight?: ProductSpec;
  busInterface?: ProductSpec;
  tdp?: ProductSpec;
  suggestedPsu?: ProductSpec;
  powerConnectors?: ProductSpec;
  boardNumber?: ProductSpec;

  // Cores & Clock Speeds
  cudaCores?: ProductSpec;
  tmus?: ProductSpec;
  rops?: ProductSpec;
  tensorCores?: ProductSpec;
  rtCores?: ProductSpec;
  baseClock?: ProductSpec;
  boostClock?: ProductSpec;
  l1Cache?: ProductSpec;
  l2Cache?: ProductSpec;

  // Theoretical Performance
  pixelRate?: ProductSpec;
  textureRate?: ProductSpec;
  fp32Performance?: ProductSpec;
  fp64Performance?: ProductSpec;

  // Memory
  memorySize?: ProductSpec;
  memoryType?: ProductSpec;
  memoryInterface?: ProductSpec;
  memoryBandwidth?: ProductSpec;

  // Display Connectivity
  maxResolution?: ProductSpec;
  displayPorts?: ProductSpec;
  hdmiPorts?: ProductSpec;

  // API Support
  directXVersion?: ProductSpec;
  openClVersion?: ProductSpec;
  openGlVersion?: ProductSpec;
  cudaVersion?: ProductSpec;
  shaderModelVersion?: ProductSpec;
  gSyncFreeSyncSupport?: ProductSpec;
  sliCrossfireSupport?: ProductSpec;
  vrReady?: ProductSpec;

  reviews?: ProductReviewFormData[];
  benchmarks?: ProductBenchmarkFormData[];

  autocompleteImage?: ProductImageFormData;
  thumbnailImage?: ProductImageFormData;
  detailsImages?: ProductImageFormData[];
}

const benchmarkValidator = Joi.object({
  id: Joi.any(),
  productId: Joi.any(),
  key: Joi.string().required(),
  value: Joi.string().allow(null),
  source: Joi.string().allow(null),
}).options({ abortEarly: false });

const reviewValidator = Joi.object({
  id: Joi.any(),
  productId: Joi.any(),
  key: Joi.string().required(),
  value: Joi.string().allow(null),
  source: Joi.string().allow(null),
}).options({ abortEarly: false });

const imageValidator = Joi.object({
  id: Joi.any(),
  type: Joi.string().required(),
  image: Joi.any().required(),
}).options({ abortEarly: false });

const productValidator = Joi.object({
  parentId: Joi.number().allow(null),

  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),

  description: productMetaValidator,

  // General
  company: productSpecValidator,
  generation: productSpecValidator,
  marketSegment: productSpecValidator,
  launchPrice: productSpecValidator,
  releaseDate: productSpecValidator,
  productionStatus: productSpecValidator,

  // Processor
  gpuName: productSpecValidator,
  gpuVariant: productSpecValidator,
  architecture: productSpecValidator,
  foundry: productSpecValidator,
  lithography: productSpecValidator,
  processSize: productSpecValidator,
  transistors: productSpecValidator,
  dieSize: productSpecValidator,

  // Board Compatibility & Dimensions
  slotWidth: productSpecValidator,
  length: productSpecValidator,
  width: productSpecValidator,
  height: productSpecValidator,
  weight: productSpecValidator,
  busInterface: productSpecValidator,
  tdp: productSpecValidator,
  suggestedPsu: productSpecValidator,
  powerConnectors: productSpecValidator,
  boardNumber: productSpecValidator,

  // Cores & Clock Speed
  cudaCores: productSpecValidator,
  tmus: productSpecValidator,
  rops: productSpecValidator,
  tensorCores: productSpecValidator,
  rtCores: productSpecValidator,
  baseClock: productSpecValidator,
  boostClock: productSpecValidator,
  l1Cache: productSpecValidator,
  l2Cache: productSpecValidator,

  // Theoretical Performance
  pixelRate: productSpecValidator,
  textureRate: productSpecValidator,
  fp32Performance: productSpecValidator,
  fp64Performance: productSpecValidator,

  // Memory
  memorySize: productSpecValidator,
  memoryType: productSpecValidator,
  memoryInterface: productSpecValidator,
  memoryBandwidth: productSpecValidator,

  // Display Connectivity
  maxResolution: productSpecValidator,
  displayPorts: productSpecValidator,
  hdmiPorts: productSpecValidator,

  // API Support
  directXVersion: productSpecValidator,
  openClVersion: productSpecValidator,
  openGlVersion: productSpecValidator,
  cudaVersion: productSpecValidator,
  shaderModelVersion: productSpecValidator,
  gSyncFreeSyncSupport: productSpecValidator,
  sliCrossfireSupport: productSpecValidator,
  vrReady: productSpecValidator,

  // TODO: add validator for unique keys
  benchmarks: Joi.array().items(benchmarkValidator),
  reviews: Joi.array().items(reviewValidator),

  autocompleteImage: imageValidator,
  thumbnailImage: imageValidator,
  detailsImages: Joi.array().items(imageValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = getProductMeta(gpu);
  const specs = getProductSpecs(gpu);
  const { autocompleteImage, thumbnailImage, detailsImages } =
    getFormImages(gpu);

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      parentId: gpu?.parentId ?? null,

      slug: gpu?.slug ?? null,
      type: ProductType.GPU,
      name: gpu?.name ?? null,
      description: meta[ProductMetaKey.Description] ?? null,

      // General
      company: specs[ProductSpecKey.Company] ?? null,
      generation: specs[ProductSpecKey.Generation] ?? null,
      marketSegment: specs[ProductSpecKey.MarketSegment] ?? null,
      launchPrice: specs[ProductSpecKey.LaunchPrice] ?? null,
      releaseDate: specs[ProductSpecKey.ReleaseDate] ?? null,
      productionStatus: specs[ProductSpecKey.ProductionStatus] ?? null,

      // Processor
      gpuName: specs[ProductSpecKey.GpuName] ?? null,
      gpuVariant: specs[ProductSpecKey.GpuVariant] ?? null,
      architecture: specs[ProductSpecKey.Architecture] ?? null,
      foundry: specs[ProductSpecKey.Foundry] ?? null,
      lithography: specs[ProductSpecKey.Lithography] ?? null,
      transistors: specs[ProductSpecKey.Transistors] ?? null,
      dieSize: specs[ProductSpecKey.DieSize] ?? null,

      // Board Compatibility & Dimensions
      slotWidth: specs[ProductSpecKey.SlotWidth] ?? null,
      length: specs[ProductSpecKey.Length] ?? null,
      width: specs[ProductSpecKey.Width] ?? null,
      height: specs[ProductSpecKey.Height] ?? null,
      weight: specs[ProductSpecKey.Weight] ?? null,
      busInterface: specs[ProductSpecKey.BusInterface] ?? null,
      tdp: specs[ProductSpecKey.Tdp] ?? null,
      suggestedPsu: specs[ProductSpecKey.SuggestedPsu] ?? null,
      powerConnectors: specs[ProductSpecKey.PowerConnectors] ?? null,
      boardNumber: specs[ProductSpecKey.BoardNumber] ?? null,

      // Cores & Clock Speeds
      cudaCores: specs[ProductSpecKey.CudaCores] ?? null,
      tmus: specs[ProductSpecKey.Tmus] ?? null,
      rops: specs[ProductSpecKey.Rops] ?? null,
      tensorCores: specs[ProductSpecKey.TensorCores] ?? null,
      rtCores: specs[ProductSpecKey.RtCores] ?? null,
      baseClock: specs[ProductSpecKey.ClockSpeedBase] ?? null,
      boostClock: specs[ProductSpecKey.ClockSpeedBoost] ?? null,
      l1Cache: specs[ProductSpecKey.L1Cache] ?? null,
      l2Cache: specs[ProductSpecKey.L2Cache] ?? null,

      // Theoretical Performance
      pixelRate: specs[ProductSpecKey.PixelFillRate] ?? null,
      textureRate: specs[ProductSpecKey.TextureRate] ?? null,
      fp32Performance: specs[ProductSpecKey.Fp32Performance] ?? null,
      fp64Performance: specs[ProductSpecKey.Fp64Performance] ?? null,

      // Memory
      memorySize: specs[ProductSpecKey.MemorySize] ?? null,
      memoryType: specs[ProductSpecKey.MemoryType] ?? null,
      memoryInterface: specs[ProductSpecKey.MemoryInterface] ?? null,
      memoryBandwidth: specs[ProductSpecKey.MemoryBandwidth] ?? null,

      // Display Connectivity
      maxResolution: specs[ProductSpecKey.MaxResolution] ?? null,
      displayPorts: specs[ProductSpecKey.DisplayPorts] ?? null,
      hdmiPorts: specs[ProductSpecKey.HdmiPorts] ?? null,

      // API Support
      directXVersion: specs[ProductSpecKey.DirectXVersion] ?? null,
      openClVersion: specs[ProductSpecKey.OpenClVersion] ?? null,
      openGlVersion: specs[ProductSpecKey.OpenGlVersion] ?? null,
      cudaVersion: specs[ProductSpecKey.CudaVersion] ?? null,
      shaderModelVersion: specs[ProductSpecKey.ShaderModelVersion] ?? null,
      gSyncFreeSyncSupport: specs[ProductSpecKey.GSyncFreeSyncSupport] ?? null,
      sliCrossfireSupport: specs[ProductSpecKey.SliCrossfireSupport] ?? null,
      vrReady: specs[ProductSpecKey.VrReady] ?? null,

      benchmarks: toFormBenchmarks(gpu),
      reviews: toFormReviews(gpu),

      autocompleteImage,
      thumbnailImage,
      detailsImages,
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

  const {
    fields: detailsImagesFields,
    append: appendImage,
    remove: removeImage,
    swap: swapImage,
  } = useFieldArray({
    control,
    name: 'detailsImages',
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
        images: toRequestImages(formData),
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
                initialProduct={gpu?.parent} // TODO: create product cache
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
            render={({ field }) => <TextInput {...field} ref={null} />}
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
            render={({ field }) => <TextInput {...field} ref={null} />}
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
            render={({ field }) => (
              <ProductMetaField
                field={ProductMetaKey.Description}
                {...field}
                ref={null}
              />
            )}
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
              <ProductSpecField
                field={ProductSpecKey.Company}
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
              <ProductSpecField
                field={ProductSpecKey.Generation}
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
              <ProductSpecField
                field={ProductSpecKey.MarketSegment}
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
            render={({ field }) => (
              <ProductSpecField
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
              <ProductSpecField
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
              <ProductSpecField
                field={ProductSpecKey.ProductionStatus}
                {...field}
                ref={null}
              />
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
                <ProductSpecField
                  field={ProductSpecKey.GpuName}
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
                <ProductSpecField
                  field={ProductSpecKey.GpuVariant}
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
                <ProductSpecField
                  field={ProductSpecKey.Architecture}
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
                <ProductSpecField
                  field={ProductSpecKey.Foundry}
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
                  field={ProductSpecKey.SlotWidth}
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
                  field={ProductSpecKey.BusInterface}
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
                  field={ProductSpecKey.PowerConnectors}
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
                  field={ProductSpecKey.MemoryType}
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
                <ProductSpecField
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
                <ProductSpecField
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
                <ProductSpecField
                  field={ProductSpecKey.MaxResolution}
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
                <ProductSpecField
                  field={ProductSpecKey.DisplayPorts}
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
                <ProductSpecField
                  field={ProductSpecKey.HdmiPorts}
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
                <ProductSpecField
                  field={ProductSpecKey.DirectXVersion}
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
                <ProductSpecField
                  field={ProductSpecKey.GSyncFreeSyncSupport}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            SLI / Crossfire Support
            <Controller
              name="sliCrossfireSupport"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.SliCrossfireSupport}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            VR Ready
            <Controller
              name="vrReady"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.VrReady}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Open CL Version
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.OpenClVersion}
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
                <ProductSpecField
                  field={ProductSpecKey.OpenGlVersion}
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
                <ProductSpecField
                  field={ProductSpecKey.ShaderModelVersion}
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
            <BenchmarksField
              fields={benchmarkFields}
              onAppend={() => appendBenchmark({ value: null, source: null })}
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
            <ReviewsField
              fields={reviewFields}
              onAppend={() => appendReview({ value: null, source: null })}
              onRemove={(i) => removeReview(i)}
              {...field}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Images</h2>

        <Field>
          Autocomplete Image
          <Controller
            name="autocompleteImage"
            control={control}
            render={({ field }) => (
              <ProductImageField
                type={ProductImageType.Autocomplete}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Thumbnail Image
          <Controller
            name="thumbnailImage"
            control={control}
            render={({ field }) => (
              <ProductImageField
                type={ProductImageType.Thumbnail}
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <h3 className="mb-4">Product Images</h3>

        <Controller
          name="detailsImages"
          control={control}
          render={({ field }) => (
            <ProductImagesField
              fields={detailsImagesFields}
              type={ProductImageType.Details}
              onAppend={() => appendImage({ type: null, image: null })}
              onRemove={removeImage}
              onSwap={swapImage}
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

function toMetaArray(formData: ProductFormData): ProductMeta[] {
  const metas = [formData.description];
  return metas.filter((meta) => meta != null);
}

function toSpecsArray(formData: ProductFormData): ProductSpec[] {
  const specs = [
    formData.architecture,
    formData.baseClock,
    formData.boardNumber,
    formData.boostClock,
    formData.busInterface,
    formData.company,
    formData.cudaCores,
    formData.cudaVersion,
    formData.dieSize,
    formData.directXVersion,
    formData.displayPorts,
    formData.foundry,
    formData.fp32Performance,
    formData.fp64Performance,
    formData.generation,
    formData.gpuName,
    formData.gpuVariant,
    formData.gSyncFreeSyncSupport,
    formData.hdmiPorts,
    formData.height,
    formData.l1Cache,
    formData.l2Cache,
    formData.launchPrice,
    formData.length,
    formData.lithography,
    formData.marketSegment,
    formData.maxResolution,
    formData.memoryBandwidth,
    formData.memoryInterface,
    formData.memorySize,
    formData.memoryType,
    formData.openClVersion,
    formData.openGlVersion,
    formData.pixelRate,
    formData.powerConnectors,
    formData.productionStatus,
    formData.releaseDate,
    formData.rtCores,
    formData.rops,
    formData.shaderModelVersion,
    formData.sliCrossfireSupport,
    formData.slotWidth,
    formData.suggestedPsu,
    formData.tdp,
    formData.tensorCores,
    formData.textureRate,
    formData.tmus,
    formData.transistors,
    formData.vrReady,
    formData.weight,
    formData.width,
  ];

  return specs.filter((spec) => spec != null);
}

function toFormBenchmarks(gpu?: Product): ProductBenchmarkFormData[] {
  return (
    gpu?.benchmarks?.map((benchmark) => ({
      key: benchmark.key,
      value: benchmark.value,
      source: benchmark.source ?? null,
    })) ?? []
  );
}

function toRequestBenchmarks(formData: ProductFormData): ProductBenchmark[] {
  return (
    formData.benchmarks?.map((benchmark) => ({
      key: benchmark.key,
      value: benchmark.value,
      source: benchmark.source ?? null,
    })) ?? []
  );
}

function toFormReviews(gpu?: Product): ProductReviewFormData[] {
  return (
    gpu?.reviews?.map((review) => ({
      key: review.key,
      value: review.value,
      source: review.source ?? null,
    })) ?? []
  );
}

function toRequestReviews(formData: ProductFormData): ProductReview[] {
  return (
    formData.reviews?.map((review) => ({
      key: review.key,
      value: review.value,
      source: review.source ?? null,
    })) ?? []
  );
}

function getFormImages(gpu?: Product) {
  let autocompleteImage: ProductImageFormData = {
    type: ProductImageType.Autocomplete,
    image: null,
  };
  let thumbnailImage: ProductImageFormData = {
    type: ProductImageType.Thumbnail,
    image: null,
  };
  const detailsImages: ProductImageFormData[] = [];

  const images =
    gpu?.images?.sort((a, b) => a.metadata.order - b.metadata.order) ?? [];

  images.forEach((value) => {
    if (value.type === ProductImageType.Autocomplete) {
      autocompleteImage = { type: value.type, image: value.image };
    } else if (value.type === ProductImageType.Thumbnail) {
      thumbnailImage = { type: value.type, image: value.image };
    } else {
      detailsImages.push({ type: value.type, image: value.image });
    }
  });

  return { autocompleteImage, thumbnailImage, detailsImages };
}

function toRequestImages(formData: ProductFormData): ProductImage[] {
  const images: ProductImage[] = [];

  if (formData.autocompleteImage?.image) {
    images.push({
      type: formData.autocompleteImage.type,
      imageId: formData.autocompleteImage.image.id,
      metadata: {},
    });
  }

  if (formData.thumbnailImage?.image) {
    images.push({
      type: formData.thumbnailImage.type,
      imageId: formData.thumbnailImage.image.id,
      metadata: {},
    });
  }

  if (formData.detailsImages) {
    const detailsImages = formData.detailsImages.filter(
      (detailsImage) => detailsImage.image,
    );
    images.push(
      ...detailsImages.map((value, i) => ({
        type: value.type,
        imageId: value.image.id,
        metadata: { order: i },
      })),
    );
  }

  return images;
}
