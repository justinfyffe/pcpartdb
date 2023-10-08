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
  AutomationSource,
  AutomationSourceGroup,
  CreateGpuActionData,
  formatAutomationSourceName,
  formatProductName,
  generateGpuSlug,
  getViewGpuPath,
  GpuAutomationSourceGroup,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { automationSourceService } from 'packages/website/src/client/product/services/automationSourceService';
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

const SUPPORTED_KEYS = [ProductSourceKey.TechPowerUp];

interface GpuRetailModelSourceCardProps {
  sources: GpuAutomationSourceGroup;
}

export const GpuRetailModelSourceCard = (
  props: GpuRetailModelSourceCardProps,
) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  // States

  const [expanded, setExpanded] = useState(false);
  const [sources] = useState(props.sources);

  const subgroups = useMemo(() => {
    const ret: Partial<Record<ProductSourceKey, AutomationSourceGroup>> = {};
    for (const supportedKey of SUPPORTED_KEYS) {
      ret[supportedKey] = sources?.filter(
        (source) => source.sourceKey === supportedKey,
      ) as AutomationSourceGroup;
    }
    return ret;
  }, [sources]);

  const [currentSources, setCurrentSources] = useState(() => {
    const ret: Partial<Record<ProductSourceKey, AutomationSource>> = {};
    for (const supportedKey of SUPPORTED_KEYS) {
      const initial =
        subgroups[supportedKey].find((source) => !source.archived) ||
        subgroups[supportedKey][0];

      if (initial == null) {
        ret[supportedKey] = null;
      } else {
        ret[supportedKey] = initial;
      }
    }
    return ret;
  });

  const allArchived = useMemo(() => {
    return SUPPORTED_KEYS.every((key) => currentSources[key]?.archived ?? true);
  }, [currentSources]);

  const [preferredName, setPreferredName] = useState(() => {
    const key = SUPPORTED_KEYS.find((key) => currentSources[key] != null);
    return currentSources[key]?.sourceName;
  });
  const [preferredSlug, setPreferredSlug] = useState(() =>
    generateGpuSlug(preferredName, null),
  );
  const [groupKey] = useState(() => {
    const key = SUPPORTED_KEYS.find((key) => currentSources[key] != null);
    return currentSources[key]?.groupKey;
  });

  // Memos

  const [chipsetName, chipsetHref] = useMemo(() => {
    const chipset =
      currentSources[ProductSourceKey.TechPowerUp]?.relatedProduct;
    if (chipset == null) {
      return [null, null];
    }

    const name = formatProductName(chipset);
    const href = getViewGpuPath(chipset);
    return [name, href];
  }, [currentSources]);

  // Callbacks

  const handleSourceInputChange = useCallback(
    (key: ProductSourceKey, source: AutomationSource) => {
      currentSources[key] = source;
      setCurrentSources({ ...currentSources });
    },
    [currentSources],
  );

  const handleGenerateSlug = useCallback(() => {
    setPreferredSlug(generateGpuSlug(preferredName, null));
  }, [preferredName]);

  const handleSave = useCallback(async () => {
    const sources = SUPPORTED_KEYS.map((key) => currentSources[key]).filter(
      (source) => source != null && source.id != null,
    );

    const archivedSources = sources.map((source) => ({
      ...source,
      archived: true,
    }));

    await automationSourceService.upsert({ sources: archivedSources });

    sources.forEach((source) => {
      source.archived = true;
    });
    setCurrentSources({ ...currentSources });

    // Close the card
    await setExpanded(false);

    await automationStatusContext.refreshStatus();
  }, [automationStatusContext, currentSources]);

  const handleCreateGpu = useCallback(async () => {
    const sources = SUPPORTED_KEYS.map((key) => currentSources[key]).filter(
      (source) => source != null,
    );
    const chipsetId =
      currentSources[ProductSourceKey.TechPowerUp]?.relatedProductId;

    // Create automation action to create new GPU
    await automationService.createAction({
      type: AutomationActionType.CreateGpu,
      description: preferredName,
      data: {
        preferredName,
        preferredSlug,
        sources,
        relatedProductId: chipsetId,
      } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await handleSave();
  }, [currentSources, handleSave, preferredName, preferredSlug]);

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
            {SUPPORTED_KEYS.map((supportedKey) => (
              <div key={supportedKey}>
                <span className="font-semibold">
                  {formatAutomationSourceName(supportedKey)}
                  {subgroups[supportedKey].length > 1
                    ? ` (x${subgroups[supportedKey].length})`
                    : ''}
                  :
                </span>{' '}
                {currentSources[supportedKey] != null ? (
                  <a
                    href={currentSources[supportedKey].sourceUrl}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    rel="noreferrer"
                  >
                    {currentSources[supportedKey].sourceName}
                  </a>
                ) : (
                  '--'
                )}
              </div>
            ))}

            <div>
              <span className="font-semibold">Chipset:</span> {chipsetName}
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

            {SUPPORTED_KEYS.map((supportedKey) => (
              <SourceInputField
                key={supportedKey}
                productType={ProductType.Gpu}
                sourceKey={supportedKey}
                sources={subgroups[supportedKey] as AutomationSourceGroup}
                currentSource={currentSources[supportedKey] as AutomationSource}
                onUseName={setPreferredName}
                onChange={(source) =>
                  handleSourceInputChange(
                    supportedKey,
                    source as AutomationSource,
                  )
                }
                sourceDisabled
              />
            ))}
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
