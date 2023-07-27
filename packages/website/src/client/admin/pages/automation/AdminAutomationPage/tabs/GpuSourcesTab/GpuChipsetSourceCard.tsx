import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  formatProductSourceName,
  GpuDataSourceKey,
  GpuProductSource,
  GpuProductSourceGroup,
  Product,
  ProductType,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  formatProductName,
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
import React, { useCallback, useMemo, useState } from 'react';
import { SourceInputField } from '../../components/SourceInputField';

interface GpuChipsetSourceCardProps {
  sources: GpuProductSourceGroup;
}

export const GpuChipsetSourceCard = (props: GpuChipsetSourceCardProps) => {
  const { sources } = props;

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
  const [archiveUlBenchmark, setArchiveUlBenchmark] = useState(!!passMark);

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
  const [appliedGpu, setAppliedGpu] = useState<Product>(null);
  const [groupKey] = useState(
    () => techPowerUp?.groupKey || passMark?.groupKey || ulBenchmark?.groupKey,
  );

  const sourcesList = useMemo(
    () =>
      [
        techPowerUp
          ? `${formatProductSourceName(GpuDataSourceKey.TechPowerUp)} ${
              techPowerUpSources.length > 1
                ? `(x${techPowerUpSources.length})`
                : ''
            }`.trim()
          : null,
        passMark
          ? `${formatProductSourceName(GpuDataSourceKey.VideocardBenchmarks)} ${
              passMarkSources.length > 1 ? `(x${passMarkSources.length})` : ''
            }`.trim()
          : null,
        ulBenchmark
          ? `${formatProductSourceName(GpuDataSourceKey.UlBenchmarks)} ${
              ulBenchmarkSources.length > 1
                ? `(x${ulBenchmarkSources.length})`
                : ''
            }`.trim()
          : null,
      ]
        .filter((source) => source != null)
        .join(', '),
    [
      passMark,
      passMarkSources.length,
      techPowerUp,
      techPowerUpSources.length,
      ulBenchmark,
      ulBenchmarkSources.length,
    ],
  );

  // Callbacks

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
  }, [
    techPowerUp,
    archiveTechPowerUp,
    passMark,
    archivePassMark,
    ulBenchmark,
    archiveUlBenchmark,
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
      data: { preferredName, sources, chipsetId: null } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [ulBenchmark, handleSave, passMark, preferredName, techPowerUp]);

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
            <div className="flex justify-between">GPU Name</div>
            <TextInput value={preferredName} onChange={setPreferredName} />
            <FieldHint>
              This will be used as the GPU&apos;s name when it is created.
            </FieldHint>
          </Field>

          <div className="flex gap-4 items-start">
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

          <div className="flex justify-between gap-4">
            <div className="flex flex-1 gap-4 max-w-[50%]">
              <ProductAutocomplete
                productType={ProductType.Gpu}
                onChangeProduct={setAppliedGpu}
              />
              <GenericButton
                disabled={appliedGpu == null}
                onClick={handleApplyToGpu}
              >
                Apply
              </GenericButton>
            </div>

            <div className="flex gap-4">
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
