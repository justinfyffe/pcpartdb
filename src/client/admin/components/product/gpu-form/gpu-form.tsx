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
  getProductBenchmarkMap,
  getProductMetaMap,
  getProductReviewMap,
  getProductSpecMap,
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
import { ProductMetaKey, ProductMetaRequest } from '@shared/product-meta';
import {
  ProductRetailModel,
  productRetailModelValidator,
} from '@shared/product-retail-model';
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
import { ProductRetailModelFields } from '../product-retail-model-field';
import { ProductReviewField } from '../product-review-field';
import { ProductSpecField } from '../product-spec-field';
import { ProductBenchmarkField } from './../product-benchmark-field';

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;

  // General
  company?: ProductSpecRequest;
  marketSegment?: ProductSpecRequest;
  launchPriceMsrp?: ProductSpecRequest;
  releaseDate?: ProductSpecRequest;

  // Processor
  gpuName?: ProductSpecRequest;
  architecture?: ProductSpecRequest;
  processSize?: ProductSpecRequest;
  transistors?: ProductSpecRequest;

  // Board Compatibility & Dimensions
  slotWidth?: ProductSpecRequest;
  length?: ProductSpecRequest;
  width?: ProductSpecRequest;
  height?: ProductSpecRequest;
  weight?: ProductSpecRequest;
  busInterface?: ProductSpecRequest;
  thermalDesignPower?: ProductSpecRequest;
  suggestedPsu?: ProductSpecRequest;
  powerConnectors?: ProductSpecRequest;
  outputs?: ProductSpecRequest;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: ProductSpecRequest;
  textureMappingUnits?: ProductSpecRequest;
  renderOutputUnits?: ProductSpecRequest;
  tensorCores?: ProductSpecRequest;
  rayTracingCores?: ProductSpecRequest;
  coreClockSpeedBase?: ProductSpecRequest;
  coreClockSpeedBoost?: ProductSpecRequest;
  l1Cache?: ProductSpecRequest;
  l2Cache?: ProductSpecRequest;

  // Theoretical Performance
  pixelFillRate?: ProductSpecRequest;
  textureFillRate?: ProductSpecRequest;
  fp32Performance?: ProductSpecRequest;
  fp64Performance?: ProductSpecRequest;

  // Memory
  memorySize?: ProductSpecRequest;
  memoryType?: ProductSpecRequest;
  memoryClock?: ProductSpecRequest;
  memoryInterface?: ProductSpecRequest;
  memoryBandwidth?: ProductSpecRequest;

  // API Support
  gSyncFreeSyncSupport?: ProductSpecRequest;
  sliCrossfireSupport?: ProductSpecRequest;
  directXVersion?: ProductSpecRequest;
  openClVersion?: ProductSpecRequest;
  openGlVersion?: ProductSpecRequest;
  shaderModelVersion?: ProductSpecRequest;

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

  // Retail Models
  retailModels?: ProductRetailModel[];
}

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),

  // General
  company: productSpecValidator.allow(null),
  marketSegment: productSpecValidator.allow(null),
  launchPriceMsrp: productSpecValidator.allow(null),
  releaseDate: productSpecValidator.allow(null),

  // Processor
  gpuName: productSpecValidator.allow(null),
  architecture: productSpecValidator.allow(null),
  processSize: productSpecValidator.allow(null),
  transistors: productSpecValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: productSpecValidator.allow(null),
  length: productSpecValidator.allow(null),
  width: productSpecValidator.allow(null),
  height: productSpecValidator.allow(null),
  weight: productSpecValidator.allow(null),
  busInterface: productSpecValidator.allow(null),
  thermalDesignPower: productSpecValidator.allow(null),
  suggestedPsu: productSpecValidator.allow(null),
  powerConnectors: productSpecValidator.allow(null),
  outputs: productSpecValidator.allow(null),

  // Cores & Clock Speed
  shaderUnitsCudaCores: productSpecValidator.allow(null),
  textureMappingUnits: productSpecValidator.allow(null),
  renderOutputUnits: productSpecValidator.allow(null),
  tensorCores: productSpecValidator.allow(null),
  rayTracingCores: productSpecValidator.allow(null),
  coreClockSpeedBase: productSpecValidator.allow(null),
  coreClockSpeedBoost: productSpecValidator.allow(null),
  l1Cache: productSpecValidator.allow(null),
  l2Cache: productSpecValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: productSpecValidator.allow(null),
  textureFillRate: productSpecValidator.allow(null),
  fp32Performance: productSpecValidator.allow(null),
  fp64Performance: productSpecValidator.allow(null),

  // Memory
  memorySize: productSpecValidator.allow(null),
  memoryType: productSpecValidator.allow(null),
  memoryClock: productSpecValidator.allow(null),
  memoryInterface: productSpecValidator.allow(null),
  memoryBandwidth: productSpecValidator.allow(null),

  // API Support
  gSyncFreeSyncSupport: productSpecValidator.allow(null),
  sliCrossfireSupport: productSpecValidator.allow(null),
  directXVersion: productSpecValidator.allow(null),
  openClVersion: productSpecValidator.allow(null),
  openGlVersion: productSpecValidator.allow(null),
  shaderModelVersion: productSpecValidator.allow(null),

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

  // Retail Models
  retailModels: Joi.array().items(productRetailModelValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = gpu != null ? getProductMetaMap(gpu) : {};
  const specs = gpu != null ? getProductSpecMap(gpu) : {};
  const benchmarks = gpu != null ? getProductBenchmarkMap(gpu) : {};
  const reviews = gpu != null ? getProductReviewMap(gpu) : {};
  const { autocompleteImage, thumbnailImage, detailsImages } =
    getFormImages(gpu);

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug ?? null,
      type: ProductType.GPU,
      name: gpu?.name ?? null,

      // General
      company: specs[ProductSpecKey.Company] ?? null,
      marketSegment: specs[ProductSpecKey.MarketSegment] ?? null,
      launchPriceMsrp: specs[ProductSpecKey.LaunchPriceMsrp] ?? null,
      releaseDate: specs[ProductSpecKey.ReleaseDate] ?? null,

      // Processor
      gpuName: specs[ProductSpecKey.GpuName] ?? null,
      architecture: specs[ProductSpecKey.Architecture] ?? null,
      processSize: specs[ProductSpecKey.ProcessSize] ?? null,
      transistors: specs[ProductSpecKey.Transistors] ?? null,

      // Board Compatibility & Dimensions
      slotWidth: specs[ProductSpecKey.SlotWidth] ?? null,
      length: specs[ProductSpecKey.Length] ?? null,
      width: specs[ProductSpecKey.Width] ?? null,
      height: specs[ProductSpecKey.Height] ?? null,
      weight: specs[ProductSpecKey.Weight] ?? null,
      busInterface: specs[ProductSpecKey.BusInterface] ?? null,
      thermalDesignPower: specs[ProductSpecKey.ThermalDesignPower] ?? null,
      suggestedPsu: specs[ProductSpecKey.SuggestedPsu] ?? null,
      powerConnectors: specs[ProductSpecKey.PowerConnectors] ?? null,
      outputs: specs[ProductSpecKey.Outputs] ?? null,

      // Cores & Clock Speeds
      shaderUnitsCudaCores: specs[ProductSpecKey.ShaderUnitsCudaCores] ?? null,
      textureMappingUnits: specs[ProductSpecKey.TextureMappingUnits] ?? null,
      renderOutputUnits: specs[ProductSpecKey.RenderOutputUnits] ?? null,
      tensorCores: specs[ProductSpecKey.TensorCores] ?? null,
      rayTracingCores: specs[ProductSpecKey.RayTracingCores] ?? null,
      coreClockSpeedBase: specs[ProductSpecKey.CoreClockSpeedBase] ?? null,
      coreClockSpeedBoost: specs[ProductSpecKey.CoreClockSpeedBoost] ?? null,
      l1Cache: specs[ProductSpecKey.L1Cache] ?? null,
      l2Cache: specs[ProductSpecKey.L2Cache] ?? null,

      // Theoretical Performance
      pixelFillRate: specs[ProductSpecKey.PixelFillRate] ?? null,
      textureFillRate: specs[ProductSpecKey.TextureFillRate] ?? null,
      fp32Performance: specs[ProductSpecKey.Fp32Performance] ?? null,
      fp64Performance: specs[ProductSpecKey.Fp64Performance] ?? null,

      // Memory
      memorySize: specs[ProductSpecKey.MemorySize] ?? null,
      memoryType: specs[ProductSpecKey.MemoryType] ?? null,
      memoryClock: specs[ProductSpecKey.MemoryClock] ?? null,
      memoryInterface: specs[ProductSpecKey.MemoryInterface] ?? null,
      memoryBandwidth: specs[ProductSpecKey.MemoryBandwidth] ?? null,

      // API Support
      gSyncFreeSyncSupport: specs[ProductSpecKey.GSyncFreeSyncSupport] ?? null,
      sliCrossfireSupport: specs[ProductSpecKey.SliCrossfireSupport] ?? null,
      directXVersion: specs[ProductSpecKey.DirectXVersion] ?? null,
      openClVersion: specs[ProductSpecKey.OpenClVersion] ?? null,
      openGlVersion: specs[ProductSpecKey.OpenGlVersion] ?? null,
      shaderModelVersion: specs[ProductSpecKey.ShaderModelVersion] ?? null,

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

      // RetailModels,
      retailModels:
        (meta[ProductMetaKey.RetailModels]
          ?.jsonValue as ProductRetailModel[]) ?? [],
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

  const {
    fields: retailModelsFields,
    append: appendRetailModel,
    remove: removeRetailModel,
    swap: swapRetailModel,
  } = useFieldArray({
    control,
    name: 'retailModels',
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
          Launch Price (MSRP)
          <Controller
            name="launchPriceMsrp"
            control={control}
            render={({ field }) => (
              <ProductSpecField
                field={ProductSpecKey.LaunchPriceMsrp}
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
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.ProcessSize}
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
            Memory Clock
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.MemoryClock}
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
              name="thermalDesignPower"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.ThermalDesignPower}
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

          <Field>
            Outputs
            <Controller
              name="outputs"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.Outputs}
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
              name="shaderUnitsCudaCores"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.ShaderUnitsCudaCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            TMUs
            <Controller
              name="textureMappingUnits"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.TextureMappingUnits}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            ROPs
            <Controller
              name="renderOutputUnits"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.RenderOutputUnits}
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
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.RayTracingCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Base Clock
            <Controller
              name="coreClockSpeedBase"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.CoreClockSpeedBase}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Boost Clock
            <Controller
              name="coreClockSpeedBoost"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.CoreClockSpeedBoost}
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
              name="pixelFillRate"
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
              name="textureFillRate"
              control={control}
              render={({ field }) => (
                <ProductSpecField
                  field={ProductSpecKey.TextureFillRate}
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
              onAppend={() => appendImage(null)}
              onRemove={removeImage}
              onSwap={swapImage}
              {...field}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Retail Models</h2>

        <Controller
          name="retailModels"
          control={control}
          render={({ field }) => (
            <ProductRetailModelFields
              fields={retailModelsFields}
              onAppend={() => appendRetailModel(null)}
              onRemove={removeRetailModel}
              onSwap={swapRetailModel}
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
  const metas: ProductMetaRequest[] = [
    formData.retailModels?.length > 0
      ? {
          key: ProductMetaKey.RetailModels,
          jsonValue: JSON.stringify(formData.retailModels),
        }
      : null,
  ];
  return metas.filter((meta) => meta != null);
}

function toSpecsArray(formData: ProductFormData): ProductSpecRequest[] {
  const specs = [
    formData.architecture,
    formData.coreClockSpeedBase,
    formData.coreClockSpeedBoost,
    formData.busInterface,
    formData.company,
    formData.shaderUnitsCudaCores,
    formData.directXVersion,
    formData.fp32Performance,
    formData.fp64Performance,
    formData.gpuName,
    formData.gSyncFreeSyncSupport,
    formData.height,
    formData.l1Cache,
    formData.l2Cache,
    formData.launchPriceMsrp,
    formData.length,
    formData.processSize,
    formData.marketSegment,
    formData.memoryBandwidth,
    formData.memoryInterface,
    formData.memoryClock,
    formData.memorySize,
    formData.memoryType,
    formData.openClVersion,
    formData.openGlVersion,
    formData.pixelFillRate,
    formData.powerConnectors,
    formData.releaseDate,
    formData.rayTracingCores,
    formData.renderOutputUnits,
    formData.shaderModelVersion,
    formData.sliCrossfireSupport,
    formData.slotWidth,
    formData.suggestedPsu,
    formData.thermalDesignPower,
    formData.tensorCores,
    formData.textureFillRate,
    formData.textureMappingUnits,
    formData.transistors,
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
