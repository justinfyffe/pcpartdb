import { gpuService } from '@client/gpus';
import { useGpuCache } from '@client/shared/cache';
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
import { ApiError, ValidationErrorType } from '@shared/error';
import {
  CreateGpuRequest,
  Gpu,
  GpuBenchmark,
  GpuBenchmarks,
  gpuBenchmarkValidator,
  GpuImages,
  gpuImageValidator,
  GpuSpec,
  GpuSpecs,
  gpuSpecValidator,
  MarketSegmentValue,
  UpdateGpuRequest,
} from '@shared/gpus';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps } from 'react-hook-form';
import { GpuBenchmarkField } from '../gpu-benchmark-field';
import { GpuImagesField } from '../gpu-image-field';
import { GpuSlugField } from '../gpu-slug-field';
import { GpuSpecField } from '../gpu-spec-field';
import {
  ImportGpuDataDialog,
  ImportGpuDataResults,
} from '../import-gpu-data-dialog';

interface GpuFormData {
  slug: string;
  name: string;

  // General
  company?: GpuSpec<string>;
  marketSegment?: GpuSpec<MarketSegmentValue>;
  launchPrice?: GpuSpec<number>;
  releaseDate?: GpuSpec<string>;

  // Processor
  codename?: GpuSpec<string>;
  architecture?: GpuSpec<string>;
  processSize?: GpuSpec<number>;
  transistors?: GpuSpec<number>;

  // Board Compatibility & Dimensions
  slotWidth?: GpuSpec<number>;
  length?: GpuSpec<number>;
  width?: GpuSpec<number>;
  height?: GpuSpec<number>;
  weight?: GpuSpec<number>;
  busInterface?: GpuSpec<string>;
  thermalDesignPower?: GpuSpec<number>;
  suggestedPsu?: GpuSpec<number>;
  powerConnectors?: GpuSpec<string>;
  outputs?: GpuSpec<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: GpuSpec<number>;
  textureMappingUnits?: GpuSpec<number>;
  renderOutputUnits?: GpuSpec<number>;
  tensorCores?: GpuSpec<number>;
  rayTracingCores?: GpuSpec<number>;
  coreClockSpeedBase?: GpuSpec<number>;
  coreClockSpeedBoost?: GpuSpec<number>;
  l1Cache?: GpuSpec<number>;
  l2Cache?: GpuSpec<number>;

  // Theoretical Performance
  pixelFillRate?: GpuSpec<number>;
  textureFillRate?: GpuSpec<number>;
  fp32Performance?: GpuSpec<number>;
  fp64Performance?: GpuSpec<number>;

  // Memory
  memorySize?: GpuSpec<number>;
  memoryType?: GpuSpec<string>;
  memoryClock?: GpuSpec<number>;
  memoryInterface?: GpuSpec<number>;
  memoryBandwidth?: GpuSpec<number>;

  // API Support
  directxVersion?: GpuSpec<number | string>;
  openClVersion?: GpuSpec<number | string>;
  openGlVersion?: GpuSpec<number | string>;
  shaderModelVersion?: GpuSpec<number | string>;

  // Benchmarks
  g2dMark?: GpuBenchmark<number>;
  g3dMark?: GpuBenchmark<number>;
  timespyGraphics?: GpuBenchmark<number>;

  // Images
  images?: GpuImages;
}

const gpuValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),

  // General
  company: gpuSpecValidator.allow(null),
  marketSegment: gpuSpecValidator.allow(null),
  launchPrice: gpuSpecValidator.allow(null),
  releaseDate: gpuSpecValidator.allow(null),

  // Processor
  codename: gpuSpecValidator.allow(null),
  architecture: gpuSpecValidator.allow(null),
  processSize: gpuSpecValidator.allow(null),
  transistors: gpuSpecValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: gpuSpecValidator.allow(null),
  length: gpuSpecValidator.allow(null),
  width: gpuSpecValidator.allow(null),
  height: gpuSpecValidator.allow(null),
  weight: gpuSpecValidator.allow(null),
  busInterface: gpuSpecValidator.allow(null),
  thermalDesignPower: gpuSpecValidator.allow(null),
  suggestedPsu: gpuSpecValidator.allow(null),
  powerConnectors: gpuSpecValidator.allow(null),
  outputs: gpuSpecValidator.allow(null),

  // Cores & Clock Speed
  shaderUnitsCudaCores: gpuSpecValidator.allow(null),
  textureMappingUnits: gpuSpecValidator.allow(null),
  renderOutputUnits: gpuSpecValidator.allow(null),
  tensorCores: gpuSpecValidator.allow(null),
  rayTracingCores: gpuSpecValidator.allow(null),
  coreClockSpeedBase: gpuSpecValidator.allow(null),
  coreClockSpeedBoost: gpuSpecValidator.allow(null),
  l1Cache: gpuSpecValidator.allow(null),
  l2Cache: gpuSpecValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuSpecValidator.allow(null),
  textureFillRate: gpuSpecValidator.allow(null),
  fp32Performance: gpuSpecValidator.allow(null),
  fp64Performance: gpuSpecValidator.allow(null),

  // Memory
  memorySize: gpuSpecValidator.allow(null),
  memoryType: gpuSpecValidator.allow(null),
  memoryClock: gpuSpecValidator.allow(null),
  memoryInterface: gpuSpecValidator.allow(null),
  memoryBandwidth: gpuSpecValidator.allow(null),

  // API Support
  directxVersion: gpuSpecValidator.allow(null),
  openClVersion: gpuSpecValidator.allow(null),
  openGlVersion: gpuSpecValidator.allow(null),
  shaderModelVersion: gpuSpecValidator.allow(null),

  // Benchmarks
  g2dMark: gpuBenchmarkValidator.allow(null),
  g3dMark: gpuBenchmarkValidator.allow(null),
  timespyGraphics: gpuBenchmarkValidator.allow(null),

  // Images
  images: Joi.array().allow(gpuImageValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Gpu;
}

function formOptions(gpu?: Gpu): UseFormProps<GpuFormData> {
  const specs = gpu?.specs || {};
  const benchmarks = gpu?.benchmarks || {};
  const images = gpu?.images || [];

  return {
    resolver: joiResolver(gpuValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug || null,
      name: gpu?.name || null,

      // General
      company: specs.company || null,
      marketSegment: specs.marketSegment || null,
      launchPrice: specs.launchPrice || null,
      releaseDate: specs.releaseDate || null,

      // Processor
      codename: specs.codename || null,
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
      directxVersion: specs.directxVersion || null,
      openClVersion: specs.openClVersion || null,
      openGlVersion: specs.openGlVersion || null,
      shaderModelVersion: specs.shaderModelVersion || null,

      // Benchmarks
      g2dMark: benchmarks.g2dMark || null,
      g3dMark: benchmarks.g3dMark || null,
      timespyGraphics: benchmarks.timespyGraphics || null,

      // Images
      images: images,
    },
  };
}

