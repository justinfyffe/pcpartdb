import {
  ApiError,
  ClockSpeedUnit,
  CpuProduct,
  CurrencyUnit,
  formatMarketSegment,
  formatProductionStatus,
  getAdminListCpusPath,
  LengthUnit,
  MarketSegment,
  MemorySizeUnit,
  NumericUnit,
  ProductBenchmark,
  ProductionStatus,
  ProductSource,
  ProductType,
  TemperatureUnit,
  ValidationErrorType,
  WattageUnit,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
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
import {
  isBadRequestError,
  setValidationErrors,
} from 'packages/website/src/client/shared/error/utils';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ProductBenchmarksInput } from '../../product/ProductBenchmarkInput/ProductBenchmarksInput';
import { ProductBooleanInput } from '../../product/ProductBooleanInput/ProductBooleanInput';
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
import { ScrapeCpuDialog } from '../ScrapeCpuDialog/ScrapeCpuDialog';
import { CpuFormData } from './CpuFormData';
import { cpuFormOptions } from './cpuFormOptions';
import { formDataToCpuRequest } from './formDataToCpuRequest';

interface CpuFormProps {
  cpu?: CpuProduct;
}

export const CpuForm: FunctionComponent<CpuFormProps> = (props) => {
  const { cpu } = props;
  const isUpdate = cpu != null;
  useProductCache(ProductType.Cpu, cpu);

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const form = useMemo(() => cpuFormOptions(cpu), [cpu]);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CpuFormData>(form);

  console.log(errors);

  const handleSave = useCallback(
    async (formData: CpuFormData) => {
      setSaving(true);

      const request = formDataToCpuRequest(formData);

      try {
        if (isUpdate) {
          await productService.update(ProductType.Cpu, cpu.id, request);
        } else {
          await productService.create(ProductType.Cpu, request);
        }
        router.push(getAdminListCpusPath());
      } catch (err) {
        console.log(err);
        setRequestError(err as ApiError);
        setValidationErrors(err as ApiError, setError);
      } finally {
        setSaving(false);
      }
    },
    [cpu, isUpdate, router, setError],
  );

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await productService.delete(cpu.id);
      router.push(getAdminListCpusPath());
    } catch (err) {
      setRequestError(err as ApiError);
      setValidationErrors(err as ApiError, setError);
    } finally {
      setDeleting(false);
    }
  }, [cpu, router, setError]);

  const importSources = useWatch({
    control,
    name: ['sources'],
  });

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

      // Company
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

  const handleScrapeClick = useCallback(() => {
    const sources: Partial<ProductSource>[] = importSources?.[0] || [];
    showDialog(<ScrapeCpuDialog sources={sources} onImport={handleScrape} />, {
      disableClose: true,
    });
  }, [importSources, handleScrape]);

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
              productType={ProductType.Cpu}
              ref={null}
            />
          )}
        />
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
              productType={ProductType.Cpu}
              product={cpu}
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
                label="Part Number"
                fieldKey="partNumber"
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => <TextInput {...field} ref={null} />}
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
                    label: formatMarketSegment(MarketSegment.Server),
                    value: MarketSegment.Server,
                  },
                  {
                    label: formatMarketSegment(MarketSegment.Embedded),
                    value: MarketSegment.Embedded,
                  },
                ]}
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
                productType={ProductType.Cpu}
                label="Launch Price (MSRP)"
                fieldKey="msrp"
                units={[CurrencyUnit.USD]}
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
                formatter={(value) =>
                  formatProductionStatus(value as ProductionStatus)
                }
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="bundledCooler"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                label="Bundled Cooler"
                fieldKey="bundledCooler"
                ref={null}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Physical</h2>

        <Field>
          <Controller
            name="socket"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                label="Socket"
                fieldKey="socket"
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="foundry"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                label="Foundry"
                fieldKey="foundry"
                ref={null}
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
                {...field}
                ref={null}
                label="Process Size"
                fieldKey="processSize"
                productType={ProductType.Cpu}
                units={[LengthUnit.nm, LengthUnit.um]}
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
                productType={ProductType.Cpu}
                units={[NumericUnit.million]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="tCaseMax"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="TCase Max Temperature"
                fieldKey="tCaseMax"
                productType={ProductType.Cpu}
                units={[TemperatureUnit.c]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="tjMax"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="TJ Max Temperature"
                fieldKey="tjMax"
                productType={ProductType.Cpu}
                units={[TemperatureUnit.c]}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Technical</h2>

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
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="codename"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Codename"
                fieldKey="codename"
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="generation"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Series"
                fieldKey="generation"
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pciExpress"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="PCI Express"
                fieldKey="pciExpress"
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="chipsets"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Chipsets"
                fieldKey="chipsets"
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Memory</h2>

        <Field>
          <Controller
            name="memorySupport"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Memory Support"
                fieldKey="memorySupport"
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="memoryChannels"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Memory Channels"
                fieldKey="memoryChannels"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eccMemory"
            control={control}
            render={({ field }) => (
              <ProductBooleanInput
                {...field}
                ref={null}
                label="ECC Memory"
                fieldKey="eccMemory"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Cores &amp; Clock Speed</h2>

        <Field>
          <Controller
            name="cores"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Cores Count"
                fieldKey="cores"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="threads"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Threads Count"
                fieldKey="threads"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pCores"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Performance Cores (P-Cores) Count"
                fieldKey="pCores"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eCores"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Efficient Cores (E-Cores) Count"
                fieldKey="eCores"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="clock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Clock"
                fieldKey="clock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="turboClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Turbo Clock"
                fieldKey="turboClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pCoreClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Performance Core (P-Core) Clock"
                fieldKey="pCoreClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pCoreTurboClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Performance Core (P-Core) Turbo Clock"
                fieldKey="pCoreTurboClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eCoreClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Efficient Core (E-Core) Clock"
                fieldKey="eCoreClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eCoreTurboClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Efficient Core (E-Core) Turbo Clock"
                fieldKey="eCoreTurboClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.ghz, ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="baseClock"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Base Clock"
                fieldKey="baseClock"
                productType={ProductType.Cpu}
                units={[ClockSpeedUnit.mhz]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="multiplier"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Clock Multiplier"
                fieldKey="multiplier"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="multiplierUnlocked"
            control={control}
            render={({ field }) => (
              <ProductBooleanInput
                {...field}
                ref={null}
                label="Multiplier Unlocked"
                fieldKey="multiplierUnlocked"
                productType={ProductType.Cpu}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Power Consumption</h2>

        <Field>
          <Controller
            name="tdp"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="TDP"
                fieldKey="tdp"
                productType={ProductType.Cpu}
                units={[WattageUnit.w]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pl1"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="PL1"
                fieldKey="pl1"
                productType={ProductType.Cpu}
                units={[WattageUnit.w]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="pl2"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="PL2"
                fieldKey="pl2"
                productType={ProductType.Cpu}
                units={[WattageUnit.w]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="ppt"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="PPT"
                fieldKey="ppt"
                productType={ProductType.Cpu}
                units={[WattageUnit.w]}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Cache</h2>

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
                productType={ProductType.Cpu}
                units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
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
                productType={ProductType.Cpu}
                units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="l3Cache"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="L3 Cache"
                fieldKey="l3Cache"
                productType={ProductType.Cpu}
                units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eCoreL1Cache"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Efficient Core (E-Core) L1 Cache"
                fieldKey="eCoreL1Cache"
                productType={ProductType.Cpu}
                units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="eCoreL2Cache"
            control={control}
            render={({ field }) => (
              <ProductFloatInput
                {...field}
                ref={null}
                label="Efficient Core (E-Core) L2 Cache"
                fieldKey="eCoreL2Cache"
                productType={ProductType.Cpu}
                units={[MemorySizeUnit.kb, MemorySizeUnit.mb]}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Graphics & Features</h2>

        <Field>
          <Controller
            name="integratedGraphics"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Integrated Graphics"
                fieldKey="integratedGraphics"
              />
            )}
          />
        </Field>

        <Field>
          <Controller
            name="extensionsTechnologies"
            control={control}
            render={({ field }) => (
              <ProductTextInput
                {...field}
                ref={null}
                label="Extenisons / Technologies"
                fieldKey="extensionsTechnologies"
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Benchmarks</h2>

        <Controller
          name="benchmarks"
          control={control}
          render={({ field }) => (
            <ProductBenchmarksInput
              {...field}
              productType={ProductType.Cpu}
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
