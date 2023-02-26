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
  GpuBenchmarks,
  GpuDataSource,
  GpuDataSourceKey,
  gpuDataSourceValidator,
  GpuField,
  gpuFieldValidator,
  GpuImages,
  gpuImageValidator,
  GpuMeta,
  GpuSpecs,
  MarketSegmentValue,
  UpdateGpuRequest,
} from '@shared/gpus';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps, useWatch } from 'react-hook-form';
import { GpuBenchmarkInput } from '../gpu-benchmark-input';
import { GpuDataSourceInput } from '../gpu-datasource-input';
import { GpuFieldInput } from '../gpu-field-input';
import { GpuImagesInput } from '../gpu-image-input';
import { GpuSlugInput } from '../gpu-slug-input';
import {
  ImportGpuDataDialog,
  ImportGpuDataResults,
} from '../import-gpu-data-dialog';

interface GpuFormData {
  slug: string;
  name: string;

  // Data Sources
  techPowerUpSource?: GpuDataSource;
  videocardBenchmarksSource?: GpuDataSource;
  ulBenchmarksSource?: GpuDataSource;

  // General
  company?: GpuField<string>;
  marketSegment?: GpuField<MarketSegmentValue>;
  launchPrice?: GpuField<number>;
  releaseDate?: GpuField<string>;

  // Processor
  codename?: GpuField<string>;
  architecture?: GpuField<string>;
  processSize?: GpuField<number>;
  transistors?: GpuField<number>;

  // Board Compatibility & Dimensions
  slotWidth?: GpuField<number>;
  length?: GpuField<number>;
  width?: GpuField<number>;
  height?: GpuField<number>;
  weight?: GpuField<number>;
  busInterface?: GpuField<string>;
  thermalDesignPower?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: GpuField<number>;
  computeUnitsSmCount?: GpuField<number>;
  textureMappingUnits?: GpuField<number>;
  renderOutputUnits?: GpuField<number>;
  tensorCores?: GpuField<number>;
  rayTracingCores?: GpuField<number>;
  coreClockSpeedBase?: GpuField<number>;
  coreClockSpeedBoost?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;

  // Theoretical Performance
  pixelFillRate?: GpuField<number>;
  textureFillRate?: GpuField<number>;
  fp32Performance?: GpuField<number>;
  fp64Performance?: GpuField<number>;

  // Memory
  memorySize?: GpuField<number>;
  memoryType?: GpuField<string>;
  memoryClock?: GpuField<number>;
  memoryInterface?: GpuField<number>;
  memoryBandwidth?: GpuField<number>;

  // API Support
  directxVersion?: GpuField<string>;
  openClVersion?: GpuField<string>;
  openGlVersion?: GpuField<string>;
  shaderModelVersion?: GpuField<string>;

  // Benchmarks
  g2dMark?: GpuField<number>;
  g3dMark?: GpuField<number>;
  timespyGraphics?: GpuField<number>;

  // Images
  images?: GpuImages;
}

const gpuValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),

  // Data Sources
  techPowerUpSource: gpuDataSourceValidator.allow(null),
  videocardBenchmarksSource: gpuDataSourceValidator.allow(null),
  ulBenchmarksSource: gpuDataSourceValidator.allow(null),

  // General
  company: gpuFieldValidator.allow(null),
  marketSegment: gpuFieldValidator.allow(null),
  launchPrice: gpuFieldValidator.allow(null),
  releaseDate: gpuFieldValidator.allow(null),

  // Processor
  codename: gpuFieldValidator.allow(null),
  architecture: gpuFieldValidator.allow(null),
  processSize: gpuFieldValidator.allow(null),
  transistors: gpuFieldValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: gpuFieldValidator.allow(null),
  length: gpuFieldValidator.allow(null),
  width: gpuFieldValidator.allow(null),
  height: gpuFieldValidator.allow(null),
  weight: gpuFieldValidator.allow(null),
  busInterface: gpuFieldValidator.allow(null),
  thermalDesignPower: gpuFieldValidator.allow(null),
  suggestedPsu: gpuFieldValidator.allow(null),
  powerConnectors: gpuFieldValidator.allow(null),
  outputs: gpuFieldValidator.allow(null),

  // Cores & Clock Speed
  shaderUnitsCudaCores: gpuFieldValidator.allow(null),
  computeUnitsSmCount: gpuFieldValidator.allow(null),
  textureMappingUnits: gpuFieldValidator.allow(null),
  renderOutputUnits: gpuFieldValidator.allow(null),
  tensorCores: gpuFieldValidator.allow(null),
  rayTracingCores: gpuFieldValidator.allow(null),
  coreClockSpeedBase: gpuFieldValidator.allow(null),
  coreClockSpeedBoost: gpuFieldValidator.allow(null),
  l1Cache: gpuFieldValidator.allow(null),
  l2Cache: gpuFieldValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuFieldValidator.allow(null),
  textureFillRate: gpuFieldValidator.allow(null),
  fp32Performance: gpuFieldValidator.allow(null),
  fp64Performance: gpuFieldValidator.allow(null),

  // Memory
  memorySize: gpuFieldValidator.allow(null),
  memoryType: gpuFieldValidator.allow(null),
  memoryClock: gpuFieldValidator.allow(null),
  memoryInterface: gpuFieldValidator.allow(null),
  memoryBandwidth: gpuFieldValidator.allow(null),

  // API Support
  directxVersion: gpuFieldValidator.allow(null),
  openClVersion: gpuFieldValidator.allow(null),
  openGlVersion: gpuFieldValidator.allow(null),
  shaderModelVersion: gpuFieldValidator.allow(null),

  // Benchmarks
  g2dMark: gpuFieldValidator.allow(null),
  g3dMark: gpuFieldValidator.allow(null),
  timespyGraphics: gpuFieldValidator.allow(null),

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

      // Data Sources
      techPowerUpSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp] || null,
      videocardBenchmarksSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks] || null,
      ulBenchmarksSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks] || null,

      // General
      company: gpu?.company || null,
      marketSegment: gpu?.marketSegment || null,
      launchPrice: gpu?.launchPrice || null,
      releaseDate: gpu?.releaseDate || null,

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
      computeUnitsSmCount: specs.computeUnitsSmCount || null,
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
        company: formData.company,
        marketSegment: formData.marketSegment,
        launchPrice: formData.launchPrice,
        releaseDate: formData.releaseDate,
        meta: toGpuMetaRequest(formData),
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

      Object.keys(data.fields || {}).forEach((fieldKey) => {
        if (data.fields[fieldKey].import) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(fieldKey as any, data.fields[fieldKey].value);
        }
      });
    },
    [setValue],
  );

  const importSources = useWatch({
    control,
    name: [
      'techPowerUpSource',
      'videocardBenchmarksSource',
      'ulBenchmarksSource',
    ],
  });

  const handleImportClick = useCallback(() => {
    showDialog(
      <ImportGpuDataDialog
        sources={importSources.filter((source) => source != null)}
        onImport={handleImport}
      />,
      {
        disableClose: true,
      },
    );
  }, [importSources, handleImport]);

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

      <section className="border-b-px border-b-slate-300 mb-6 pb-6">
        <h2 className="mb-4">Data Sources</h2>

        <Field>
          TechPowerUp
          <Controller
            name="techPowerUpSource"
            control={control}
            render={({ field }) => <GpuDataSourceInput {...field} ref={null} />}
          />
        </Field>

        <Field>
          Videocard Benchmarks
          <Controller
            name="videocardBenchmarksSource"
            control={control}
            render={({ field }) => <GpuDataSourceInput {...field} ref={null} />}
          />
        </Field>

        <Field>
          UL Benchmarks
          <Controller
            name="ulBenchmarksSource"
            control={control}
            render={({ field }) => <GpuDataSourceInput {...field} ref={null} />}
          />
        </Field>

        <Button variant={ButtonVariant.Secondary} onClick={handleImportClick}>
          Import Data
        </Button>
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
              <GpuSlugInput control={control} {...field} ref={null} />
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
              <GpuFieldInput field="company" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Market Segment
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <GpuFieldInput field="marketSegment" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => (
              <GpuFieldInput field="launchPrice" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Release Date
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <GpuFieldInput field="releaseDate" {...field} ref={null} />
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
                <GpuFieldInput field="codename" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Architecture
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="architecture" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Process Size
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="processSize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Transistors
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="transistors" {...field} ref={null} />
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
                <GpuFieldInput field="memorySize" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Type
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="memoryType" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Clock
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="memoryClock" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Interface
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="memoryInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Memory Bandwidth
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="memoryBandwidth" {...field} ref={null} />
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
                <GpuFieldInput field="slotWidth" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Length
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="length" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Width
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="width" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Height
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="height" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Weight
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="weight" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Bus Interface
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="busInterface" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Thermal Design Power (TDP)
            <Controller
              name="thermalDesignPower"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
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
                <GpuFieldInput field="suggestedPsu" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Power Connecters
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="powerConnectors" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Outputs
            <Controller
              name="outputs"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="outputs" {...field} ref={null} />
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
                <GpuFieldInput
                  field="shaderUnitsCudaCores"
                  {...field}
                  ref={null}
                />
              )}
            />
          </Field>

          <Field>
            Compute Units / SM Count
            <Controller
              name="computeUnitsSmCount"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
                  field="computeUnitsSmCount"
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
                <GpuFieldInput
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
                <GpuFieldInput
                  field="renderOutputUnits"
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
                <GpuFieldInput field="tensorCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Ray Tracing Cores (RT Cores)
            <Controller
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="rayTracingCores" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Clock Speed (Base)
            <Controller
              name="coreClockSpeedBase"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
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
                <GpuFieldInput
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
                <GpuFieldInput field="l1Cache" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            L2 Cache
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="l2Cache" {...field} ref={null} />
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
                <GpuFieldInput field="pixelFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Texture Fill Rate
            <Controller
              name="textureFillRate"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="textureFillRate" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP32 Performance
            <Controller
              name="fp32Performance"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="fp32Performance" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            FP64 Performance
            <Controller
              name="fp64Performance"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="fp64Performance" {...field} ref={null} />
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
                <GpuFieldInput field="directxVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open CL Version
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="openClVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Open GL Version
            <Controller
              name="openGlVersion"
              control={control}
              render={({ field }) => (
                <GpuFieldInput field="openGlVersion" {...field} ref={null} />
              )}
            />
          </Field>

          <Field>
            Shader Model Version
            <Controller
              name="shaderModelVersion"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
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

        <Field>
          G3D Mark
          <Controller
            name="g3dMark"
            control={control}
            render={({ field }) => (
              <GpuBenchmarkInput field="g3dMark" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          G2D Mark
          <Controller
            name="g2dMark"
            control={control}
            render={({ field }) => (
              <GpuBenchmarkInput field="g2dMark" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          3DMark Time Spy Graphics
          <Controller
            name="timespyGraphics"
            control={control}
            render={({ field }) => (
              <GpuBenchmarkInput
                field="timespyGraphics"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Images</h2>

        <Controller
          name="images"
          control={control}
          render={({ field }) => <GpuImagesInput {...field} ref={null} />}
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

function toGpuMetaRequest(formData: GpuFormData): GpuMeta {
  return {
    dataSources: {
      [GpuDataSourceKey.TechPowerUp]: formData.techPowerUpSource,
      [GpuDataSourceKey.VideocardBenchmarks]:
        formData.videocardBenchmarksSource,
      [GpuDataSourceKey.UlBenchmarks]: formData.ulBenchmarksSource,
    },
  };
}

function toSpecsRequest(formData: GpuFormData): GpuSpecs {
  return {
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
    computeUnitsSmCount: formData.computeUnitsSmCount || null,
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
      .map((image) => ({ imageId: image.imageId })) ?? []
  );
}
