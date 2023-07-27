import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  AutomationAction,
  Cpu,
  CpuDataSourceKey,
  FetchCpuDataActionData,
  Product,
  ProductSource,
  ProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  formatProductName,
  ProductAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
import { ProductSourceAutocomplete } from 'packages/website/src/client/product/components/ProductSourceAutocomplete';
import {
  Button,
  ButtonVariant,
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Field,
  FieldHint,
  FieldOptional,
  TextInput,
} from 'packages/website/src/client/shared/components';
import React, { useCallback, useMemo, useState } from 'react';

interface CpuSourceCardProps {
  sources: ProductSourceGroup;
}

export const CpuSourceCard = (props: CpuSourceCardProps) => {
  const { sources } = props;

  // Extract each individual source from the group
  const [techPowerUp, setTechPowerUp] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
      )[0] || null
    );
  });
  const [passMark, setPassMark] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.PassMark,
      )[0] || null
    );
  });
  const [geekBench, setGeekBench] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
      )[0] || null
    );
  });

  const [archiveTechPowerUp, setArchiveTechPowerUp] = useState(!!techPowerUp);
  const [archivePassMark, setArchivePassMark] = useState(!!passMark);
  const [archiveGeekBench, setArchiveGeekBench] = useState(!!geekBench);

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );
  const [appliedCpu, setAppliedCpu] = useState<Product>(null);

  const subtitle = useMemo(
    () =>
      [
        techPowerUp ? 'TechPowerUp' : null,
        passMark ? 'PassMark' : null,
        geekBench ? 'GeekBench' : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [geekBench, passMark, techPowerUp],
  );

  const techPowerUpHint = useMemo(
    () =>
      techPowerUp != null
        ? `ID: ${techPowerUp.id}${techPowerUp.archived ? ' (Archived)' : ''}`
        : '',
    [techPowerUp],
  );
  const passMarkHint = useMemo(
    () =>
      passMark != null
        ? `ID: ${passMark.id}${passMark.archived ? ' (Archived)' : ''}`
        : '',
    [passMark],
  );
  const geekBenchHint = useMemo(
    () =>
      geekBench != null
        ? `ID: ${geekBench.id}${geekBench.archived ? ' (Archived)' : ''}`
        : '',
    [geekBench],
  );

  const handleSetNameFromSource = useCallback((source: ProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const handleSave = useCallback(async () => {
    const newTechPowerUp: ProductSource = {
      ...techPowerUp,
      archived: archiveTechPowerUp,
    };
    const newPassMark: ProductSource = {
      ...passMark,
      archived: archivePassMark,
    };
    const newGeekBench: ProductSource = {
      ...geekBench,
      archived: archiveGeekBench,
    };

    const sources = [newTechPowerUp, newPassMark, newGeekBench].filter(
      (source) => source != null && source.id != null,
    );

    await productSourceService.upsert({ sources: sources });

    await setTechPowerUp(newTechPowerUp);
    await setPassMark(newPassMark);
    await setGeekBench(newGeekBench);
  }, [
    archiveGeekBench,
    archivePassMark,
    archiveTechPowerUp,
    geekBench,
    passMark,
    techPowerUp,
  ]);

  const handleApplyToCpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench]
      .filter((source) => source != null && source.id != null)
      .map((source) => source.id);

    // Add sources to existing product.
    await productSourceService.applyToProduct({
      productType: ProductType.Cpu,
      productId: appliedCpu.id,
      sources,
    });

    // Enqueue action to update existing product.
    await automationService.enqueue({
      action: AutomationAction.FetchCpuData,
      description: `Update CPU: ${formatProductName(
        ProductType.Cpu,
        appliedCpu,
      )}`,
      data: { cpuId: appliedCpu.id } as FetchCpuDataActionData,
    });

    // Update sources
    await handleSave();
  }, [techPowerUp, passMark, geekBench, appliedCpu, handleSave]);

  const handleEnqueueAutomation = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench].filter(
      (source) => source != null,
    );

    // Enqueue action to create new CPU
    await automationService.enqueue({
      action: AutomationAction.FetchCpuData,
      description: `Create CPU: ${preferredName}`,
      data: { preferredName, sources } as FetchCpuDataActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [geekBench, handleSave, passMark, preferredName, techPowerUp]);

  return (
    <Card>
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xs">{subtitle}</span>
          <CardTitle>{preferredName}</CardTitle>
        </div>

        <div className="flex flex-1 gap-4">
          <ProductAutocomplete
            productType={ProductType.Cpu}
            onChangeProduct={setAppliedCpu}
          />
          <Button
            variant={ButtonVariant.Generic}
            disabled={appliedCpu == null}
            onClick={handleApplyToCpu}
          >
            Apply to CPU
          </Button>
        </div>
      </div>
      <CardContent>
        <Field className="flex-1">
          <div className="flex justify-between">CPU Name</div>
          <TextInput value={preferredName} onChange={setPreferredName} />
          <FieldHint>
            This will be used as the CPU&apos;s name when it is created.
          </FieldHint>
        </Field>

        <div className="flex gap-4 items-center">
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>TechPowerUp</span>
                {techPowerUp != null && (
                  <a
                    href={techPowerUp.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {techPowerUp != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(techPowerUp);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.TechPowerUp}
                value={techPowerUp}
                onChange={setTechPowerUp}
              />
              <TextInput value={techPowerUp?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{techPowerUpHint}</FieldHint>
              <Checkbox
                disabled={techPowerUp == null}
                value={archiveTechPowerUp}
                onChange={(checked) => setArchiveTechPowerUp(checked)}
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>PassMark</span>
                {passMark != null && (
                  <a
                    href={passMark.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {passMark != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(passMark);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.PassMark}
                value={passMark}
                onChange={setPassMark}
              />
              <TextInput value={passMark?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{passMarkHint}</FieldHint>
              <Checkbox
                disabled={passMark == null}
                value={archivePassMark}
                onChange={(checked) => setArchivePassMark(checked)}
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
          <Field className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span>GeekBench</span>
                {geekBench != null && (
                  <a
                    href={geekBench.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>

              {geekBench != null && (
                <FieldOptional>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetNameFromSource(geekBench);
                    }}
                    className="cursor-pointer"
                  >
                    use name
                  </a>
                </FieldOptional>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <ProductSourceAutocomplete
                productType={ProductType.Cpu}
                source={CpuDataSourceKey.GeekBench}
                value={geekBench}
                onChange={setGeekBench}
              />
              <TextInput value={geekBench?.sourceUrl} disabled />
            </div>
            <div className="flex justify-between">
              <FieldHint>{geekBenchHint}</FieldHint>
              <Checkbox
                disabled={geekBench == null}
                value={archiveGeekBench}
                onChange={(checked) => setArchiveGeekBench(checked)}
              >
                Archive?
              </Checkbox>
            </div>
          </Field>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant={ButtonVariant.Generic} onClick={handleSave}>
            Save Sources
          </Button>
          <Button
            variant={ButtonVariant.Generic}
            onClick={handleEnqueueAutomation}
          >
            Enqueue CPU Creation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
