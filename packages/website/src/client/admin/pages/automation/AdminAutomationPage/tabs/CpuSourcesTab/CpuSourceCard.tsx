import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CpuDataSourceKey,
  CpuProductSource,
  CpuProductSourceGroup,
  CreateCpuActionData,
  Product,
  ProductSource,
  ProductType,
  UpdateCpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  formatProductName,
  ProductAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
import { ProductSourceAutocomplete } from 'packages/website/src/client/product/components/ProductSourceAutocomplete';
import {
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Field,
  FieldHint,
  FieldOptional,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';

interface CpuSourceCardProps {
  sources: CpuProductSourceGroup;
}

export const CpuSourceCard = (props: CpuSourceCardProps) => {
  const { sources } = props;

  // States

  const [expanded, setExpanded] = useState(false);

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

  const [groupKey] = useState(
    () => techPowerUp?.groupKey || passMark?.groupKey || geekBench?.groupKey,
  );

  const techPowerUpId = techPowerUp?.id;
  const passMarkId = passMark?.id;
  const geekBenchId = geekBench?.id;
  const techPowerUpArchived = techPowerUp?.archived;
  const passMarkArchived = passMark?.archived;
  const geekBenchArchived = geekBench?.archived;
  const allArchived =
    (techPowerUpArchived ?? true) &&
    (passMarkArchived ?? true) &&
    (geekBenchArchived ?? true);

  // Memos

  const totalTechPowerUpInGroup = useMemo(
    () =>
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
      ).length,
    [sources],
  );
  const totalPassMarkInGroup = useMemo(
    () =>
      sources.filter((source) => source.sourceKey === CpuDataSourceKey.PassMark)
        .length,
    [sources],
  );
  const totalGeekBenchInGroup = useMemo(
    () =>
      sources.filter(
        (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
      ).length,
    [sources],
  );

  const sourcesList = useMemo(
    () =>
      [
        techPowerUp
          ? `TechPowerUp${
              totalTechPowerUpInGroup > 1
                ? ` (x${totalTechPowerUpInGroup})`
                : ''
            }`
          : null,
        passMark
          ? `PassMark${
              totalPassMarkInGroup > 1 ? ` (x${totalPassMarkInGroup})` : ''
            }`
          : null,
        geekBench
          ? `GeekBench${
              totalGeekBenchInGroup > 1 ? ` (x${totalGeekBenchInGroup})` : ''
            }`
          : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [
      geekBench,
      passMark,
      techPowerUp,
      totalGeekBenchInGroup,
      totalPassMarkInGroup,
      totalTechPowerUpInGroup,
    ],
  );

  // Callbacks

  const setNameFromSource = useCallback((source: CpuProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const save = useCallback(async () => {
    const newTechPowerUp: CpuProductSource =
      techPowerUp != null
        ? {
            ...techPowerUp,
            archived: archiveTechPowerUp,
          }
        : null;
    const newPassMark: CpuProductSource =
      passMark != null
        ? {
            ...passMark,
            archived: archivePassMark,
          }
        : null;
    const newGeekBench: CpuProductSource =
      geekBench != null
        ? {
            ...geekBench,
            archived: archiveGeekBench,
          }
        : null;

    const sources = [newTechPowerUp, newPassMark, newGeekBench].filter(
      (source) => source != null && source.id != null,
    );

    await productSourceService.upsert({ sources: sources });

    await setTechPowerUp(newTechPowerUp);
    await setPassMark(newPassMark);
    await setGeekBench(newGeekBench);

    // Close the card
    await setExpanded(false);
  }, [
    archiveGeekBench,
    archivePassMark,
    archiveTechPowerUp,
    geekBench,
    passMark,
    techPowerUp,
  ]);

  const setTechPowerUpFromAutocomplete = useCallback(
    (source: ProductSource) => {
      setTechPowerUp(source as CpuProductSource);
      setArchiveTechPowerUp(!!source);
    },
    [],
  );

  const setPassMarkFromAutocomplete = useCallback((source: ProductSource) => {
    setPassMark(source as CpuProductSource);
    setArchivePassMark(!!source);
  }, []);

  const setGeekBenchFromAutocomplete = useCallback((source: ProductSource) => {
    setGeekBench(source as CpuProductSource);
    setArchiveGeekBench(!!source);
  }, []);

  const applyToCpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench]
      .filter((source) => source != null && source.id != null)
      .map((source) => source.id);

    // Add sources to existing product.
    await productSourceService.applyToProduct({
      productType: ProductType.Cpu,
      productId: appliedCpu.id,
      sources,
    });

    // Create automation action to update existing cpu.
    await automationService.createAction({
      type: AutomationActionType.UpdateCpu,
      description: formatProductName(ProductType.Cpu, appliedCpu),
      data: { cpuId: appliedCpu.id } as UpdateCpuActionData,
    });

    // Update sources
    await save();
  }, [techPowerUp, passMark, geekBench, appliedCpu, save]);

  const createCpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench].filter(
      (source) => source != null,
    );

    // Create automation action to create new CPU
    await automationService.createAction({
      type: AutomationActionType.CreateCpu,
      description: preferredName,
      data: { preferredName, sources } as CreateCpuActionData,
    });

    // Update sources to archive them.
    await save();
  }, [geekBench, save, passMark, preferredName, techPowerUp]);

  // Render

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {allArchived && (
          <div className="absolute left-0 right-0 flex justify-center text-3xl text-dimmed">
            Archived
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <CardTitle>{preferredName}</CardTitle>
          <span className="text-xs">
            <span className="font-semibold">Grouping:</span> {groupKey}
          </span>
          <span className="text-xs">
            <span className="font-semibold">Sources:</span> {sourcesList}
          </span>
        </div>

        {expanded && <ChevronDownIcon className="w-8" />}
        {!expanded && <ChevronLeftIcon className="w-8" />}
      </div>

      {expanded && (
        <CardContent>
          <Field className="flex-1">
            <div className="flex justify-between">CPU Name</div>
            <TextInput value={preferredName} onChange={setPreferredName} />
            <FieldHint>
              This will be used as the CPU&apos;s name when it is created.
            </FieldHint>
          </Field>

          <div className="flex gap-4 items-start">
            <Field className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span>
                    TechPowerUp{' '}
                    {totalTechPowerUpInGroup > 1 ? (
                      <>(x{totalTechPowerUpInGroup})</>
                    ) : (
                      <></>
                    )}
                  </span>
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
                        setNameFromSource(techPowerUp);
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
                  onChange={setTechPowerUpFromAutocomplete}
                />
                <TextInput value={techPowerUp?.sourceUrl} disabled />
              </div>
              {techPowerUp != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {techPowerUpId}:{' '}
                    {techPowerUpArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>
                  <Checkbox
                    disabled={techPowerUp == null}
                    value={archiveTechPowerUp}
                    onChange={(checked) => setArchiveTechPowerUp(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
            </Field>

            <Field className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span>
                    PassMark{' '}
                    {totalPassMarkInGroup > 1 ? (
                      <>(x{totalPassMarkInGroup})</>
                    ) : (
                      <></>
                    )}
                  </span>
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
                        setNameFromSource(passMark);
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
                  onChange={setPassMarkFromAutocomplete}
                />
                <TextInput value={passMark?.sourceUrl} disabled />
              </div>
              {passMark != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {passMarkId}:{' '}
                    {passMarkArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>

                  <Checkbox
                    disabled={passMark == null}
                    value={archivePassMark}
                    onChange={(checked) => setArchivePassMark(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
            </Field>

            <Field className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span>
                    GeekBench{' '}
                    {totalGeekBenchInGroup > 1 ? (
                      <>(x{totalGeekBenchInGroup})</>
                    ) : (
                      <></>
                    )}
                  </span>
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
                        setNameFromSource(geekBench);
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
                  onChange={setGeekBenchFromAutocomplete}
                />
                <TextInput value={geekBench?.sourceUrl} disabled />
              </div>
              {geekBench != null && (
                <div className="flex justify-between">
                  <FieldHint>
                    {geekBenchId}:{' '}
                    {geekBenchArchived ? <>Archived</> : <>Not Archived</>}
                  </FieldHint>

                  <Checkbox
                    disabled={geekBench == null}
                    value={archiveGeekBench}
                    onChange={(checked) => setArchiveGeekBench(checked)}
                  >
                    Archive
                  </Checkbox>
                </div>
              )}
            </Field>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-4 max-w-[50%]">
              <ProductAutocomplete
                productType={ProductType.Cpu}
                onChangeProduct={setAppliedCpu}
              />
              <GenericButton disabled={appliedCpu == null} onClick={applyToCpu}>
                Apply
              </GenericButton>
            </div>

            <div className="flex gap-4">
              <GenericButton onClick={save}>Archive</GenericButton>
              <GenericButton onClick={createCpu}>Create CPU</GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
