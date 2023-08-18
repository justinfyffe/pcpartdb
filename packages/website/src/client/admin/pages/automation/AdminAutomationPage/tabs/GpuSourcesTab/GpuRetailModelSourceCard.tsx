import {
  ArchiveBoxIcon,
  ArrowPathRoundedSquareIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  generateGpuSlug,
  getViewGpuPath,
  GpuDataSourceKey,
  GpuProductSource,
  GpuProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import {
  formatGpuName,
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

interface GpuRetailModelSourceCardProps {
  sources: GpuProductSourceGroup;
}

export const GpuRetailModelSourceCard = (
  props: GpuRetailModelSourceCardProps,
) => {
  const { sources } = props;

  const automationStatusContext = useContext(AutomationStatusContext);

  // States

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

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );
  const [preferredSlug, setPreferredSlug] = useState(() =>
    generateGpuSlug(preferredName, null),
  );
  const [groupKey] = useState(() => techPowerUp?.groupKey);

  // Memos

  const [chipsetName, chipsetHref] = useMemo(() => {
    if (techPowerUp?.gpuChipset == null) {
      return [null, null];
    }

    const name = formatGpuName(techPowerUp.gpuChipset);
    const href = getViewGpuPath(techPowerUp.gpuChipset);
    return [name, href];
  }, [techPowerUp?.gpuChipset]);

  // Callbacks

  const handleGenerateSlug = useCallback(() => {
    setPreferredSlug(generateGpuSlug(preferredName, null));
  }, [preferredName]);

  const handleSave = useCallback(async () => {
    const newTechPowerUp: GpuProductSource =
      techPowerUp != null
        ? {
            ...techPowerUp,
            archived: archiveTechPowerUp,
          }
        : null;

    const sources = [newTechPowerUp].filter(
      (source) => source != null && source.id != null,
    );

    await productSourceService.upsert({ sources: sources });

    await setTechPowerUp(newTechPowerUp);

    // Close the card
    await setExpanded(false);

    await automationStatusContext.refreshStatus();
  }, [archiveTechPowerUp, automationStatusContext, techPowerUp]);

  const handleCreateGpu = useCallback(async () => {
    const sources = [techPowerUp].filter((source) => source != null);

    // Create automation action to create new GPU
    await automationService.createAction({
      type: AutomationActionType.CreateGpu,
      description: preferredName,
      data: {
        preferredName,
        preferredSlug,
        sources,
        chipsetId: techPowerUp.gpuChipsetId,
      } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [handleSave, preferredName, preferredSlug, techPowerUp]);

  // Render

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
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
              <span className="font-semibold">Chipset:</span> {chipsetName}
            </div>
          </div>
        </div>

        {techPowerUp.archived ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <ArchiveBoxIcon className="w-8" />
            Archived
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4">
            <GenericButton
              disabled={techPowerUp.archived}
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
              disabled={techPowerUp.archived}
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

          <div className="flex flex-wrap gap-4 items-start">
            <Field className="flex-1">
              <div className="flex gap-2">
                Chipset{' '}
                {chipsetHref != null && (
                  <a href={chipsetHref} target="_blank" rel="noreferrer">
                    <ArrowTopRightOnSquareIcon className="w-4 inline mb-1" />
                  </a>
                )}
              </div>
              <TextInput value={chipsetName} disabled />
            </Field>

            <SourceInputField
              productType={ProductType.Gpu}
              sourceKey={GpuDataSourceKey.TechPowerUp}
              sources={techPowerUpSources}
              currentSource={techPowerUp}
              archive={archiveTechPowerUp}
              setArchive={setArchiveTechPowerUp}
              onUseName={setPreferredName}
              onChange={(source) => setTechPowerUp(source as GpuProductSource)}
              sourceDisabled
            />
          </div>

          <div className="flex flex-wrap justify-end">
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
