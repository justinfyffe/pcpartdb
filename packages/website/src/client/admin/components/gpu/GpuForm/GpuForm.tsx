import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  ApiError,
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  CreateProductRequest,
  CurrencyUnit,
  FlopsUnit,
  formatMarketSegment,
  formatProductionStatus,
  getAdminListGpusPath,
  GpuField,
  GpuFields,
  GpuProduct,
  LengthUnit,
  MarketSegment,
  MemorySizeUnit,
  NumericUnit,
  PixelFillRateUnit,
  Product,
  ProductBenchmark,
  productBenchmarkSchema,
  productFieldFormattedValue,
  productFieldSchema,
  ProductImage,
  productImageSchema,
  ProductionStatus,
  ProductSource,
  productSourceSchema,
  ProductType,
  TextureFillRateUnit,
  UpdateProductRequest,
  ValidationErrorType,
  WattageUnit,
  WeightUnit,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import { productService } from 'packages/website/src/client/product/services/productService';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { ErrorAlert } from 'packages/website/src/client/shared/components/Alert/ErrorAlert';
import { DangerButton } from 'packages/website/src/client/shared/components/Button/DangerButton';
import { InfoButton } from 'packages/website/src/client/shared/components/Button/InfoButton';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
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
import { ProductBenchmarksInput } from '../../product/ProductBenchmarkInput/ProductBenchmarksInput';
import { ProductDateInput } from '../../product/ProductDateInput/ProductDateInput';
import { ProductEnumInput } from '../../product/ProductEnumInput/ProductEnumInput';
import { ProductFloatInput } from '../../product/ProductFloatInput/ProductFloatInput';
import { ProductImagesInput } from '../../product/ProductImageInput/ProductImagesInput';
import { ProductOtherNamesInput } from '../../product/ProductOtherNamesInput/ProductOtherNamesInput';
import { ProductSearchTextInput } from '../../product/ProductSearchTextInput/ProductSearchTextInput';
import { ProductSlugInput } from '../../product/ProductSlugInput/ProductSlugInput';
import { ProductSourcesInput } from '../../product/ProductSourceInput/ProductSourcesInput';
import { ProductSummaryInput } from '../../product/ProductSummaryInput/ProductSummaryInput';
import { ProductTextInput } from '../../product/ProductTextInput/ProductTextInput';
import { ScrapedProduct } from '../../product/ScrapeProductDialog/types';
import { ScrapeGpuDialog } from '../ScrapeGpuDialog/ScrapeGpuDialog';

interface GpuFormData {
  // GPU Parent / Chipset ID
  parentId?: number;

  name: string;
  slug: string;

  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;
  summary?: string;

  // General
  partNumber?: GpuField<string>;
  marketSegment?: GpuField<MarketSegment>;
  msrp?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<ProductionStatus>;

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
  tdp?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  gpuCores?: GpuField<number>;
  computeUnits?: GpuField<number>;
  tmus?: GpuField<number>;
  rops?: GpuField<number>;
  tensorCores?: GpuField<number>;
  rtCores?: GpuField<number>;
  gpuCoreBaseClock?: GpuField<number>;
  gpuCoreBoostClock?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;

  // Theoretical Performance
  pixelRate?: GpuField<number>;
  textureRate?: GpuField<number>;
  fp32?: GpuField<number>;
  fp64?: GpuField<number>;

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
  benchmarks?: ProductBenchmark[];

  // Sources
  sources?: ProductSource[];

  // Images
  images?: ProductImage[];
}

