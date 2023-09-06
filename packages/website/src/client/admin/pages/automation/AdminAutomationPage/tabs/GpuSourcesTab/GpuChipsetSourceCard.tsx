import {
  ArchiveBoxIcon,
  ArrowPathRoundedSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  formatProductName,
  generateGpuSlug,
  GpuDataSourceKey,
  GpuProductSource,
  GpuProductSourceGroup,
  Product,
  ProductType,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import { productSourceService } from 'packages/website/src/client/product/services/productSourceService';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import {
  Field,
  FieldHint,
} from 'packages/website/src/client/shared/components/Field/Field';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { SourceInputField } from '../../components/SourceInputField';

interface GpuChipsetSourceCardProps {
  sources: GpuProductSourceGroup;
}

export const GpuChipsetSourceCard = (props: GpuChipsetSourceCardProps) => {
  const { sources } = props;

  const automationStatusContext = useContext(AutomationStatusContext);

  // States & Memos

  const [expanded, setExpanded] = useState(false);

  const techPowerUpSources = useMemo(
    () =>
      sources
        .filter((source) => source.sourceKey === GpuDataSourceKey.TechPowerUp)
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
        .filter(
          (source) => source.sourceKey === GpuDataSourceKey.VideocardBenchmarks,
        )
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

  const ulBenchmarkSources = useMemo(
    () =>
      sources
        .filter((source) => source.sourceKey === GpuDataSourceKey.UlBenchmarks)
        .sort((a, b) => a.sourceName.localeCompare(b.sourceName)),
    [sources],
  );
  const [ulBenchmark, setUlBenchmark] = useState(
    () =>
      ulBenchmarkSources.find((value) => value.archived) ||
      ulBenchmarkSources[0] ||
      null,
  );
  const [archiveUlBenchmark, setArchiveUlBenchmark] = useState(!!ulBenchmark);

  const allArchived = useMemo(() => {
    return (
      (techPowerUp?.archived ?? true) &&
      (passMark?.archived ?? true) &&
      (ulBenchmark?.archived ?? true)
    );
  }, [techPowerUp?.archived, passMark?.archived, ulBenchmark?.archived]);

  const [preferredName, setPreferredName] = useState(
    () =>
      techPowerUp?.sourceName ||
      passMark?.sourceName ||
      ulBenchmark?.sourceName,
  );
  const [preferredSlug, setPreferredSlug] = useState(() =>
    generateGpuSlug(preferredName, null),
  );
  const [appliedGpu, setAppliedGpu] = useState<Product>(null);
  const [groupKey] = useState(
    () => techPowerUp?.groupKey || passMark?.groupKey || ulBenchmark?.groupKey,
  );

  // Callbacks

  const handleGenerateSlug = useCallback(() => {
    setPreferredSlug(generateGpuSlug(preferredName, null));
  }, [preferredName]);

  const handleSave = useCallback(async () => {
    const newTechPowerUp =
      techPowerUp != null
        ? { ...techPowerUp, archived: archiveTechPowerUp }
        : null;
    const newPassMark =
      passMark != null ? { ...passMark, archived: archivePassMark } : null;
    const newUlBenchmark =
      ulBenchmark != null
        ? { ...ulBenchmark, archived: archiveUlBenchmark }
        : null;

    const sources = [newTechPowerUp, newPassMark, newUlBenchmark].filter(
      (source) => source != null && source.id != null,
    );

    await productSourceService.upsert({ sources: sources });

    setTechPowerUp(newTechPowerUp);
    setPassMark(newPassMark);
    setUlBenchmark(newUlBenchmark);

    // Close the card
    await setExpanded(false);

    await automationStatusContext.refreshStatus();
  }, [
    techPowerUp,
    archiveTechPowerUp,
    passMark,
    archivePassMark,
    ulBenchmark,
    archiveUlBenchmark,
    automationStatusContext,
  ]);

  const handleApplyToGpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, ulBenchmark]
      .filter((source) => source != null && source.id != null)
      .map((source) => source.id);

    // Add sources to existing product.
    await productSourceService.applyToProduct({
      productType: ProductType.Gpu,
      productId: appliedGpu.id,
      sources,
    });

    // Create automation action to update existing gpu.
    await automationService.createAction({
      type: AutomationActionType.UpdateGpu,
      description: formatProductName(ProductType.Gpu, appliedGpu),
      data: { gpuId: appliedGpu.id } as UpdateGpuActionData,
    });

    // Update sources
    await handleSave();
  }, [techPowerUp, passMark, ulBenchmark, appliedGpu, handleSave]);

  const handleCreateGpu = useCallback(async () => {
    const sources = [techPowerUp, passMark, ulBenchmark].filter(
      (source) => source != null,
    );

    // Create automation action to create new GPU
    await automationService.createAction({
      type: AutomationActionType.CreateGpu,
      description: preferredName,
      data: {
        preferredName,
        preferredSlug,
        sources,
        chipsetId: null,
      } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [
    techPowerUp,
    passMark,
    ulBenchmark,
    preferredName,
    preferredSlug,
    handleSave,
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
                UL Benchmarks
                {ulBenchmarkSources.length > 1
                  ? ` (x${ulBenchmarkSources.length})`
                  : ''}
                :
              </span>{' '}
              {ulBenchmark != null ? (
                <a
                  href={ulBenchmark.sourceUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  rel="noreferrer"
                >
                  {ulBenchmark.sourceName}
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
                handleCreateGpu();
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
                This will be used as the GPU&apos;s name when it is created.
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
                This will be used as the GPU&apos;s slug when it is created.
              </FieldHint>
            </Field>
          </div>

          <div className="flex flex-col">
            <SourceInputField
              productType={ProductType.Gpu}
              sourceKey={GpuDataSourceKey.TechPowerUp}
              sources={techPowerUpSources}
              currentSource={techPowerUp}
              archive={archiveTechPowerUp}
              setArchive={setArchiveTechPowerUp}
              onUseName={setPreferredName}
              onChange={(source) => setTechPowerUp(source as GpuProductSource)}
            />

            <SourceInputField
              productType={ProductType.Gpu}
              sourceKey={GpuDataSourceKey.VideocardBenchmarks}
              sources={passMarkSources}
              currentSource={passMark}
              archive={archivePassMark}
              setArchive={setArchivePassMark}
              onUseName={setPreferredName}
              onChange={(source) => setPassMark(source as GpuProductSource)}
            />

            <SourceInputField
              productType={ProductType.Gpu}
              sourceKey={GpuDataSourceKey.UlBenchmarks}
              sources={ulBenchmarkSources}
              currentSource={ulBenchmark}
              archive={archiveUlBenchmark}
              setArchive={setArchiveUlBenchmark}
              onUseName={setPreferredName}
              onChange={(source) => setUlBenchmark(source as GpuProductSource)}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-1 gap-4 max-w-125">
              <ProductAutocomplete
                productType={ProductType.Gpu}
                onChangeProduct={setAppliedGpu}
                className="min-w-30"
              />
              <GenericButton
                disabled={appliedGpu == null}
                onClick={handleApplyToGpu}
              >
                Apply
              </GenericButton>
            </div>

            <div className="ml-auto flex gap-4">
              <GenericButton onClick={handleSave}>Save</GenericButton>
              <GenericButton onClick={handleCreateGpu}>
                Create GPU
              </GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
