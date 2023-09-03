import {
  ArchiveBoxIcon,
  ArrowPathRoundedSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CpuDataSourceKey,
  CpuProductSource,
  CpuProductSourceGroup,
  CreateCpuActionData,
  formatProductName,
  generateCpuSlug,
  Product,
  ProductType,
  UpdateCpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  ProductAutocomplete,
  productSourceService,
} from 'packages/website/src/client/product';
import {
  Card,
  CardContent,
  CardTitle,
  Field,
  FieldHint,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { SourceInputField } from '../../components/SourceInputField';

interface CpuSourceCardProps {
  sources: CpuProductSourceGroup;
}

export const CpuSourceCard = (props: CpuSourceCardProps) => {
  const { sources } = props;

  const automationStatusContext = useContext(AutomationStatusContext);

  // States & Memos

  const [expanded, setExpanded] = useState(false);

  const techPowerUpSources = useMemo(
    () =>
      sources
        .filter((source) => source.sourceKey === CpuDataSourceKey.TechPowerUp)
        .sort((a, b) => a.sourceName.localeCompare(b.sourceName)),
    [sources],
  );
  const [techPowerUp, setTechPowerUp] = useState(
    () =>
      techPowerUpSources.find((value) => value.archived) ||
      techPowerUpSources[0] ||
      null,
  );
  const [archiveTechPowerUp, setArchiveTechPowerUp] = useState(!!techPowerUp);

  const passMarkSources = useMemo(
    () =>
      sources
        .filter((source) => source.sourceKey === CpuDataSourceKey.PassMark)
        .sort((a, b) => a.sourceName.localeCompare(b.sourceName)),
    [sources],
  );
  const [passMark, setPassMark] = useState(
    () =>
      passMarkSources.find((value) => value.archived) ||
      passMarkSources[0] ||
      null,
  );
  const [archivePassMark, setArchivePassMark] = useState(!!passMark);

  const geekBenchSources = useMemo(
    () =>
      sources
        .filter((source) => source.sourceKey === CpuDataSourceKey.GeekBench)
        .sort((a, b) => a.sourceName.localeCompare(b.sourceName)),
    [sources],
  );
  const [geekBench, setGeekBench] = useState(
    () =>
      geekBenchSources.find((value) => value.archived) ||
      geekBenchSources[0] ||
      null,
  );
  const [archiveGeekBench, setArchiveGeekBench] = useState(!!geekBench);

  const allArchived = useMemo(() => {
    return (
      (techPowerUp?.archived ?? true) &&
      (passMark?.archived ?? true) &&
      (geekBench?.archived ?? true)
    );
  }, [geekBench?.archived, passMark?.archived, techPowerUp?.archived]);

  const [preferredName, setPreferredName] = useState(
    () =>
      techPowerUp?.sourceName ||
      passMark?.sourceName ||
      geekBench?.sourceName ||
      null,
  );
  const [preferredSlug, setPreferredSlug] = useState(() =>
    generateCpuSlug(preferredName, null),
  );
  const [appliedCpu, setAppliedCpu] = useState<Product>(null);
  const [groupKey] = useState(
    () => techPowerUp?.groupKey || passMark?.groupKey || geekBench?.groupKey,
  );

  // Callbacks

  const handleGenerateSlug = useCallback(() => {
    setPreferredSlug(generateCpuSlug(preferredName, null));
  }, [preferredName]);

  const handleSave = useCallback(async () => {
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

    await automationStatusContext.refreshStatus();
  }, [
    archiveGeekBench,
    archivePassMark,
    archiveTechPowerUp,
    automationStatusContext,
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

    // Create automation action to update existing cpu.
    await automationService.createAction({
      type: AutomationActionType.UpdateCpu,
      description: formatProductName(ProductType.Cpu, appliedCpu),
      data: { cpuId: appliedCpu.id } as UpdateCpuActionData,
    });

    // Update sources
    await handleSave();
  }, [techPowerUp, passMark, geekBench, appliedCpu, handleSave]);

  const handleCreateCpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, geekBench].filter(
      (source) => source != null,
    );

    // Create automation action to create new CPU
    await automationService.createAction({
      type: AutomationActionType.CreateCpu,
      description: preferredName,
      data: { preferredName, preferredSlug, sources } as CreateCpuActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [
    geekBench,
    handleSave,
    passMark,
    preferredName,
    preferredSlug,
    techPowerUp,
  ]);

  // Render

  return (
    <Card>
      <div
        className="relative flex justify-between items-stretch gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded && <ChevronDownIcon className="w-4" />}
        {!expanded && <ChevronRightIcon className="w-4" />}

        <div className="flex flex-1 flex-col gap-1">
          <CardTitle>{preferredName}</CardTitle>

          <div className="text-xs">
            <span className="font-semibold">Grouping:</span>{' '}
            <span className="[overflow-wrap:anywhere]">{groupKey}</span>
          </div>
          <div className="text-xs flex flex-wrap gap-x-4 gap-y-1">
            <div>
              <span className="font-semibold">
                TechPowerUp
                {techPowerUpSources.length > 1
                  ? ` (x${techPowerUpSources.length})`
                  : ''}
                :
              </span>{' '}
              {techPowerUp != null ? (
                <a
                  href={techPowerUp.sourceUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  rel="noreferrer"
                >
                  {techPowerUp.sourceName}
                </a>
              ) : (
                '--'
              )}
            </div>
            <div>
              <span className="font-semibold">
                PassMark
                {passMarkSources.length > 1
                  ? ` (x${passMarkSources.length})`
                  : ''}
                :
              </span>{' '}
              {passMark != null ? (
                <a
                  href={passMark.sourceUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  rel="noreferrer"
                >
                  {passMark.sourceName}
                </a>
              ) : (
                '--'
              )}
            </div>
            <div>
              <span className="font-semibold">
                GeekBench
                {geekBenchSources.length > 1
                  ? ` (x${geekBenchSources.length})`
                  : ''}
                :
              </span>{' '}
              {geekBench != null ? (
                <a
                  href={geekBench.sourceUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  rel="noreferrer"
                >
                  {geekBench.sourceName}
                </a>
              ) : (
                '--'
              )}
            </div>
          </div>
        </div>

        {allArchived ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <ArchiveBoxIcon className="w-8" />
            Archived
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4">
            <GenericButton
              disabled={allArchived}
              title="Archive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSave();
              }}
            >
              <ArchiveBoxIcon className="w-4" />
            </GenericButton>
            <GenericButton
              disabled={allArchived}
              title="Create"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCreateCpu();
              }}
            >
              <PlusCircleIcon className="w-4" />
            </GenericButton>
          </div>
        )}
      </div>

      {expanded && (
        <CardContent>
          <div className="flex-1 flex gap-4 flex-wrap">
            <Field className="flex-1">
              <div className="flex justify-between">Name</div>
              <TextInput
                value={preferredName}
                onChange={setPreferredName}
                className="min-w-50"
              />
              <FieldHint>
                This will be used as the CPU&apos;s name when it is created.
              </FieldHint>
            </Field>

            <Field className="flex-1">
              <div className="flex justify-between">Slug</div>
              <TextInput
                value={preferredSlug}
                onChange={setPreferredSlug}
                onSuffixClick={handleGenerateSlug}
                suffix={<ArrowPathRoundedSquareIcon className="w-4" />}
                className="min-w-50"
              />
              <FieldHint>
                This will be used as the CPU&apos;s slug when it is created.
              </FieldHint>
            </Field>
          </div>

          <div className="flex flex-col">
            <SourceInputField
              productType={ProductType.Cpu}
              sourceKey={CpuDataSourceKey.TechPowerUp}
              sources={techPowerUpSources}
              currentSource={techPowerUp}
              archive={archiveTechPowerUp}
              setArchive={setArchiveTechPowerUp}
              onUseName={setPreferredName}
              onChange={(source) => setTechPowerUp(source as CpuProductSource)}
            />

            <SourceInputField
              productType={ProductType.Cpu}
              sourceKey={CpuDataSourceKey.PassMark}
              sources={passMarkSources}
              currentSource={passMark}
              archive={archivePassMark}
              setArchive={setArchivePassMark}
              onUseName={setPreferredName}
              onChange={(source) => setPassMark(source as CpuProductSource)}
            />

            <SourceInputField
              productType={ProductType.Cpu}
              sourceKey={CpuDataSourceKey.GeekBench}
              sources={geekBenchSources}
              currentSource={geekBench}
              archive={archiveGeekBench}
              setArchive={setArchiveGeekBench}
              onUseName={setPreferredName}
              onChange={(source) => setGeekBench(source as CpuProductSource)}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-1 gap-4 max-w-125">
              <ProductAutocomplete
                productType={ProductType.Cpu}
                onChangeProduct={setAppliedCpu}
                className="min-w-30"
              />
              <GenericButton
                disabled={appliedCpu == null}
                onClick={handleApplyToCpu}
              >
                Apply
              </GenericButton>
            </div>

            <div className="ml-auto flex gap-4">
              <GenericButton onClick={handleSave}>Archive</GenericButton>
              <GenericButton
                onClick={handleCreateCpu}
                className="flex gap-2 items-center"
              >
                Create CPU
              </GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