const gpuFormSchema = Joi.object({
  parentId: Joi.number().allow(null),

  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),
  summary: Joi.string().allow(null),

  // Sources
  sources: Joi.array().items(productSourceSchema),

  // General
  partNumber: productFieldSchema.allow(null),
  marketSegment: productFieldSchema.allow(null),
  msrp: productFieldSchema.allow(null),
  releaseDate: productFieldSchema.allow(null),
  productionStatus: productFieldSchema.allow(null),

  // Processor
  codename: productFieldSchema.allow(null),
  architecture: productFieldSchema.allow(null),
  processSize: productFieldSchema.allow(null),
  transistors: productFieldSchema.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: productFieldSchema.allow(null),
  length: productFieldSchema.allow(null),
  width: productFieldSchema.allow(null),
  height: productFieldSchema.allow(null),
  weight: productFieldSchema.allow(null),
  busInterface: productFieldSchema.allow(null),
  tdp: productFieldSchema.allow(null),
  suggestedPsu: productFieldSchema.allow(null),
  powerConnectors: productFieldSchema.allow(null),
  outputs: productFieldSchema.allow(null),

  // Cores & Clock Speed
  gpuCores: productFieldSchema.allow(null),
  computeUnits: productFieldSchema.allow(null),
  tmus: productFieldSchema.allow(null),
  rops: productFieldSchema.allow(null),
  tensorCores: productFieldSchema.allow(null),
  rtCores: productFieldSchema.allow(null),
  gpuCoreBaseClock: productFieldSchema.allow(null),
  gpuCoreBoostClock: productFieldSchema.allow(null),
  l1Cache: productFieldSchema.allow(null),
  l2Cache: productFieldSchema.allow(null),

  // Theoretical Performance
  pixelRate: productFieldSchema.allow(null),
  textureRate: productFieldSchema.allow(null),
  fp32: productFieldSchema.allow(null),
  fp64: productFieldSchema.allow(null),

  // Memory
  memorySize: productFieldSchema.allow(null),
  memoryType: productFieldSchema.allow(null),
  memoryClock: productFieldSchema.allow(null),
  memoryInterface: productFieldSchema.allow(null),
  memoryBandwidth: productFieldSchema.allow(null),

  // API Support
  directxVersion: productFieldSchema.allow(null),
  openClVersion: productFieldSchema.allow(null),
  openGlVersion: productFieldSchema.allow(null),
  shaderModelVersion: productFieldSchema.allow(null),

  // Benchmarks
  benchmarks: Joi.array().items(productBenchmarkSchema),

  // Images
  images: Joi.array().items(productImageSchema),
}).options({ abortEarly: false });

interface GpuFormProps {
  gpu?: GpuProduct;
}

function formOptions(gpu?: GpuProduct): UseFormProps<GpuFormData> {
  const benchmarks = gpu?.benchmarks || [];
  const sources = gpu?.sources || [];
  const images = gpu?.images || [];

  return {
    resolver: joiResolver(gpuFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: gpu?.name ?? null,
      slug: gpu?.slug ?? null,
      otherNames: gpu?.otherNames || [],
      searchText: gpu?.searchText ?? null,
      affiliateUrl: gpu?.affiliateUrl ?? null,
      summary: gpu?.summary ?? null,

      parentId: gpu?.parentId ?? null,

      // Data Sources
      sources,

      // General
      partNumber: gpu?.fields?.partNumber ?? null,
      company: gpu?.company ?? null,
      marketSegment: gpu?.fields?.marketSegment ?? null,
      msrp: gpu?.fields?.msrp ?? null,
      releaseDate: gpu?.fields?.releaseDate ?? null,
      productionStatus: gpu?.fields?.productionStatus ?? null,

      // Processor
      codename: gpu?.fields?.codename ?? null,
      architecture: gpu?.fields?.architecture ?? null,
      processSize: gpu?.fields?.processSize ?? null,
      transistors: gpu?.fields?.transistors ?? null,

      // Board Compatibility & Dimensions
      slotWidth: gpu?.fields?.slotWidth ?? null,
      length: gpu?.fields?.length ?? null,
      width: gpu?.fields?.width ?? null,
      height: gpu?.fields?.height ?? null,
      weight: gpu?.fields?.weight ?? null,
      busInterface: gpu?.fields?.busInterface ?? null,
      tdp: gpu?.fields?.tdp ?? null,
      suggestedPsu: gpu?.fields?.suggestedPsu ?? null,
      powerConnectors: gpu?.fields?.powerConnectors ?? null,
      outputs: gpu?.fields?.outputs ?? null,

      // Cores & Clock Speeds
      gpuCores: gpu?.fields?.gpuCores ?? null,
      computeUnits: gpu?.fields?.computeUnits ?? null,
      tmus: gpu?.fields?.tmus ?? null,
      rops: gpu?.fields?.rops ?? null,
      tensorCores: gpu?.fields?.tensorCores ?? null,
      rtCores: gpu?.fields?.rtCores ?? null,
      gpuCoreBaseClock: gpu?.fields?.gpuCoreBaseClock ?? null,
      gpuCoreBoostClock: gpu?.fields?.gpuCoreBoostClock ?? null,
      l1Cache: gpu?.fields?.l1Cache ?? null,
      l2Cache: gpu?.fields?.l2Cache ?? null,

      // Theoretical Performance
      pixelRate: gpu?.fields?.pixelRate ?? null,
      textureRate: gpu?.fields?.textureRate ?? null,
      fp32: gpu?.fields?.fp32 ?? null,
      fp64: gpu?.fields?.fp64 ?? null,

      // Memory
      memorySize: gpu?.fields?.memorySize ?? null,
      memoryType: gpu?.fields?.memoryType ?? null,
      memoryClock: gpu?.fields?.memoryClock ?? null,
      memoryInterface: gpu?.fields?.memoryInterface ?? null,
      memoryBandwidth: gpu?.fields?.memoryBandwidth ?? null,

      // API Support
      directxVersion: gpu?.fields?.directxVersion ?? null,
      openClVersion: gpu?.fields?.openClVersion ?? null,
      openGlVersion: gpu?.fields?.openGlVersion ?? null,
      shaderModelVersion: gpu?.fields?.shaderModelVersion ?? null,

      // Benchmarks
      benchmarks,

      // Images
      images,
    },
  };
}

