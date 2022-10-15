import { productService } from '@client/product';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Field,
  FieldError,
  Form,
  FormActions,
  Spinner,
  TextInput,
} from '@client/shared/components';
import { isBadRequestError, setValidationErrors } from '@client/shared/error';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApiError, ValidationErrorType } from '@shared/error';
import {
  getProductBenchmarks,
  getProductMeta,
  getProductReviews,
  getProductSpecs,
  Product,
  ProductRequest,
  ProductType,
} from '@shared/product';
import {
  ProductBenchmarkKey,
  ProductBenchmarkRequest,
  productBenchmarkValidator,
} from '@shared/product-benchmark';
import {
  ProductImageRequest,
  ProductImageType,
  productImageValidator,
} from '@shared/product-image';
import {
  ProductMetaKey,
  ProductMetaRequest,
  productMetaValidator,
} from '@shared/product-meta';
import {
  ProductReviewKey,
  ProductReviewRequest,
  productReviewValidator,
} from '@shared/product-review';
import {
  ProductSpecKey,
  ProductSpecRequest,
  productSpecValidator,
} from '@shared/product-spec';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { ProductImageField, ProductImageFields } from '../product-image-field';
import { ProductMetaField } from '../product-meta-field';
import { ProductReviewField } from '../product-review-field';
import { ProductSpecField } from '../product-spec-field';
import { ProductBenchmarkField } from './../product-benchmark-field';

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;
  description?: ProductMetaRequest;

  // General
  company?: ProductSpecRequest;
  generation?: ProductSpecRequest;
  marketSegment?: ProductSpecRequest;
  launchPrice?: ProductSpecRequest;
  releaseDate?: ProductSpecRequest;
  productionStatus?: ProductSpecRequest;

  // Processor
  gpuName?: ProductSpecRequest;
  gpuVariant?: ProductSpecRequest;
  architecture?: ProductSpecRequest;
  foundry?: ProductSpecRequest;
  lithography?: ProductSpecRequest;
  transistors?: ProductSpecRequest;
  dieSize?: ProductSpecRequest;

  // Board Compatibility & Dimensions
  slotWidth?: ProductSpecRequest;
  length?: ProductSpecRequest;
  width?: ProductSpecRequest;
  height?: ProductSpecRequest;
  weight?: ProductSpecRequest;
  busInterface?: ProductSpecRequest;
  tdp?: ProductSpecRequest;
  suggestedPsu?: ProductSpecRequest;
  powerConnectors?: ProductSpecRequest;

  // Cores & Clock Speeds
  cudaCores?: ProductSpecRequest;
  tmus?: ProductSpecRequest;
  rops?: ProductSpecRequest;
  tensorCores?: ProductSpecRequest;
  rtCores?: ProductSpecRequest;
  baseClock?: ProductSpecRequest;
  boostClock?: ProductSpecRequest;
  l1Cache?: ProductSpecRequest;
  l2Cache?: ProductSpecRequest;

  // Theoretical Performance
  pixelRate?: ProductSpecRequest;
  textureRate?: ProductSpecRequest;
  fp32Performance?: ProductSpecRequest;
  fp64Performance?: ProductSpecRequest;

  // Memory
  memorySize?: ProductSpecRequest;
  memoryType?: ProductSpecRequest;
  memoryInterface?: ProductSpecRequest;
  memoryBandwidth?: ProductSpecRequest;

  // Display Connectivity
  maxResolution?: ProductSpecRequest;
  displayPorts?: ProductSpecRequest;
  hdmiPorts?: ProductSpecRequest;

  // API Support
  directXVersion?: ProductSpecRequest;
  openClVersion?: ProductSpecRequest;
  openGlVersion?: ProductSpecRequest;
  shaderModelVersion?: ProductSpecRequest;
  gSyncFreeSyncSupport?: ProductSpecRequest;
  sliCrossfireSupport?: ProductSpecRequest;
  vrReady?: ProductSpecRequest;

  // Benchmarks
  g2dMarkBenchmark?: ProductBenchmarkRequest;
  g3dMarkBenchmark?: ProductBenchmarkRequest;
  timeSpyGraphicsBenchmark?: ProductBenchmarkRequest;

  // Reviews
  amazonReview?: ProductReviewRequest;
  pcGamerReview?: ProductReviewRequest;
  techRadarReview?: ProductReviewRequest;
  techSpotReview?: ProductReviewRequest;
  tomsHardwareReview?: ProductReviewRequest;

  // Images
  autocompleteImage?: ProductImageRequest;
  thumbnailImage?: ProductImageRequest;
  detailsImages?: ProductImageRequest[];
}

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),

  description: productMetaValidator.allow(null),

  // General
  company: productSpecValidator.allow(null),
  generation: productSpecValidator.allow(null),
  marketSegment: productSpecValidator.allow(null),
  launchPrice: productSpecValidator.allow(null),
  releaseDate: productSpecValidator.allow(null),
  productionStatus: productSpecValidator.allow(null),

  // Processor
  gpuName: productSpecValidator.allow(null),
  gpuVariant: productSpecValidator.allow(null),
  architecture: productSpecValidator.allow(null),
  foundry: productSpecValidator.allow(null),
  lithography: productSpecValidator.allow(null),
  processSize: productSpecValidator.allow(null),
  transistors: productSpecValidator.allow(null),
  dieSize: productSpecValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: productSpecValidator.allow(null),
  length: productSpecValidator.allow(null),
  width: productSpecValidator.allow(null),
  height: productSpecValidator.allow(null),
  weight: productSpecValidator.allow(null),
  busInterface: productSpecValidator.allow(null),
  tdp: productSpecValidator.allow(null),
  suggestedPsu: productSpecValidator.allow(null),
  powerConnectors: productSpecValidator.allow(null),

  // Cores & Clock Speed
  cudaCores: productSpecValidator.allow(null),
  tmus: productSpecValidator.allow(null),
  rops: productSpecValidator.allow(null),
  tensorCores: productSpecValidator.allow(null),
  rtCores: productSpecValidator.allow(null),
  baseClock: productSpecValidator.allow(null),
  boostClock: productSpecValidator.allow(null),
  l1Cache: productSpecValidator.allow(null),
  l2Cache: productSpecValidator.allow(null),

  // Theoretical Performance
  pixelRate: productSpecValidator.allow(null),
  textureRate: productSpecValidator.allow(null),
  fp32Performance: productSpecValidator.allow(null),
  fp64Performance: productSpecValidator.allow(null),

  // Memory
  memorySize: productSpecValidator.allow(null),
  memoryType: productSpecValidator.allow(null),
  memoryInterface: productSpecValidator.allow(null),
  memoryBandwidth: productSpecValidator.allow(null),

  // Display Connectivity
  maxResolution: productSpecValidator.allow(null),
  displayPorts: productSpecValidator.allow(null),
  hdmiPorts: productSpecValidator.allow(null),

  // API Support
  directXVersion: productSpecValidator.allow(null),
  openClVersion: productSpecValidator.allow(null),
  openGlVersion: productSpecValidator.allow(null),
  shaderModelVersion: productSpecValidator.allow(null),
  gSyncFreeSyncSupport: productSpecValidator.allow(null),
  sliCrossfireSupport: productSpecValidator.allow(null),
  vrReady: productSpecValidator.allow(null),

  // Benchmarks
  g2dMarkBenchmark: productBenchmarkValidator.allow(null),
  g3dMarkBenchmark: productBenchmarkValidator.allow(null),
  timeSpyGraphicsBenchmark: productBenchmarkValidator.allow(null),

  // Reviews
  amazonReview: productReviewValidator.allow(null),
  pcGamerReview: productReviewValidator.allow(null),
  techRadarReview: productReviewValidator.allow(null),
  techSpotReview: productReviewValidator.allow(null),
  tomsHardwareReview: productReviewValidator.allow(null),

  // Images
  autocompleteImage: productImageValidator.allow(null),
  thumbnailImage: productImageValidator.allow(null),
  detailsImages: Joi.array().items(productImageValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = gpu != null ? getProductMeta(gpu) : {};
  const specs = gpu != null ? getProductSpecs(gpu) : {};
  const benchmarks = gpu != null ? getProductBenchmarks(gpu) : {};
  const reviews = gpu != null ? getProductReviews(gpu) : {};
  const { autocompleteImage, thumbnailImage, detailsImages } =
    getFormImages(gpu);

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
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
      shaderModelVersion: specs[ProductSpecKey.ShaderModelVersion] ?? null,
      gSyncFreeSyncSupport: specs[ProductSpecKey.GSyncFreeSyncSupport] ?? null,
      sliCrossfireSupport: specs[ProductSpecKey.SliCrossfireSupport] ?? null,
      vrReady: specs[ProductSpecKey.VrReady] ?? null,

      // Benchmarks
      g2dMarkBenchmark: benchmarks[ProductBenchmarkKey.G2dMark] ?? null,
      g3dMarkBenchmark: benchmarks[ProductBenchmarkKey.G3dMark] ?? null,
      timeSpyGraphicsBenchmark:
        benchmarks[ProductBenchmarkKey.TimeSpyGraphics] ?? null,

      // Reviews
      amazonReview: reviews[ProductReviewKey.Amazon] ?? null,
      pcGamerReview: reviews[ProductReviewKey.PcGamer] ?? null,
      techRadarReview: reviews[ProductReviewKey.TechRadar] ?? null,
      techSpotReview: reviews[ProductReviewKey.TechSpot] ?? null,
      tomsHardwareReview: reviews[ProductReviewKey.TomsHardware] ?? null,

      // Images
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

  const form = useMemo(() => formOptions(gpu), [gpu]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>(form);

  console.log(errors);

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
        slug: formData.slug,
        type: formData.type,
        name: formData.name,
        meta: toMetaArray(formData),
        specs: toSpecsArray(formData),
        benchmarks: toBenchmarksArray(formData),
        reviews: toReviewsArray(formData),
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
          name="g3dMarkBenchmark"
          control={control}
          render={({ field }) => (
            <ProductBenchmarkField
              benchmarkKey={ProductBenchmarkKey.G3dMark}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="g2dMarkBenchmark"
          control={control}
          render={({ field }) => (
            <ProductBenchmarkField
              benchmarkKey={ProductBenchmarkKey.G2dMark}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="timeSpyGraphicsBenchmark"
          control={control}
          render={({ field }) => (
            <ProductBenchmarkField
              benchmarkKey={ProductBenchmarkKey.TimeSpyGraphics}
              {...field}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Reviews</h2>

        <Controller
          name="amazonReview"
          control={control}
          render={({ field }) => (
            <ProductReviewField
              reviewKey={ProductReviewKey.Amazon}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="pcGamerReview"
          control={control}
          render={({ field }) => (
            <ProductReviewField
              reviewKey={ProductReviewKey.PcGamer}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="techRadarReview"
          control={control}
          render={({ field }) => (
            <ProductReviewField
              reviewKey={ProductReviewKey.TechRadar}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="techSpotReview"
          control={control}
          render={({ field }) => (
            <ProductReviewField
              reviewKey={ProductReviewKey.TechSpot}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="tomsHardwareReview"
          control={control}
          render={({ field }) => (
            <ProductReviewField
              reviewKey={ProductReviewKey.TomsHardware}
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
            <ProductImageFields
              fields={detailsImagesFields}
              type={ProductImageType.Details}
              onAppend={() => appendImage({})}
              onRemove={removeImage}
              onSwap={swapImage}
              {...field}
              ref={null}
            />
          )}
        />
      </section>

      <FormActions className={isUpdate ? 'justify-between' : 'justify-end'}>
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
          {!saving && <span>Save</span>}
        </Button>
      </FormActions>
    </Form>
  );
};

function toMetaArray(formData: ProductFormData): ProductMetaRequest[] {
  const metas = [formData.description];
  return metas.filter((meta) => meta != null);
}

function toSpecsArray(formData: ProductFormData): ProductSpecRequest[] {
  const specs = [
    formData.architecture,
    formData.baseClock,
    formData.boostClock,
    formData.busInterface,
    formData.company,
    formData.cudaCores,
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

function toBenchmarksArray(
  formData: ProductFormData,
): ProductBenchmarkRequest[] {
  const benchmarks = [
    formData.g2dMarkBenchmark,
    formData.g3dMarkBenchmark,
    formData.timeSpyGraphicsBenchmark,
  ];

  return benchmarks.filter((benchmark) => benchmark != null);
}

function toReviewsArray(formData: ProductFormData): ProductReviewRequest[] {
  const reviews = [
    formData.amazonReview,
    formData.pcGamerReview,
    formData.techRadarReview,
    formData.techSpotReview,
    formData.tomsHardwareReview,
  ];

  return reviews.filter((review) => review != null);
}

function getFormImages(gpu?: Product) {
  let autocompleteImage: ProductImageRequest = null;
  let thumbnailImage: ProductImageRequest = null;
  const detailsImages: ProductImageRequest[] = [];

  const images =
    gpu?.images?.sort((a, b) => a.metadata.order - b.metadata.order) ?? [];

  images.forEach((value) => {
    if (value.type === ProductImageType.Autocomplete) {
      autocompleteImage = {
        type: value.type,
        imageId: value.imageId,
        metadata: value.metadata,
      };
    } else if (value.type === ProductImageType.Thumbnail) {
      thumbnailImage = {
        type: value.type,
        imageId: value.imageId,
        metadata: value.metadata,
      };
    } else {
      detailsImages.push({
        type: value.type,
        imageId: value.imageId,
        metadata: value.metadata,
      });
    }
  });

  return { autocompleteImage, thumbnailImage, detailsImages };
}

function toRequestImages(formData: ProductFormData): ProductImageRequest[] {
  const { autocompleteImage, thumbnailImage, detailsImages } = formData;

  const images: ProductImageRequest[] = [];

  if (autocompleteImage) {
    images.push(autocompleteImage);
  }

  if (thumbnailImage) {
    images.push(thumbnailImage);
  }

  if (detailsImages) {
    images.push(...detailsImages);
  }

  return images;
}
