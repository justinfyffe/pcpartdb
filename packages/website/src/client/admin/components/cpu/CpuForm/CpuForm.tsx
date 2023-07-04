import {
  ApiError,
  Cpu,
  CpuDataSource,
  CpuDataSourceKey,
  getAdminListCpusPath,
  ProductType,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { cpuService } from 'packages/website/src/client/product';
import { useProductCache } from 'packages/website/src/client/shared/cache';
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
} from 'packages/website/src/client/shared/components';
import {
  isBadRequestError,
  setValidationErrors,
} from 'packages/website/src/client/shared/error';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ProductDataSourceInput,
  ProductImagesInput,
  ScrapedProduct,
} from '../../product';
import { CpuDataInput } from '../CpuDataInput';
import { CpuSlugInput } from '../CpuSlugInput';
import { ScrapeCpuDialog } from '../ScrapeCpuDialog';
import { CpuFormData } from './CpuFormData';
import { cpuFormOptions } from './cpuFormOptions';
import { formDataToCpuRequest } from './formDataToCpuRequest';

interface CpuFormProps {
  cpu?: Cpu;
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
          await cpuService.update(cpu.id, request);
        } else {
          await cpuService.create(request);
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
      await cpuService.delete(cpu.id);
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
    name: ['techPowerUpSource', 'passMarkSource', 'geekBenchSource'],
  });

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

  const handleScrapeClick = useCallback(() => {
    const sources: Record<string, CpuDataSource> = {
      [CpuDataSourceKey.TechPowerUp]: importSources[0],
      [CpuDataSourceKey.PassMark]: importSources[1],
      [CpuDataSourceKey.GeekBench]: importSources[2],
    };
    showDialog(<ScrapeCpuDialog sources={sources} onImport={handleScrape} />, {
      disableClose: true,
    });
  }, [handleScrape, importSources]);

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
            render={({ field }) => (
              <ProductDataSourceInput {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          PassMark
          <Controller
            name="passMarkSource"
            control={control}
            render={({ field }) => (
              <ProductDataSourceInput {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          GeekBench
          <Controller
            name="geekBenchSource"
            control={control}
            render={({ field }) => (
              <ProductDataSourceInput {...field} ref={null} />
            )}
          />
        </Field>

        <Button variant={ButtonVariant.Warning} onClick={handleScrapeClick}>
          Scrape Details
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
              <CpuSlugInput control={control} {...field} ref={null} />
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
          Part Number
          <Controller
            name="partNumber"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="partNumber" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Company
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="company" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Market Segments
          <Controller
            name="marketSegments"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="marketSegments" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Launch Price (MSRP)
          <Controller
            name="launchPrice"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="launchPrice" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Release Date &amp; Format
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="releaseDate" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Production Status
          <Controller
            name="productionStatus"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="productionStatus" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Bundled Cooler
          <Controller
            name="bundledCooler"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="bundledCooler" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Physical</h2>

        <Field>
          Socket
          <Controller
            name="socket"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="socket" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Foundry
          <Controller
            name="foundry"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="foundry" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Process Size
          <Controller
            name="processSize"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="processSize" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Transistors
          <Controller
            name="transistors"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="transistors" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          TCase Max Temperature
          <Controller
            name="tCaseMax"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="tCaseMax" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          TJ Max Temperature
          <Controller
            name="tjMax"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="tjMax" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Technical</h2>

        <Field>
          Architecture
          <Controller
            name="architecture"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="architecture" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Codename
          <Controller
            name="codename"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="codename" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Generation
          <Controller
            name="generation"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="generation" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          PCI Express
          <Controller
            name="pciExpress"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="pciExpress" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Chipsets
          <Controller
            name="chipsets"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="chipsets" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Memory</h2>

        <Field>
          Memory Support
          <Controller
            name="memorySupport"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="memorySupport" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Memory Channels
          <Controller
            name="memoryChannels"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="memoryChannels" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          ECC Memory
          <Controller
            name="hasEccMemory"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="hasEccMemory" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Cores &amp; Clock Speed</h2>

        <Field>
          Cores Count
          <Controller
            name="coresCount"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="coresCount" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Threads Count
          <Controller
            name="threadsCount"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="threadsCount" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Performance Cores (P-Cores) Count
          <Controller
            name="performanceCoresCount"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="performanceCoresCount"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Efficient Cores (E-Cores) Count
          <Controller
            name="efficientCoresCount"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="efficientCoresCount" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Clock
          <Controller
            name="clock"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="clock" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Turbo Clock
          <Controller
            name="turboClock"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="turboClock" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Performance Core (P-Core) Clock
          <Controller
            name="performanceCoreClock"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="performanceCoreClock"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Performance Core (P-Core) Turbo Clock
          <Controller
            name="performanceCoreTurboClock"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="performanceCoreTurboClock"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Efficient Core (E-Core) Clock
          <Controller
            name="efficientCoreClock"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="efficientCoreClock" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Efficient Core (E-Core) Turbo Clock
          <Controller
            name="efficientCoreTurboClock"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="efficientCoreTurboClock"
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
              <CpuDataInput field="baseClock" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Clock Multiplier
          <Controller
            name="multiplier"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="multiplier" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Multiplier Unlocked
          <Controller
            name="isMultiplierUnlocked"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="isMultiplierUnlocked"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Power Consumption</h2>

        <Field>
          TDP
          <Controller
            name="tdp"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="tdp" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          PL1
          <Controller
            name="pl1"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="pl1" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          PL2
          <Controller
            name="pl2"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="pl2" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          PPT
          <Controller
            name="ppt"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="ppt" {...field} ref={null} />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Cache</h2>

        <Field>
          L1 Cache
          <Controller
            name="l1Cache"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="l1Cache" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          L2 Cache
          <Controller
            name="l2Cache"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="l2Cache" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          L3 Cache
          <Controller
            name="l3Cache"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="l3Cache" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Efficient Core (E-Core) L1 Cache
          <Controller
            name="efficientCoreL1Cache"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="efficientCoreL1Cache"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>

        <Field>
          Efficient Core (E-Core) L2 Cache
          <Controller
            name="efficientCoreL2Cache"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="efficientCoreL2Cache"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Graphics & Features</h2>

        <Field>
          Integrated Graphics
          <Controller
            name="integratedGraphics"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="integratedGraphics" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          Extenisons / Technologies
          <Controller
            name="extensionsTechnologies"
            control={control}
            render={({ field }) => (
              <CpuDataInput
                field="extensionsTechnologies"
                {...field}
                ref={null}
              />
            )}
          />
        </Field>
      </section>

      <section>
        <h2 className="mb-4">Benchmarks</h2>

        <Field>
          CPU Mark Multi Thread
          <Controller
            name="cpuMarkMultiThread"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="cpuMarkMultiThread" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          CPU Mark Single Thread
          <Controller
            name="cpuMarkSingleThread"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="cpuMarkSingleThread" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          GeekBench 6 Single Core
          <Controller
            name="geekbenchSingleCore"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="geekbenchSingleCore" {...field} ref={null} />
            )}
          />
        </Field>

        <Field>
          GeekBench 6 Multi Core
          <Controller
            name="geekbenchMultiCore"
            control={control}
            render={({ field }) => (
              <CpuDataInput field="geekbenchMultiCore" {...field} ref={null} />
            )}
          />
        </Field>
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
          <Button
            type="button"
            variant={ButtonVariant.Danger}
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