export const GpuForm: FunctionComponent<GpuFormProps> = (props) => {
  const { gpu } = props;
  const isUpdate = gpu != null;
  useProductCache(ProductType.Gpu, gpu);

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);
  const [parentGpu, setParentGpu] = useState<GpuProduct>(gpu?.parent);

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
          await productService.update(ProductType.Gpu, gpu.id, request);
        } else {
          await productService.create(ProductType.Gpu, request);
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
      await productService.delete(gpu.id);
      router.push(getAdminListGpusPath());
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [gpu, router, setError]);

  const handleParentGpuChange = useCallback((product: Product) => {
    setParentGpu(product as GpuProduct);
  }, []);

  const handleScrape = useCallback(
    (scraped: ScrapedProduct) => {
      const { data } = scraped;
      const name = data.name;
      const searchText = data.searchText;
      const otherNames = data.otherNames;
      const company = data.company;
      const fields = data.fields;
      const benchmarks = data.benchmarks;

      // Name
      if (name.enabled) {
        setValue('name', name.value as string);
      }

      // Search Text
      if (searchText.enabled) {
        setValue('searchText', searchText.value as string);
      }

      // Other Names
      if (otherNames.enabled) {
        setValue('otherNames', otherNames.value as string[]);
      }

      // Other Names
      if (company.enabled) {
        setValue('company', company.value as string);
      }

      // Fields
      Object.keys(fields || {}).forEach((field) => {
        if (fields[field].enabled) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(field as any, fields[field].value);
        }
      });

      // Benchmarks
      const scrapedBenchmarks = Object.keys(benchmarks || {})
        .filter((benchmark) => benchmarks[benchmark].enabled)
        .map((benchmark) => benchmarks[benchmark].value as ProductBenchmark);
      setValue('benchmarks', scrapedBenchmarks);
    },
    [setValue],
  );

  const importParentId = useWatch({
    control,
    name: ['parentId'],
  });

  const importSources = useWatch({
    control,
    name: ['sources'],
  });

  const handleScrapeClick = useCallback(() => {
    const sources: Partial<ProductSource>[] = importSources?.[0] || [];
    if (importParentId?.[0]) {
      sources.push({ sourceProductId: importParentId[0] });
    }
    showDialog(<ScrapeGpuDialog sources={sources} onImport={handleScrape} />, {
      disableClose: true,
    });
  }, [importParentId, importSources, handleScrape]);

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mb-0">Data Sources</h2>

          <InfoButton onClick={handleScrapeClick}>Scrape</InfoButton>
        </div>

        <Controller
          name="sources"
          control={control}
          render={({ field }) => (
            <ProductSourcesInput
              {...field}
              productType={ProductType.Gpu}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <Field>
          Chipset
          <Controller
            name="parentId"
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
              <ProductSlugInput {...field} control={control} ref={null} />
            )}
          />
          {errors.slug?.type === ValidationErrorType.MissingStringValue && (
            <FieldError>Required</FieldError>
          )}
        </Field>

        <Field>
          Searchable Text
          <Controller
            name="searchText"
            control={control}
            render={({ field }) => (
              <ProductSearchTextInput {...field} control={control} ref={null} />
            )}
          />
        </Field>

        <Field>
          Other Names
          <Controller
            name="otherNames"
            control={control}
            render={({ field }) => (
              <ProductOtherNamesInput {...field} control={control} ref={null} />
            )}
          />
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
        <h2 className="mb-4">Summary</h2>

        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <ProductSummaryInput
              {...field}
              control={control}
              productType={ProductType.Gpu}
              placeholder="Add product summary"
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">General Info</h2>

        <Field>
          <Controller
            name="partNumber"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Part Number"
                fieldKey="partNumber"
                placeholder={productFieldFormattedValue(
                  parentGpu?.fields?.partNumber ?? undefined,
                )}
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
              <TextInput
                {...field}
                ref={null}
                placeholder={parentGpu?.company ?? undefined}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="marketSegment"
            control={control}
            render={({ field }) => (
              <ProductEnumInput
                {...field}
                ref={null}
                label="Market Segment"
                fieldKey="marketSegment"
                items={[
                  {
                    label: formatMarketSegment(MarketSegment.Desktop),
                    value: MarketSegment.Desktop,
                  },
                  {
                    label: formatMarketSegment(MarketSegment.Mobile),
                    value: MarketSegment.Mobile,
                  },
                  {
                    label: formatMarketSegment(MarketSegment.Workstation),
                    value: MarketSegment.Workstation,
                  },
                  {
                    label: formatMarketSegment(MarketSegment.Integrated),
                    value: MarketSegment.Integrated,
                  },
                ]}
                placeholder={productFieldFormattedValue(
                  parentGpu?.fields?.marketSegment ?? undefined,
                )}
                formatter={(value) =>
                  formatMarketSegment(value as MarketSegment)
                }
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="msrp"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                productType={ProductType.Gpu}
                label="Launch Price (MSRP)"
                fieldKey="msrp"
                units={[CurrencyUnit.USD]}
                placeholder={productFieldFormattedValue(
                  parentGpu?.fields?.msrp ?? undefined,
                )}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <ProductDateInput
                {...field}
                ref={null}
                label="Release Date"
                fieldKey="releaseDate"
                placeholder={productFieldFormattedValue(
                  parentGpu?.fields?.releaseDate ?? undefined,
                )}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="productionStatus"
            control={control}
            render={({ field }) => (
              <ProductEnumInput
                {...field}
                ref={null}
                label="Production Status"
                fieldKey="productionStatus"
                items={[
                  {
                    label: formatProductionStatus(ProductionStatus.Unreleased),
                    value: ProductionStatus.Unreleased,
                  },
                  {
                    label: formatProductionStatus(ProductionStatus.Active),
                    value: ProductionStatus.Active,
                  },
                  {
                    label: formatProductionStatus(ProductionStatus.EndOfLife),
                    value: ProductionStatus.EndOfLife,
                  },
                ]}
                placeholder={productFieldFormattedValue(
                  parentGpu?.fields?.productionStatus ?? undefined,
                )}
                formatter={(value) =>
                  formatProductionStatus(value as ProductionStatus)
                }
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
            <Controller
              name="codename"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="GPU Codename"
                  fieldKey="codename"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.codename ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Architecture"
                  fieldKey="architecture"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.architecture ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="processSize"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  label="Process Size"
                  fieldKey="processSize"
                  productType={ProductType.Gpu}
                  units={[LengthUnit.nm, LengthUnit.um]}
                  {...field}
                  ref={null}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.processSize ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="transistors"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Transistors"
                  fieldKey="transistors"
                  productType={ProductType.Gpu}
                  units={[NumericUnit.million]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.transistors ?? undefined,
                  )}
                />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Memory</h3>

          <Field>
            <Controller
              name="memorySize"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Memory Size"
                  fieldKey="memorySize"
                  productType={ProductType.Gpu}
                  units={[
                    MemorySizeUnit.gb,
                    MemorySizeUnit.mb,
                    MemorySizeUnit.kb,
                  ]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.memorySize ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="memoryType"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Memory Type"
                  fieldKey="memoryType"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.memoryType ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="memoryClock"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Memory Clock"
                  fieldKey="memoryClock"
                  productType={ProductType.Gpu}
                  units={[ClockSpeedUnit.mhz]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.memoryClock ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="memoryInterface"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Memory Interface"
                  fieldKey="memoryInterface"
                  productType={ProductType.Gpu}
                  units={[BitUnit.bit]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.memoryInterface ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="memoryBandwidth"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Memory Bandwidth"
                  fieldKey="memoryBandwidth"
                  productType={ProductType.Gpu}
                  units={[BandwidthUnit.gbps, BandwidthUnit.mbps]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.memoryBandwidth ?? undefined,
                  )}
                />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Board Compatibility &amp; Dimensions</h3>

          <Field>
            <Controller
              name="slotWidth"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Slots"
                  fieldKey="slotWidth"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.slotWidth ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Length"
                  fieldKey="length"
                  productType={ProductType.Gpu}
                  units={[LengthUnit.mm]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.length ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Width"
                  fieldKey="width"
                  productType={ProductType.Gpu}
                  units={[LengthUnit.mm]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.width ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Height"
                  fieldKey="height"
                  productType={ProductType.Gpu}
                  units={[LengthUnit.mm]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.height ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Weight"
                  fieldKey="weight"
                  productType={ProductType.Gpu}
                  units={[WeightUnit.kg]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.weight ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="busInterface"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Bus Interface"
                  fieldKey="busInterface"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.busInterface ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="tdp"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Thermal Design Power (TDP)"
                  fieldKey="tdp"
                  productType={ProductType.Gpu}
                  units={[WattageUnit.w]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.tdp ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="suggestedPsu"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Suggested PSU"
                  fieldKey="suggestedPsu"
                  productType={ProductType.Gpu}
                  units={[WattageUnit.w]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.suggestedPsu ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="powerConnectors"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Power Connecters"
                  fieldKey="powerConnectors"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.powerConnectors ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="outputs"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Outputs"
                  fieldKey="outputs"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.outputs ?? undefined,
                  )}
                />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Cores &amp; Clock Speeds</h3>

          <Field>
            <Controller
              name="gpuCores"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="GPU Cores (Shader Units / CUDA Cores)"
                  fieldKey="gpuCores"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.gpuCores ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="computeUnits"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Compute Units / SM Count"
                  fieldKey="computeUnits"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.computeUnits ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="tmus"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Texture Mapping Units (TMUs)"
                  fieldKey="tmus"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.tmus ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="rops"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Render Output Units (ROPs)"
                  fieldKey="rops"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.rops ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="tensorCores"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Tensor Cores"
                  fieldKey="tensorCores"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.tensorCores ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="rtCores"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Ray Tracing Cores (RT Cores)"
                  fieldKey="rtCores"
                  productType={ProductType.Gpu}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.rtCores ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="gpuCoreBaseClock"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Clock Speed (Base)"
                  fieldKey="gpuCoreBaseClock"
                  productType={ProductType.Gpu}
                  units={[ClockSpeedUnit.mhz, ClockSpeedUnit.ghz]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.gpuCoreBaseClock ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="gpuCoreBoostClock"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Clock Speed (Boost)"
                  fieldKey="gpuCoreBoostClock"
                  productType={ProductType.Gpu}
                  units={[ClockSpeedUnit.mhz, ClockSpeedUnit.ghz]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.gpuCoreBoostClock ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="l1Cache"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="L1 Cache"
                  fieldKey="l1Cache"
                  productType={ProductType.Gpu}
                  units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.l1Cache ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="l2Cache"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="L2 Cache"
                  fieldKey="l2Cache"
                  productType={ProductType.Gpu}
                  units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.l2Cache ?? undefined,
                  )}
                />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">Theoretical Performance</h3>

          <Field>
            <Controller
              name="pixelRate"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Pixel Fill Rate"
                  fieldKey="pixelRate"
                  productType={ProductType.Gpu}
                  units={[PixelFillRateUnit.gpixelps]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.pixelRate ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="textureRate"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="Texture Fill Rate"
                  fieldKey="textureRate"
                  productType={ProductType.Gpu}
                  units={[TextureFillRateUnit.gtexelps]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.textureRate ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="fp32"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="FP32 Performance"
                  fieldKey="fp32"
                  productType={ProductType.Gpu}
                  units={[FlopsUnit.tflops, FlopsUnit.gflops]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.fp32 ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="fp64"
              control={control}
              render={({ field }) => (
                <ProductFloatInput
                  {...field}
                  ref={null}
                  label="FP64 Performance"
                  fieldKey="fp64"
                  productType={ProductType.Gpu}
                  units={[FlopsUnit.gflops, FlopsUnit.tflops]}
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.fp64 ?? undefined,
                  )}
                />
              )}
            />
          </Field>
        </section>

        <section>
          <h3 className="mb-4">API Support</h3>

          <Field>
            <Controller
              name="directxVersion"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="DirectX Version"
                  fieldKey="directxVersion"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.directxVersion ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="openClVersion"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Open CL Version"
                  fieldKey="openClVersion"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.openClVersion ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="openGlVersion"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Open GL Version"
                  fieldKey="openGlVersion"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.openGlVersion ?? undefined,
                  )}
                />
              )}
            />
          </Field>

          <Field>
            <Controller
              name="shaderModelVersion"
              control={control}
              render={({ field }) => (
                <ProductTextInput
                  {...field}
                  ref={null}
                  label="Shader Model Version"
                  fieldKey="shaderModelVersion"
                  placeholder={productFieldFormattedValue(
                    parentGpu?.fields?.shaderModelVersion ?? undefined,
                  )}
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
            <ProductBenchmarksInput
              {...field}
              productType={ProductType.Gpu}
              ref={null}
            />
          )}
        />
      </section>

      <section>
        <h2 className="mb-4">Images</h2>

        <Controller
          name="images"
          control={control}
          render={({ field }) => <ProductImagesInput {...field} ref={null} />}
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
): CreateProductRequest | UpdateProductRequest {
  return {
    product: {
      productType: ProductType.Gpu,
      parentId: formData.parentId,
      slug: formData.slug,
      name: formData.name,
      company: formData.company,
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,
      summary: formData.summary,

      // Product Fields
      fields: {
        // General Info
        partNumber: formData.partNumber,
        marketSegment: formData.marketSegment,
        msrp: formData.msrp,
        releaseDate: formData.releaseDate,
        productionStatus: formData.productionStatus,

        // Processor
        codename: formData.codename ?? null,
        architecture: formData.architecture ?? null,
        processSize: formData.processSize ?? null,
        transistors: formData.transistors ?? null,

        // Board Compatibility & Dimensions
        slotWidth: formData.slotWidth ?? null,
        length: formData.length ?? null,
        width: formData.width ?? null,
        height: formData.height ?? null,
        weight: formData.weight ?? null,
        busInterface: formData.busInterface ?? null,
        tdp: formData.tdp ?? null,
        suggestedPsu: formData.suggestedPsu ?? null,
        powerConnectors: formData.powerConnectors ?? null,
        outputs: formData.outputs ?? null,

        // Cores & Clock Speeds
        gpuCores: formData.gpuCores ?? null,
        computeUnits: formData.computeUnits ?? null,
        tmus: formData.tmus ?? null,
        rops: formData.rops ?? null,
        tensorCores: formData.tensorCores ?? null,
        rtCores: formData.rtCores ?? null,
        gpuCoreBaseClock: formData.gpuCoreBaseClock ?? null,
        gpuCoreBoostClock: formData.gpuCoreBoostClock ?? null,
        l1Cache: formData.l1Cache ?? null,
        l2Cache: formData.l2Cache ?? null,

        // Theoretical Performance
        pixelRate: formData.pixelRate ?? null,
        textureRate: formData.textureRate ?? null,
        fp32: formData.fp32 ?? null,
        fp64: formData.fp64 ?? null,

        // Memory
        memorySize: formData.memorySize ?? null,
        memoryType: formData.memoryType ?? null,
        memoryClock: formData.memoryClock ?? null,
        memoryInterface: formData.memoryInterface ?? null,
        memoryBandwidth: formData.memoryBandwidth ?? null,

        // API Support
        directxVersion: formData.directxVersion ?? null,
        openClVersion: formData.openClVersion ?? null,
        openGlVersion: formData.openGlVersion ?? null,
        shaderModelVersion: formData.shaderModelVersion ?? null,
      } as GpuFields,

      // Meta
      metadata: {},

      benchmarks: formData.benchmarks?.filter(
        (benchmark) => benchmark != null && benchmark.value != null,
      ),

      images:
        formData.images
          ?.filter((image) => image != null)
          .map((image) => ({ imageId: image.imageId })) ?? [],

      sources: formData.sources?.filter(
        (source) => source != null && source.sourceUrl != null,
      ),
    },
  };
}
