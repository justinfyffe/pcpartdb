import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  CreateGpuRequest,
  getAdminListGpusPath,
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  gpuDataSourceValidator,
  gpuDataValidator,
  GpuField,
  GpuImages,
  gpuImageValidator,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  Product,
  ProductType,
  UpdateGpuRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import { gpuService } from 'packages/website/src/client/product/services/gpuService';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import { DangerButton } from 'packages/website/src/client/shared/components/Button/DangerButton';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import {
  Field,
  FieldError,
} from 'packages/website/src/client/shared/components/Field/Field';
import {
  Form,
  FormActions,
} from 'packages/website/src/client/shared/components/Form/Form';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { Spinner } from 'packages/website/src/client/shared/components/Spinner/Spinner';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, UseFormProps, useWatch } from 'react-hook-form';
import {
  isBadRequestError,
  setValidationErrors,
} from '../../../../shared/error/utils';
import { ScrapedProduct } from '../../product/ScrapeProductDialog/types';
import { GpuBenchmarkInput } from '../GpuBenchmarkInput/GpuBenchmarkInput';
import { GpuDataSourceInput } from '../GpuDataSourceInput/GpuDataSourceInput';
import { GpuFieldInput } from '../GpuFieldInput/GpuFieldInput';
import { GpuImagesInput } from '../GpuImageInput/GpuImagesInput';
import { GpuSlugInput } from '../GpuSlugInput/GpuSlugInput';
import { ScrapeGpuDialog } from '../ScrapeGpuDialog/ScrapeGpuDialog';

interface GpuFormData {
  // GPU Parent / Chipset ID
  chipsetId?: number;

  slug: string;
  name: string;
  affiliateUrl?: string;

  // Data Sources
  techPowerUpSource?: GpuDataSource;
  videocardBenchmarksSource?: GpuDataSource;
  ulBenchmarksSource?: GpuDataSource;

  // General
  partNumber?: GpuField<string>;
  company?: GpuField<string>;
  marketSegment?: GpuField<GpuMarketSegmentValue>;
  launchPrice?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<GpuProductionStatusValue>;

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
  chipsetId: Joi.number().allow(null),

  slug: Joi.string().required(),
  name: Joi.string().required(),
  affiliateUrl: Joi.string().allow(null),

  // Data Sources
  techPowerUpSource: gpuDataSourceValidator.allow(null),
  videocardBenchmarksSource: gpuDataSourceValidator.allow(null),
  ulBenchmarksSource: gpuDataSourceValidator.allow(null),

  // General
  partNumber: gpuDataValidator.allow(null),
  company: gpuDataValidator.allow(null),
  marketSegment: gpuDataValidator.allow(null),
  launchPrice: gpuDataValidator.allow(null),
  releaseDate: gpuDataValidator.allow(null),
  productionStatus: gpuDataValidator.allow(null),

  // Processor
  codename: gpuDataValidator.allow(null),
  architecture: gpuDataValidator.allow(null),
  processSize: gpuDataValidator.allow(null),
  transistors: gpuDataValidator.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: gpuDataValidator.allow(null),
  length: gpuDataValidator.allow(null),
  width: gpuDataValidator.allow(null),
  height: gpuDataValidator.allow(null),
  weight: gpuDataValidator.allow(null),
  busInterface: gpuDataValidator.allow(null),
  thermalDesignPower: gpuDataValidator.allow(null),
  suggestedPsu: gpuDataValidator.allow(null),
  powerConnectors: gpuDataValidator.allow(null),
  outputs: gpuDataValidator.allow(null),

  // Cores & Clock Speed
  shaderUnitsCudaCores: gpuDataValidator.allow(null),
  computeUnitsSmCount: gpuDataValidator.allow(null),
  textureMappingUnits: gpuDataValidator.allow(null),
  renderOutputUnits: gpuDataValidator.allow(null),
  tensorCores: gpuDataValidator.allow(null),
  rayTracingCores: gpuDataValidator.allow(null),
  coreClockSpeedBase: gpuDataValidator.allow(null),
  coreClockSpeedBoost: gpuDataValidator.allow(null),
  l1Cache: gpuDataValidator.allow(null),
  l2Cache: gpuDataValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuDataValidator.allow(null),
  textureFillRate: gpuDataValidator.allow(null),
  fp32Performance: gpuDataValidator.allow(null),
  fp64Performance: gpuDataValidator.allow(null),

