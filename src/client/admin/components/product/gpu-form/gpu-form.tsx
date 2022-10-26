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
import {
  BenchmarkKey,
  BenchmarkRequest,
  benchmarkValidator,
} from '@shared/benchmark';
import { ApiError, ValidationErrorType } from '@shared/error';
import {
  getBenchmarkMap,
  getProductMetaMap,
  getReviewMap,
  getSpecMap,
  Product,
  ProductRequest,
  ProductType,
} from '@shared/product';
import {
  ProductImageRequest,
  ProductImageType,
  productImageValidator,
} from '@shared/product-image';
import { ProductMetaKey, ProductMetaRequest } from '@shared/product-meta';
import { RetailModel, retailModelValidator } from '@shared/retail-model';
import { ReviewKey, ReviewRequest, reviewValidator } from '@shared/review';
import { SpecKey, SpecRequest, specValidator } from '@shared/spec';
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
import { BenchmarkField } from '../benchmark-field';
import { ProductImageField, ProductImageFields } from '../product-image-field';
import { RetailModelFields } from '../retail-model-field';
import { ReviewField } from '../review-field';
import { SpecField } from '../spec-field';

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;

  // General
  company?: SpecRequest;
  marketSegment?: SpecRequest;
  launchPriceMsrp?: SpecRequest;
  releaseDate?: SpecRequest;

  // Processor
  gpuName?: SpecRequest;
  architecture?: SpecRequest;
  processSize?: SpecRequest;
  transistors?: SpecRequest;

  // Board Compatibility & Dimensions
  slotWidth?: SpecRequest;
  length?: SpecRequest;
  width?: SpecRequest;
  height?: SpecRequest;
  weight?: SpecRequest;
  busInterface?: SpecRequest;
  thermalDesignPower?: SpecRequest;
  suggestedPsu?: SpecRequest;
  powerConnectors?: SpecRequest;
  outputs?: SpecRequest;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: SpecRequest;
  textureMappingUnits?: SpecRequest;
  renderOutputUnits?: SpecRequest;
  tensorCores?: SpecRequest;
  rayTracingCores?: SpecRequest;
  coreClockSpeedBase?: SpecRequest;
  coreClockSpeedBoost?: SpecRequest;
  l1Cache?: SpecRequest;
  l2Cache?: SpecRequest;

  // Theoretical Performance
  pixelFillRate?: SpecRequest;
  textureFillRate?: SpecRequest;
  fp32Performance?: SpecRequest;
  fp64Performance?: SpecRequest;

  // Memory
  memorySize?: SpecRequest;
  memoryType?: SpecRequest;
  memoryClock?: SpecRequest;
  memoryInterface?: SpecRequest;
  memoryBandwidth?: SpecRequest;

  // API Support
  gSyncFreeSyncSupport?: SpecRequest;
  sliCrossfireSupport?: SpecRequest;
  directXVersion?: SpecRequest;
  openClVersion?: SpecRequest;
  openGlVersion?: SpecRequest;
  shaderModelVersion?: SpecRequest;

  // Benchmarks
  g2dMarkBenchmark?: BenchmarkRequest;
  g3dMarkBenchmark?: BenchmarkRequest;
  timeSpyGraphicsBenchmark?: BenchmarkRequest;

  // Reviews
  amazonReview?: ReviewRequest;
  pcGamerReview?: ReviewRequest;
  techRadarReview?: ReviewRequest;
  techSpotReview?: ReviewRequest;
  tomsHardwareReview?: ReviewRequest;

  // Images
  autocompleteImage?: ProductImageRequest;
  thumbnailImage?: ProductImageRequest;
  detailsImages?: ProductImageRequest[];

  // Retail Models
  retailModels?: RetailModel[];
}

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),

  // General
  company: specValidator.allow(null),
  marketSegment: specValidator.allow(null),
  launchPriceMsrp: specValidator.allow(null),
  releaseDate: specValidator.allow(null),

  // Processor
  gpuName: specValidator.allow(null),
  architecture: specValidator.allow(null),
  processSize: specValidator.allow(null),
  transistors: specValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: specValidator.allow(null),
  length: specValidator.allow(null),
  width: specValidator.allow(null),
  height: specValidator.allow(null),
  weight: specValidator.allow(null),
  busInterface: specValidator.allow(null),
  thermalDesignPower: specValidator.allow(null),
  suggestedPsu: specValidator.allow(null),
  powerConnectors: specValidator.allow(null),
  outputs: specValidator.allow(null),

  // Cores & Clock Speed
  shaderUnitsCudaCores: specValidator.allow(null),
  textureMappingUnits: specValidator.allow(null),
  renderOutputUnits: specValidator.allow(null),
  tensorCores: specValidator.allow(null),
  rayTracingCores: specValidator.allow(null),
  coreClockSpeedBase: specValidator.allow(null),
  coreClockSpeedBoost: specValidator.allow(null),
  l1Cache: specValidator.allow(null),
  l2Cache: specValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: specValidator.allow(null),
  textureFillRate: specValidator.allow(null),
  fp32Performance: specValidator.allow(null),
  fp64Performance: specValidator.allow(null),

  // Memory
  memorySize: specValidator.allow(null),
  memoryType: specValidator.allow(null),
  memoryClock: specValidator.allow(null),
  memoryInterface: specValidator.allow(null),
  memoryBandwidth: specValidator.allow(null),

  // API Support
  gSyncFreeSyncSupport: specValidator.allow(null),
  sliCrossfireSupport: specValidator.allow(null),
  directXVersion: specValidator.allow(null),
  openClVersion: specValidator.allow(null),
  openGlVersion: specValidator.allow(null),
  shaderModelVersion: specValidator.allow(null),

  // Benchmarks
  g2dMarkBenchmark: benchmarkValidator.allow(null),
  g3dMarkBenchmark: benchmarkValidator.allow(null),
  timeSpyGraphicsBenchmark: benchmarkValidator.allow(null),

  // Reviews
  amazonReview: reviewValidator.allow(null),
  pcGamerReview: reviewValidator.allow(null),
  techRadarReview: reviewValidator.allow(null),
  techSpotReview: reviewValidator.allow(null),
  tomsHardwareReview: reviewValidator.allow(null),

  // Images
  autocompleteImage: productImageValidator.allow(null),
  thumbnailImage: productImageValidator.allow(null),
  detailsImages: Joi.array().items(productImageValidator),

  // Retail Models
  retailModels: Joi.array().items(retailModelValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = gpu != null ? getProductMetaMap(gpu) : {};
  const specs = gpu != null ? getSpecMap(gpu) : {};
  const benchmarks = gpu != null ? getBenchmarkMap(gpu) : {};
  const reviews = gpu != null ? getReviewMap(gpu) : {};
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
      company: specs[SpecKey.Company] ?? null,
      marketSegment: specs[SpecKey.MarketSegment] ?? null,
      launchPriceMsrp: specs[SpecKey.LaunchPriceMsrp] ?? null,
      releaseDate: specs[SpecKey.ReleaseDate] ?? null,

      // Processor
      gpuName: specs[SpecKey.GpuName] ?? null,
      architecture: specs[SpecKey.Architecture] ?? null,
      processSize: specs[SpecKey.ProcessSize] ?? null,
      transistors: specs[SpecKey.Transistors] ?? null,

      // Board Compatibility & Dimensions
      slotWidth: specs[SpecKey.SlotWidth] ?? null,
      length: specs[SpecKey.Length] ?? null,
      width: specs[SpecKey.Width] ?? null,
      height: specs[SpecKey.Height] ?? null,
      weight: specs[SpecKey.Weight] ?? null,
      busInterface: specs[SpecKey.BusInterface] ?? null,
      thermalDesignPower: specs[SpecKey.ThermalDesignPower] ?? null,
      suggestedPsu: specs[SpecKey.SuggestedPsu] ?? null,
      powerConnectors: specs[SpecKey.PowerConnectors] ?? null,
      outputs: specs[SpecKey.Outputs] ?? null,

      // Cores & Clock Speeds
      shaderUnitsCudaCores: specs[SpecKey.ShaderUnitsCudaCores] ?? null,
      textureMappingUnits: specs[SpecKey.TextureMappingUnits] ?? null,
      renderOutputUnits: specs[SpecKey.RenderOutputUnits] ?? null,
      tensorCores: specs[SpecKey.TensorCores] ?? null,
      rayTracingCores: specs[SpecKey.RayTracingCores] ?? null,
      coreClockSpeedBase: specs[SpecKey.CoreClockSpeedBase] ?? null,
      coreClockSpeedBoost: specs[SpecKey.CoreClockSpeedBoost] ?? null,
      l1Cache: specs[SpecKey.L1Cache] ?? null,
      l2Cache: specs[SpecKey.L2Cache] ?? null,

      // Theoretical Performance
      pixelFillRate: specs[SpecKey.PixelFillRate] ?? null,
      textureFillRate: specs[SpecKey.TextureFillRate] ?? null,
      fp32Performance: specs[SpecKey.Fp32Performance] ?? null,
      fp64Performance: specs[SpecKey.Fp64Performance] ?? null,

      // Memory
      memorySize: specs[SpecKey.MemorySize] ?? null,
      memoryType: specs[SpecKey.MemoryType] ?? null,
      memoryClock: specs[SpecKey.MemoryClock] ?? null,
      memoryInterface: specs[SpecKey.MemoryInterface] ?? null,
      memoryBandwidth: specs[SpecKey.MemoryBandwidth] ?? null,

      // API Support
      gSyncFreeSyncSupport: specs[SpecKey.GSyncFreeSyncSupport] ?? null,
      sliCrossfireSupport: specs[SpecKey.SliCrossfireSupport] ?? null,
      directXVersion: specs[SpecKey.DirectXVersion] ?? null,
      openClVersion: specs[SpecKey.OpenClVersion] ?? null,
      openGlVersion: specs[SpecKey.OpenGlVersion] ?? null,
      shaderModelVersion: specs[SpecKey.ShaderModelVersion] ?? null,

      // Benchmarks
      g2dMarkBenchmark: benchmarks[BenchmarkKey.G2dMark] ?? null,
      g3dMarkBenchmark: benchmarks[BenchmarkKey.G3dMark] ?? null,
      timeSpyGraphicsBenchmark:
        benchmarks[BenchmarkKey.TimeSpyGraphics] ?? null,

      // Reviews
      amazonReview: reviews[ReviewKey.Amazon] ?? null,
      pcGamerReview: reviews[ReviewKey.PcGamer] ?? null,
      techRadarReview: reviews[ReviewKey.TechRadar] ?? null,
      techSpotReview: reviews[ReviewKey.TechSpot] ?? null,
      tomsHardwareReview: reviews[ReviewKey.TomsHardware] ?? null,

      // Images
      autocompleteImage,
      thumbnailImage,
      detailsImages,

      // RetailModels,
      retailModels:
        (meta[ProductMetaKey.RetailModels]?.jsonValue as RetailModel[]) ?? [],
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
              <SpecField field={SpecKey.Company} {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <SpecField field={SpecKey.MarketSegment} {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPriceMsrp"
            control={control}
            render={({ field }) => (
              <SpecField
                field={SpecKey.LaunchPriceMsrp}
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
              <SpecField field={SpecKey.ReleaseDate} {...field} ref={null} />
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
                <SpecField field={SpecKey.GpuName} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Architecture} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.ProcessSize} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Transistors} {...field} ref={null} />
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
                <SpecField field={SpecKey.MemorySize} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.MemoryType} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Clock
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.MemoryClock} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.MemoryInterface}
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
                <SpecField
                  field={SpecKey.MemoryBandwidth}
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
                <SpecField field={SpecKey.SlotWidth} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Length} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Width} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Height} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.Weight} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.BusInterface} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Thermal Design Power (TDP)
            <Controller
              name="thermalDesignPower"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.ThermalDesignPower}
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
                <SpecField field={SpecKey.SuggestedPsu} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.PowerConnectors}
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
                <SpecField field={SpecKey.Outputs} {...field} ref={null} />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Cores &amp; Clock Speeds</h3>

          <Field>
            Shader Units / CUDA Cores
            <Controller
              name="shaderUnitsCudaCores"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.ShaderUnitsCudaCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Texture Mapping Units (TMUs)
            <Controller
              name="textureMappingUnits"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.TextureMappingUnits}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Render Output Units (ROPs)
            <Controller
              name="renderOutputUnits"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.RenderOutputUnits}
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
                <SpecField field={SpecKey.TensorCores} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Ray Tracing Cores (RT Cores)
            <Controller
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.RayTracingCores}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Base)
            <Controller
              name="coreClockSpeedBase"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.CoreClockSpeedBase}
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Boost)
            <Controller
              name="coreClockSpeedBoost"
              control={control}
              render={({ field }) => (
                <SpecField
                  field={SpecKey.CoreClockSpeedBoost}
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
                <SpecField field={SpecKey.L1Cache} {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <SpecField field={SpecKey.L2Cache} {...field} ref={null} />
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
                <SpecField
                  field={SpecKey.PixelFillRate}
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
                <SpecField
                  field={SpecKey.TextureFillRate}
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
                <SpecField
                  field={SpecKey.Fp32Performance}
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
                <SpecField
                  field={SpecKey.Fp64Performance}
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
                <SpecField
                  field={SpecKey.DirectXVersion}
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
                <SpecField
                  field={SpecKey.GSyncFreeSyncSupport}
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
                <SpecField
                  field={SpecKey.SliCrossfireSupport}
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
                <SpecField
                  field={SpecKey.OpenClVersion}
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
                <SpecField
                  field={SpecKey.OpenGlVersion}
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
                <SpecField
                  field={SpecKey.ShaderModelVersion}
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
            <BenchmarkField
              benchmarkKey={BenchmarkKey.G3dMark}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="g2dMarkBenchmark"
          control={control}
          render={({ field }) => (
            <BenchmarkField
              benchmarkKey={BenchmarkKey.G2dMark}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="timeSpyGraphicsBenchmark"
          control={control}
          render={({ field }) => (
            <BenchmarkField
              benchmarkKey={BenchmarkKey.TimeSpyGraphics}
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
            <ReviewField reviewKey={ReviewKey.Amazon} {...field} ref={null} />
          )}
        />

        <Controller
          name="pcGamerReview"
          control={control}
          render={({ field }) => (
            <ReviewField reviewKey={ReviewKey.PcGamer} {...field} ref={null} />
          )}
        />

        <Controller
          name="techRadarReview"
          control={control}
          render={({ field }) => (
            <ReviewField
              reviewKey={ReviewKey.TechRadar}
              {...field}
              ref={null}
            />
          )}
        />

        <Controller
          name="techSpotReview"
          control={control}
          render={({ field }) => (
            <ReviewField reviewKey={ReviewKey.TechSpot} {...field} ref={null} />
          )}
        />

        <Controller
          name="tomsHardwareReview"
          control={control}
          render={({ field }) => (
            <ReviewField
              reviewKey={ReviewKey.TomsHardware}
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
            <RetailModelFields
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

function toSpecsArray(formData: ProductFormData): SpecRequest[] {
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

function toBenchmarksArray(formData: ProductFormData): BenchmarkRequest[] {
  const benchmarks = [
    formData.g2dMarkBenchmark,
    formData.g3dMarkBenchmark,
    formData.timeSpyGraphicsBenchmark,
  ];

  return benchmarks.filter((benchmark) => benchmark != null);
}

function toReviewsArray(formData: ProductFormData): ReviewRequest[] {
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