export const GpuForm: FunctionComponent<GpuFormProps> = (props) => {
  const { gpu } = props;
  const isUpdate = gpu != null;
  useGpuCache(gpu);

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
  } = useForm<GpuFormData>(form);

  console.log(errors);

  const handleSave = useCallback(
    async (formData: GpuFormData) => {
      setSaving(true);

      const request: CreateGpuRequest | UpdateGpuRequest = {
        slug: formData.slug,
        name: formData.name,
        specs: toSpecsRequest(formData),
        benchmarks: toBenchmarksRequest(formData),
        images: toImagesRequest(formData),
      };

      try {
        if (isUpdate) {
          await gpuService.update(gpu.id, request);
        } else {
          await gpuService.create(request);
        }

        router.push('/admin/gpus');
      } catch (err) {
        console.log(err);
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
      await gpuService.delete(gpu.id);
      router.push('/admin/gpus');
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [gpu, router, setError]);

  const handleImport = useCallback(
    (data: ImportGpuDataResults) => {
      if (data.name.import) {
        setValue('name', data.name.value);
      }

      Object.keys(data.specs || {}).forEach((specKey) => {
        if (data.specs[specKey].import) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(specKey as any, data.specs[specKey].value);
        }
      });

      Object.keys(data.benchmarks || {}).forEach((benchmarkKey) => {
        if (data.benchmarks[benchmarkKey].import) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(benchmarkKey as any, data.benchmarks[benchmarkKey].value);
        }
      });
    },
    [setValue],
  );

  const handleImportClick = useCallback(() => {
    const url: string = importRef.current.value;
    showDialog(<ImportGpuDataDialog url={url} onImport={handleImport} />, {
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

      <section className="border-b-px border-b-slate-300 mb-6">
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
            render={({ field }) => (
              <GpuSlugField control={control} {...field} ref={null} />
            )}
          />
          {errors.slug?.type === ValidationErrorType.MissingStringValue && (
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
              <GpuSpecField field="company" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <GpuSpecField field="marketSegment" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => (
              <GpuSpecField field="launchPrice" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Release Date
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <GpuSpecField field="releaseDate" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Technical Specs</h2>

        <section>
          <h3 className="mb-4">Processor</h3>

          <Field>
            GPU Codename
            <Controller
              name="codename"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="gpuName" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="architecture" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="processSize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="transistors" {...field} ref={null} />
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
                <GpuSpecField field="memorySize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="memoryType" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Clock
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="memoryClock" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="memoryInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Bandwidth
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="memoryBandwidth" {...field} ref={null} />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Board Compatibility &amp; Dimensions</h3>

          <Field>
            Slots
            <Controller
              name="slotWidth"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="slotWidth" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="length" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="width" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="height" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="weight" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="busInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Thermal Design Power (TDP)
            <Controller
              name="thermalDesignPower"
              control={control}
              render={({ field }) => (
                <GpuSpecField
                  field="thermalDesignPower"
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
                <GpuSpecField field="suggestedPsu" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="powerConnectors" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Outputs
            <Controller
              name="outputs"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="outputs" {...field} ref={null} />
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
                <GpuSpecField
                  field="shaderUnitsCudaCores"
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
                <GpuSpecField
                  field="textureMappingUnits"
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
                <GpuSpecField field="renderOutputUnits" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Tensor Cores
            <Controller
              name="tensorCores"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="tensorCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Ray Tracing Cores (RT Cores)
            <Controller
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="rayTracingCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Base)
            <Controller
              name="coreClockSpeedBase"
              control={control}
              render={({ field }) => (
                <GpuSpecField
                  field="coreClockSpeedBase"
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
                <GpuSpecField
                  field="coreClockSpeedBoost"
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
                <GpuSpecField field="l1Cache" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="l2Cache" {...field} ref={null} />
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
                <GpuSpecField field="pixelFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Texture Fill Rate
            <Controller
              name="textureFillRate"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="textureFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP32 Performance
            <Controller
              name="fp32Performance"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="fp32Performance" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP64 Performance
            <Controller
              name="fp64Performance"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="fp64Performance" {...field} ref={null} />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">API Support</h3>

          <Field>
            Direct X Version
            <Controller
              name="directxVersion"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="directxVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open CL Version
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="openClVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open GL Version
            <Controller
              name="openGlVersion"
              control={control}
              render={({ field }) => (
                <GpuSpecField field="openGlVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Shader Model Version
            <Controller
              name="shaderModelVersion"
              control={control}
              render={({ field }) => (
                <GpuSpecField
                  field="shaderModelVersion"
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
          name="g3dMark"
          control={control}
          render={({ field }) => (
            <GpuBenchmarkField field="g3dMark" {...field} ref={null} />
          )}
        />

        <Controller
          name="g2dMark"
          control={control}
          render={({ field }) => (
            <GpuBenchmarkField field="g2dMark" {...field} ref={null} />
          )}
        />

        <Controller
          name="timespyGraphics"
          control={control}
          render={({ field }) => (
            <GpuBenchmarkField field="timespyGraphics" {...field} ref={null} />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Images</h2>

        <Controller
          name="images"
          control={control}
          render={({ field }) => <GpuImagesField {...field} ref={null} />}
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

function toSpecsRequest(formData: GpuFormData): GpuSpecs {
  return {
    // General
    company: formData.company || null,
    marketSegment: formData.marketSegment || null,
    launchPrice: formData.launchPrice || null,
    releaseDate: formData.releaseDate || null,

    // Processor
    codename: formData.codename || null,
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
    directxVersion: formData.directxVersion || null,
    openClVersion: formData.openClVersion || null,
    openGlVersion: formData.openGlVersion || null,
    shaderModelVersion: formData.shaderModelVersion || null,
  };
}

function toBenchmarksRequest(formData: GpuFormData): GpuBenchmarks {
  return {
    g2dMark: formData.g2dMark || null,
    g3dMark: formData.g3dMark || null,
    timespyGraphics: formData.timespyGraphics || null,
  };
}

function toImagesRequest(formData: GpuFormData): GpuImages {
  return (
    formData.images
      ?.filter((image) => image != null)
      .map((image) => ({ id: image.id })) ?? []
  );
}
