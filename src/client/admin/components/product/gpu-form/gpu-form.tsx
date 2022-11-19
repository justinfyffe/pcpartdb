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
  showDialog,
  Spinner,
  TextInput,
} from '@client/shared/components';
import { isBadRequestError, setValidationErrors } from '@client/shared/error';
import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Benchmark,
  BenchmarksRequest,
  benchmarkValidator,
} from '@shared/benchmark';
import { ApiError, ValidationErrorType } from '@shared/error';
import {
  ImportProductResults,
  Product,
  ProductRequest,
  ProductType,
} from '@shared/product';
import {
  ProductImage,
  ProductImagesRequest,
  productImageValidator,
} from '@shared/product-image';
import {
  ProductMeta,
  ProductMetasRequest,
  productMetaValidator,
} from '@shared/product-meta';
import { RetailModel } from '@shared/retail-model';
import { Review, ReviewsRequest, reviewValidator } from '@shared/review';
import {
  MarketSegmentValue,
  Spec,
  SpecsRequest,
  specValidator,
} from '@shared/spec';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import { BenchmarkField } from '../benchmark-field';
import { ImportProductDialog } from '../import-product-dialog';
import { ProductImageField, ProductImagesField } from '../product-image-field';
import { RetailModelsField } from '../retail-model-field';
import { ReviewField } from '../review-field';
import { SpecField } from '../spec-field';

interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;

  // General
  company?: Spec<string>;
  marketSegment?: Spec<MarketSegmentValue>;
  launchPriceMsrp?: Spec<number>;
  releaseDate?: Spec<string>;

  // Processor
  gpuName?: Spec<string>;
  architecture?: Spec<string>;
  processSize?: Spec<number>;
  transistors?: Spec<number>;

  // Board Compatibility & Dimensions
  slotWidth?: Spec<string | number>;
  length?: Spec<number>;
  width?: Spec<number>;
  height?: Spec<number>;
  weight?: Spec<number>;
  busInterface?: Spec<string>;
  thermalDesignPower?: Spec<number>;
  suggestedPsu?: Spec<number>;
  powerConnectors?: Spec<string>;
  outputs?: Spec<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: Spec<number>;
  textureMappingUnits?: Spec<number>;
  renderOutputUnits?: Spec<number>;
  tensorCores?: Spec<number>;
  rayTracingCores?: Spec<number>;
  coreClockSpeedBase?: Spec<number>;
  coreClockSpeedBoost?: Spec<number>;
  l1Cache?: Spec<number>;
  l2Cache?: Spec<number>;

  // Theoretical Performance
  pixelFillRate?: Spec<number>;
  textureFillRate?: Spec<number>;
  fp32Performance?: Spec<number>;
  fp64Performance?: Spec<number>;

  // Memory
  memorySize?: Spec<number>;
  memoryType?: Spec<string>;
  memoryClock?: Spec<number>;
  memoryInterface?: Spec<number>;
  memoryBandwidth?: Spec<number>;

  // API Support
  gSyncFreeSyncSupport?: Spec<boolean>;
  sliCrossfireSupport?: Spec<boolean>;
  directXVersion?: Spec<number>;
  openClVersion?: Spec<number>;
  openGlVersion?: Spec<number>;
  shaderModelVersion?: Spec<number>;

  // Benchmarks
  g2dMarkBenchmark?: Benchmark<number>;
  g3dMarkBenchmark?: Benchmark<number>;
  timeSpyGraphicsBenchmark?: Benchmark<number>;

  // Reviews
  amazonReview?: Review<number>;
  pcGamerReview?: Review<number>;
  techRadarReview?: Review<number>;
  techSpotReview?: Review<number>;
  tomsHardwareReview?: Review<number>;

  // Images
  autocompleteImage?: ProductImage;
  thumbnailImage?: ProductImage;
  detailsImages?: ProductImage[];

  // Retail Models
  retailModels?: ProductMeta<RetailModel[]>;
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
  detailsImages: Joi.array().items(productImageValidator.allow(null)),

  // Retail Models
  retailModels: productMetaValidator.allow(null),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Product;
}