  // Memory
  memorySize: gpuDataValidator.allow(null),
  memoryType: gpuDataValidator.allow(null),
  memoryClock: gpuDataValidator.allow(null),
  memoryInterface: gpuDataValidator.allow(null),
  memoryBandwidth: gpuDataValidator.allow(null),

  // API Support
  directxVersion: gpuDataValidator.allow(null),
  openClVersion: gpuDataValidator.allow(null),
  openGlVersion: gpuDataValidator.allow(null),
  shaderModelVersion: gpuDataValidator.allow(null),

  // Benchmarks
  g2dMark: gpuDataValidator.allow(null),
  g3dMark: gpuDataValidator.allow(null),
  timespyGraphics: gpuDataValidator.allow(null),

  // Images
  images: Joi.array().allow(gpuImageValidator),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: Gpu;
}

function formOptions(gpu?: Gpu): UseFormProps<GpuFormData> {
  const images = gpu?.images || [];

  return {
    resolver: joiResolver(gpuValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: gpu?.slug || null,
      name: gpu?.name || null,
      affiliateUrl: gpu?.affiliateUrl || null,

      chipsetId: gpu?.chipsetId || null,

      // Data Sources
      techPowerUpSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp] || null,
      videocardBenchmarksSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks] || null,
      ulBenchmarksSource:
        gpu?.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks] || null,

      // General
      partNumber: gpu?.partNumber || null,
      company: gpu?.company || null,
      marketSegment: gpu?.marketSegment || null,
      launchPrice: gpu?.launchPrice || null,
      releaseDate: gpu?.releaseDate || null,
      productionStatus: gpu?.productionStatus || null,

      // Processor
      codename: gpu?.codename || null,
      architecture: gpu?.architecture || null,
      processSize: gpu?.processSize || null,
      transistors: gpu?.transistors || null,

      // Board Compatibility & Dimensions
      slotWidth: gpu?.slotWidth || null,
      length: gpu?.length || null,
      width: gpu?.width || null,
      height: gpu?.height || null,
      weight: gpu?.weight || null,
      busInterface: gpu?.busInterface || null,
      thermalDesignPower: gpu?.thermalDesignPower || null,
      suggestedPsu: gpu?.suggestedPsu || null,
      powerConnectors: gpu?.powerConnectors || null,
      outputs: gpu?.outputs || null,

      // Cores & Clock Speeds
      shaderUnitsCudaCores: gpu?.shaderUnitsCudaCores || null,
      computeUnitsSmCount: gpu?.computeUnitsSmCount || null,
      textureMappingUnits: gpu?.textureMappingUnits || null,
      renderOutputUnits: gpu?.renderOutputUnits || null,
      tensorCores: gpu?.tensorCores || null,
      rayTracingCores: gpu?.rayTracingCores || null,
      coreClockSpeedBase: gpu?.coreClockSpeedBase || null,
      coreClockSpeedBoost: gpu?.coreClockSpeedBoost || null,
      l1Cache: gpu?.l1Cache || null,
      l2Cache: gpu?.l2Cache || null,

      // Theoretical Performance
      pixelFillRate: gpu?.pixelFillRate || null,
      textureFillRate: gpu?.textureFillRate || null,
      fp32Performance: gpu?.fp32Performance || null,
      fp64Performance: gpu?.fp64Performance || null,

      // Memory
      memorySize: gpu?.memorySize || null,
      memoryType: gpu?.memoryType || null,
      memoryClock: gpu?.memoryClock || null,
      memoryInterface: gpu?.memoryInterface || null,
      memoryBandwidth: gpu?.memoryBandwidth || null,

      // API Support
      directxVersion: gpu?.directxVersion || null,
      openClVersion: gpu?.openClVersion || null,
      openGlVersion: gpu?.openGlVersion || null,
      shaderModelVersion: gpu?.shaderModelVersion || null,

      // Benchmarks
      g2dMark: gpu?.g2dMark || null,
      g3dMark: gpu?.g3dMark || null,
      timespyGraphics: gpu?.timespyGraphics || null,

      // Images
      images: images,
    },
  };
}