function formOptions(gpu?: Product): UseFormProps<ProductFormData> {
  const meta = gpu?.metas || {};
  const specs = gpu?.specs || {};
  const benchmarks = gpu?.benchmarks || {};
  const reviews = gpu?.reviews || {};
  const images = gpu?.images || {};

  return {
    resolver: joiResolver(productValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug || null,
      type: ProductType.GPU,
      name: gpu?.name || null,

      // General
      company: specs.company || null,
      marketSegment: specs.marketSegment || null,
      launchPriceMsrp: specs.launchPrice || null,
      releaseDate: specs.releaseDate || null,

      // Processor
      gpuName: specs.gpuName || null,
      architecture: specs.architecture || null,
      processSize: specs.processSize || null,
      transistors: specs.transistors || null,

      // Board Compatibility & Dimensions
      slotWidth: specs.slotWidth || null,
      length: specs.length || null,
      width: specs.width || null,
      height: specs.height || null,
      weight: specs.weight || null,
      busInterface: specs.busInterface || null,
      thermalDesignPower: specs.thermalDesignPower || null,
      suggestedPsu: specs.suggestedPsu || null,
      powerConnectors: specs.powerConnectors || null,
      outputs: specs.outputs || null,

      // Cores & Clock Speeds
      shaderUnitsCudaCores: specs.shaderUnitsCudaCores || null,
      textureMappingUnits: specs.textureMappingUnits || null,
      renderOutputUnits: specs.renderOutputUnits || null,
      tensorCores: specs.tensorCores || null,
      rayTracingCores: specs.rayTracingCores || null,
      coreClockSpeedBase: specs.coreClockSpeedBase || null,
      coreClockSpeedBoost: specs.coreClockSpeedBoost || null,
      l1Cache: specs.l1Cache || null,
      l2Cache: specs.l2Cache || null,

      // Theoretical Performance
      pixelFillRate: specs.pixelFillRate || null,
      textureFillRate: specs.textureFillRate || null,
      fp32Performance: specs.fp32Performance || null,
      fp64Performance: specs.fp64Performance || null,

      // Memory
      memorySize: specs.memorySize || null,
      memoryType: specs.memoryType || null,
      memoryClock: specs.memoryClock || null,
      memoryInterface: specs.memoryInterface || null,
      memoryBandwidth: specs.memoryBandwidth || null,

      // API Support
      gSyncFreeSyncSupport: specs.gSyncFreeSyncSupport || null,
      sliCrossfireSupport: specs.sliCrossfireSupport || null,
      directXVersion: specs.directXVersion || null,
      openClVersion: specs.openClVersion || null,
      openGlVersion: specs.openGlVersion || null,
      shaderModelVersion: specs.shaderModelVersion || null,

      // Benchmarks
      g2dMarkBenchmark: benchmarks.g2dMark || null,
      g3dMarkBenchmark: benchmarks.g3dMark || null,
      timeSpyGraphicsBenchmark: benchmarks.timeSpyGraphics || null,

      // Reviews
      amazonReview: reviews.amazon || null,
      pcGamerReview: reviews.pcGamer || null,
      techRadarReview: reviews.techRadar || null,
      techSpotReview: reviews.techSpot || null,
      tomsHardwareReview: reviews.tomsHardware || null,

      // Images
      autocompleteImage: images.autocomplete || null,
      thumbnailImage: images.thumbnail || null,
      detailsImages: images.details || [],

      // RetailModels,
      retailModels: meta.retailModels || null,
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
  const importRef = useRef(null);

  const form = useMemo(() => formOptions(gpu), [gpu]);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>(form);

  console.log(errors);

  const handleSave = useCallback(
    async (formData: ProductFormData) => {
      setSaving(true);

      const request: ProductRequest = {
        slug: formData.slug,
        type: formData.type,
        name: formData.name,
        metas: toMetaRequest(formData),
        specs: toSpecsRequest(formData),
        benchmarks: toBenchmarksRequest(formData),
        reviews: toReviewsRequest(formData),
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

  const handleImport = useCallback(
    (data: ImportProductResults) => {
      Object.keys(data.specs).forEach((specKey) => {
        console.log(data.specs[specKey]);
        setValue(specKey as any, data.specs[specKey]);
      });
    },
    [setValue],
  );

  const handleImportClick = useCallback(() => {
    const url: string = importRef.current.value;
    showDialog(<ImportProductDialog url={url} onImport={handleImport} />, {
      disableClose: true,
    });
  }, [handleImport]);

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

      <section className="border-b border-b-slate-300 mb-6">
        <Field>
          Import Data
          <div className="flex gap-4">
            <TextInput ref={importRef} className="flex-1" />
            <Button
              variant={ButtonVariant.Secondary}
              onClick={handleImportClick}
            >
              Import
            </Button>
          </div>
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
      </section>

      <section>
        <h2 className="mb-4">General Info</h2>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <SpecField field="company" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <SpecField field="marketSegment" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPriceMsrp"
            control={control}
            render={({ field }) => (
              <SpecField field="launchPrice" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Release Date
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <SpecField field="releaseDate" {...field} ref={null} />
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
                <SpecField field="gpuName" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <SpecField field="architecture" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <SpecField field="processSize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <SpecField field="transistors" {...field} ref={null} />
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
                <SpecField field="memorySize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <SpecField field="memoryType" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Clock
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <SpecField field="memoryClock" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <SpecField field="memoryInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Bandwidth
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => (
                <SpecField field="memoryBandwidth" {...field} ref={null} />
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
                <SpecField field="slotWidth" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <SpecField field="length" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <SpecField field="width" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <SpecField field="height" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <SpecField field="weight" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <SpecField field="busInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Thermal Design Power (TDP)
            <Controller
              name="thermalDesignPower"
              control={control}
              render={({ field }) => (
                <SpecField field="thermalDesignPower" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Suggested PSU
            <Controller
              name="suggestedPsu"
              control={control}
              render={({ field }) => (
                <SpecField field="suggestedPsu" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <SpecField field="powerConnectors" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Outputs
            <Controller
              name="outputs"
              control={control}
              render={({ field }) => (
                <SpecField field="outputs" {...field} ref={null} />
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
                <SpecField field="shaderUnitsCudaCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Texture Mapping Units (TMUs)
            <Controller
              name="textureMappingUnits"
              control={control}
              render={({ field }) => (
                <SpecField field="textureMappingUnits" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Render Output Units (ROPs)
            <Controller
              name="renderOutputUnits"
              control={control}
              render={({ field }) => (
                <SpecField field="renderOutputUnits" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Tensor Cores
            <Controller
              name="tensorCores"
              control={control}
              render={({ field }) => (
                <SpecField field="tensorCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Ray Tracing Cores (RT Cores)
            <Controller
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <SpecField field="rayTracingCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Base)
            <Controller
              name="coreClockSpeedBase"
              control={control}
              render={({ field }) => (
                <SpecField field="coreClockSpeedBase" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Boost)
            <Controller
              name="coreClockSpeedBoost"
              control={control}
              render={({ field }) => (
                <SpecField field="coreClockSpeedBoost" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            L1 Cache
            <Controller
              name="l1Cache"
              control={control}
              render={({ field }) => (
                <SpecField field="l1Cache" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <SpecField field="l2Cache" {...field} ref={null} />
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
                <SpecField field="pixelFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Texture Fill Rate
            <Controller
              name="textureFillRate"
              control={control}
              render={({ field }) => (
                <SpecField field="textureFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP32 Performance
            <Controller
              name="fp32Performance"
              control={control}
              render={({ field }) => (
                <SpecField field="fp32Performance" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP64 Performance
            <Controller
              name="fp64Performance"
              control={control}
              render={({ field }) => (
                <SpecField field="fp64Performance" {...field} ref={null} />
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
                <SpecField field="directXVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open CL Version
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <SpecField field="openClVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open GL Version
            <Controller
              name="openGlVersion"
              control={control}
              render={({ field }) => (
                <SpecField field="openGlVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Shader Model Version
            <Controller
              name="shaderModelVersion"
              control={control}
              render={({ field }) => (
                <SpecField field="shaderModelVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            G-Sync / Free-Sync Support
            <Controller
              name="gSyncFreeSyncSupport"
              control={control}
              render={({ field }) => (
                <SpecField field="gSyncFreeSyncSupport" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            SLI / Crossfire Support
            <Controller
              name="sliCrossfireSupport"
              control={control}
              render={({ field }) => (
                <SpecField field="sliCrossfireSupport" {...field} ref={null} />
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
            <BenchmarkField field="g3dMark" {...field} ref={null} />
          )}
        />

        <Controller
          name="g2dMarkBenchmark"
          control={control}
          render={({ field }) => (
            <BenchmarkField field="g2dMark" {...field} ref={null} />
          )}
        />

        <Controller
          name="timeSpyGraphicsBenchmark"
          control={control}
          render={({ field }) => (
            <BenchmarkField field="timeSpyGraphics" {...field} ref={null} />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Reviews</h2>

        <Controller
          name="amazonReview"
          control={control}
          render={({ field }) => (
            <ReviewField field="amazon" {...field} ref={null} />
          )}
        />

        <Controller
          name="pcGamerReview"
          control={control}
          render={({ field }) => (
            <ReviewField field="pcGamer" {...field} ref={null} />
          )}
        />

        <Controller
          name="techRadarReview"
          control={control}
          render={({ field }) => (
            <ReviewField field="techRadar" {...field} ref={null} />
          )}
        />

        <Controller
          name="techSpotReview"
          control={control}
          render={({ field }) => (
            <ReviewField field="techSpot" {...field} ref={null} />
          )}
        />

        <Controller
          name="tomsHardwareReview"
          control={control}
          render={({ field }) => (
            <ReviewField field="tomsHardware" {...field} ref={null} />
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
            render={({ field }) => <ProductImageField {...field} ref={null} />}
          />
        </Field>

        <Field>
          Thumbnail Image
          <Controller
            name="thumbnailImage"
            control={control}
            render={({ field }) => <ProductImageField {...field} ref={null} />}
          />
        </Field>

        <h3 className="mb-4">Product Images</h3>

        <Controller
          name="detailsImages"
          control={control}
          render={({ field }) => <ProductImagesField {...field} ref={null} />}
        />
      </section>

      <section>
        <h2 className="mb-4">Retail Models</h2>

        <Controller
          name="retailModels"
          control={control}
          render={({ field }) => <RetailModelsField {...field} ref={null} />}
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

function toMetaRequest(formData: ProductFormData): ProductMetasRequest {
  return {
    retailModels: formData.retailModels || null,
  };
}

function toSpecsRequest(formData: ProductFormData): SpecsRequest {
  return {
    // General
    company: formData.company || null,
    marketSegment: formData.marketSegment || null,
    launchPrice: formData.launchPriceMsrp || null,
    releaseDate: formData.releaseDate || null,

    // Processor
    gpuName: formData.gpuName || null,
    architecture: formData.architecture || null,
    processSize: formData.processSize || null,
    transistors: formData.transistors || null,

    // Board Compatibility & Dimensions
    slotWidth: formData.slotWidth || null,
    length: formData.length || null,
    width: formData.width || null,
    height: formData.height || null,
    weight: formData.weight || null,
    busInterface: formData.busInterface || null,
    thermalDesignPower: formData.thermalDesignPower || null,
    suggestedPsu: formData.suggestedPsu || null,
    powerConnectors: formData.powerConnectors || null,
    outputs: formData.outputs || null,

    // Cores & Clock Speeds
    shaderUnitsCudaCores: formData.shaderUnitsCudaCores || null,
    textureMappingUnits: formData.textureMappingUnits || null,
    renderOutputUnits: formData.renderOutputUnits || null,
    tensorCores: formData.tensorCores || null,
    rayTracingCores: formData.rayTracingCores || null,
    coreClockSpeedBase: formData.coreClockSpeedBase || null,
    coreClockSpeedBoost: formData.coreClockSpeedBoost || null,
    l1Cache: formData.l1Cache || null,
    l2Cache: formData.l2Cache || null,

    // Theoretical Performance
    pixelFillRate: formData.pixelFillRate || null,
    textureFillRate: formData.textureFillRate || null,
    fp32Performance: formData.fp32Performance || null,
    fp64Performance: formData.fp64Performance || null,

    // Memory
    memorySize: formData.memorySize || null,
    memoryType: formData.memoryType || null,
    memoryClock: formData.memoryClock || null,
    memoryInterface: formData.memoryInterface || null,
    memoryBandwidth: formData.memoryBandwidth || null,

    // API Support
    gSyncFreeSyncSupport: formData.gSyncFreeSyncSupport || null,
    sliCrossfireSupport: formData.sliCrossfireSupport || null,
    directXVersion: formData.directXVersion || null,
    openClVersion: formData.openClVersion || null,
    openGlVersion: formData.openGlVersion || null,
    shaderModelVersion: formData.shaderModelVersion || null,
  };
}

function toBenchmarksRequest(formData: ProductFormData): BenchmarksRequest {
  return {
    g2dMark: formData.g2dMarkBenchmark || null,
    g3dMark: formData.g3dMarkBenchmark || null,
    timeSpyGraphics: formData.timeSpyGraphicsBenchmark || null,
  };
}

function toReviewsRequest(formData: ProductFormData): ReviewsRequest {
  return {
    amazon: formData.amazonReview || null,
    pcGamer: formData.pcGamerReview || null,
    techRadar: formData.techRadarReview || null,
    techSpot: formData.techSpotReview || null,
    tomsHardware: formData.tomsHardwareReview || null,
  };
}

function toRequestImages(formData: ProductFormData): ProductImagesRequest {
  return {
    autocomplete: formData.autocompleteImage || null,
    thumbnail: formData.thumbnailImage || null,
    details: formData.detailsImages || [],
  };
}