export const GpuForm: FunctionComponent<GpuFormProps> = (props) => {
  const { gpu } = props;
  const isUpdate = gpu != null;
  useProductCache(ProductType.Gpu, gpu, gpu?.chipset);

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [parentGpu, setParentGpu] = useState<Gpu>(gpu?.chipset);

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

      const request = toGpuRequest(formData);

      try {
        if (isUpdate) {
          await gpuService.update(gpu.id, request);
        } else {
          await gpuService.create(request);
        }

        router.push(getAdminListGpusPath());
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
      router.push(getAdminListGpusPath());
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [gpu, router, setError]);

  const handleParentGpuChange = useCallback((product: Product) => {
    setParentGpu(product as Gpu);
  }, []);

  const handleScrape = useCallback(
    (scraped: ScrapedProduct) => {
      const { scrapedData: data } = scraped;

      Object.keys(data || {}).forEach((field) => {
        if (data[field].enabled) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(field as any, data[field].value);
        }
      });
    },
    [setValue],
  );

  const importChipsetId = useWatch({
    control,
    name: ['chipsetId'],
  });

  const importSources = useWatch({
    control,
    name: [
      'techPowerUpSource',
      'videocardBenchmarksSource',
      'ulBenchmarksSource',
    ],
  });

  const handleScrapeClick = useCallback(() => {
    const sources: Record<string, GpuDataSource> = {
      [GpuDataSourceKey.Chipset]: { chipsetId: importChipsetId[0] },
      [GpuDataSourceKey.TechPowerUp]: importSources[0],
      [GpuDataSourceKey.VideocardBenchmarks]: importSources[1],
      [GpuDataSourceKey.UlBenchmarks]: importSources[2],
    };
    showDialog(<ScrapeGpuDialog sources={sources} onImport={handleScrape} />, {
      disableClose: true,
    });
  }, [importChipsetId, importSources, handleScrape]);

  return (
    <Form onSubmit={handleSubmit(handleSave)}>
      {requestError && isBadRequestError(requestError) && (
        <ErrorAlert>Please fix the form errors and try again.</ErrorAlert>
      )}

      {requestError && !isBadRequestError(requestError) && (
        <ErrorAlert>
          An unknown error has occurred. Please try again later.
        </ErrorAlert>
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

        <WarningButton onClick={handleScrapeClick}>
          Scrape Details
        </WarningButton>
      </section>

      <section>
        <Field>
          Chipset
          <Controller
            name="chipsetId"
            control={control}
            render={({ field }) => (
              <ProductAutocomplete
                {...field}
                ref={null}
                productType={ProductType.Gpu}
                onChangeProduct={handleParentGpuChange}
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
            render={({ field }) => (
              <GpuSlugInput control={control} {...field} ref={null} />
            )}
          />
          {errors.slug?.type === ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>

        <Field>
          Amazon URL
          <Controller
            name="affiliateUrl"
            control={control}
            render={({ field }) => <TextInput {...field} ref={null} />}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">General Info</h2>

        <Field>
          Part Number
          <Controller
            name="partNumber"
            control={control}
            render={({ field }) => (
              <GpuFieldInput
                field="partNumber"
                {...field}
                ref={null}
                parentValue={parentGpu?.partNumber}
              />
            )}
          />
        </Field>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <GpuFieldInput
                field="company"
                {...field}
                ref={null}
                parentValue={parentGpu?.company}
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
              <GpuFieldInput
                field="marketSegment"
                {...field}
                ref={null}
                parentValue={parentGpu?.marketSegment}
              />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => (
              <GpuFieldInput
                field="launchPrice"
                {...field}
                ref={null}
                parentValue={parentGpu?.launchPrice}
              />
            )}
          />
        </Field>

        <Field>
          Release Date &amp; Format
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <GpuFieldInput
                field="releaseDate"
                {...field}
                ref={null}
                parentValue={parentGpu?.releaseDate}
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
              <GpuFieldInput
                field="productionStatus"
                {...field}
                ref={null}
                parentValue={parentGpu?.productionStatus}
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
            GPU Codename
            <Controller
              name="codename"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
                  field="codename"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.codename}
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
                <GpuFieldInput
                  field="architecture"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.architecture}
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
                <GpuFieldInput
                  field="processSize"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.processSize}
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
                <GpuFieldInput
                  field="transistors"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.transistors}
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
                <GpuFieldInput
                  field="memorySize"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.memorySize}
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
                <GpuFieldInput
                  field="memoryType"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.memoryType}
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
                <GpuFieldInput
                  field="memoryClock"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.memoryClock}
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
                <GpuFieldInput
                  field="memoryInterface"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.memoryInterface}
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
                <GpuFieldInput
                  field="memoryBandwidth"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.memoryBandwidth}
                />
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
                <GpuFieldInput
                  field="slotWidth"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.slotWidth}
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
                <GpuFieldInput
                  field="length"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.length}
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
                <GpuFieldInput
                  field="width"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.width}
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
                <GpuFieldInput
                  field="height"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.height}
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
                <GpuFieldInput
                  field="weight"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.weight}
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
                <GpuFieldInput
                  field="busInterface"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.busInterface}
                />
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
                  parentValue={parentGpu?.thermalDesignPower}
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
                <GpuFieldInput
                  field="suggestedPsu"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.suggestedPsu}
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
                <GpuFieldInput
                  field="powerConnectors"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.powerConnectors}
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
                <GpuFieldInput
                  field="outputs"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.outputs}
                />
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
                  parentValue={parentGpu?.shaderUnitsCudaCores}
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
                  parentValue={parentGpu?.computeUnitsSmCount}
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
                  parentValue={parentGpu?.textureMappingUnits}
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
                  parentValue={parentGpu?.renderOutputUnits}
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
                <GpuFieldInput
                  field="tensorCores"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.tensorCores}
                />
              )}
            />
          </Field>

          <Field>
            Ray Tracing Cores (RT Cores)
            <Controller
              name="rayTracingCores"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
                  field="rayTracingCores"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.rayTracingCores}
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
                <GpuFieldInput
                  field="coreClockSpeedBase"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.coreClockSpeedBase}
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
                  parentValue={parentGpu?.coreClockSpeedBoost}
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
                <GpuFieldInput
                  field="l1Cache"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.l1Cache}
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
                <GpuFieldInput
                  field="l2Cache"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.l2Cache}
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
                <GpuFieldInput
                  field="pixelFillRate"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.pixelFillRate}
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
                <GpuFieldInput
                  field="textureFillRate"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.textureFillRate}
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
                <GpuFieldInput
                  field="fp32Performance"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.fp32Performance}
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
                <GpuFieldInput
                  field="fp64Performance"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.fp64Performance}
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
              name="directxVersion"
              control={control}
              render={({ field }) => (
                <GpuFieldInput
                  field="directxVersion"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.directxVersion}
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
                <GpuFieldInput
                  field="openClVersion"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.openClVersion}
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
                <GpuFieldInput
                  field="openGlVersion"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.openGlVersion}
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
                <GpuFieldInput
                  field="shaderModelVersion"
                  {...field}
                  ref={null}
                  parentValue={parentGpu?.shaderModelVersion}
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
              <GpuBenchmarkInput
                field="g3dMark"
                {...field}
                ref={null}
                parentValue={parentGpu?.g3dMark}
              />
            )}
          />
        </Field>

        <Field>
          G2D Mark
          <Controller
            name="g2dMark"
            control={control}
            render={({ field }) => (
              <GpuBenchmarkInput
                field="g2dMark"
                {...field}
                ref={null}
                parentValue={parentGpu?.g2dMark}
              />
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
                parentValue={parentGpu?.timespyGraphics}
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
          <DangerButton
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="mr-4"
          >
            {deleting && <Spinner />}
            <span>Delete</span>
          </DangerButton>
        )}

        <PrimaryButton type="submit" disabled={saving || deleting}>
          {saving && <Spinner />}
          {!saving && <span>Save</span>}
        </PrimaryButton>
      </FormActions>
    </Form>
  );
};

function toGpuRequest(
  formData: GpuFormData,
): CreateGpuRequest | UpdateGpuRequest {
  return {
    chipsetId: formData.chipsetId,
    slug: formData.slug,
    name: formData.name,
    affiliateUrl: formData.affiliateUrl,

    // General Info
    partNumber: formData.partNumber,
    company: formData.company,
    marketSegment: formData.marketSegment,
    launchPrice: formData.launchPrice,
    releaseDate: formData.releaseDate,
    productionStatus: formData.productionStatus,

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

    // Benchmarks
    g2dMark: formData.g2dMark || null,
    g3dMark: formData.g3dMark || null,
    timespyGraphics: formData.timespyGraphics || null,

    // Meta
    meta: {
      dataSources: {
        [GpuDataSourceKey.TechPowerUp]: formData.techPowerUpSource,
        [GpuDataSourceKey.VideocardBenchmarks]:
          formData.videocardBenchmarksSource,
        [GpuDataSourceKey.UlBenchmarks]: formData.ulBenchmarksSource,
      },
    },

    images:
      formData.images
        ?.filter((image) => image != null)
        .map((image) => ({ imageId: image.imageId })) ?? [],
  };
}
