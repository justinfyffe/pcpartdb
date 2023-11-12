import {
  ArchiveBoxIcon,
  ArrowPathRoundedSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  AutomationSource,
  AutomationSourceGroup,
  CpuAutomationSourceGroup,
  CreateCpuActionData,
  formatAutomationSourceName,
  formatProductName,
  generateCpuSlug,
  Product,
  ProductSourceKey,
  ProductType,
  UpdateCpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
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

const SUPPORTED_KEYS = [
  ProductSourceKey.TechPowerUp,
  ProductSourceKey.NotebookCheck,
  ProductSourceKey.PassMark,
  ProductSourceKey.GeekBench,
];

interface CpuSourceCardProps {
  sources: CpuAutomationSourceGroup;
}

export const CpuSourceCard = (props: CpuSourceCardProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  // States & Memos

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
    return currentSources[key]?.sourceName ?? null;
  });
  const [preferredSlug, setPreferredSlug] = useState(() =>
    generateCpuSlug(preferredName, null),
  );
  const [appliedCpu, setAppliedCpu] = useState<Product>(null);
  const [groupKey] = useState(() => {
    const key = SUPPORTED_KEYS.find((key) => currentSources[key] != null);
    return currentSources[key]?.groupKey ?? null;
  });

  // Callbacks

  const handleSourceInputChange = useCallback(
    (key: ProductSourceKey, source: AutomationSource) => {
      currentSources[key] = source;
      setCurrentSources({ ...currentSources });
    },
    [currentSources],
  );

  const handleGenerateSlug = useCallback(() => {
    setPreferredSlug(generateCpuSlug(preferredName, null));
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

  const handleApplyToCpu = useCallback(async () => {
    const sources = SUPPORTED_KEYS.map((key) => currentSources[key])
      .filter((source) => source != null && source.id != null)
      .map((source) => source.id);

    // Add sources to existing product.
    await automationSourceService.applyToProduct({
      productType: ProductType.Cpu,
      productId: appliedCpu.id,
      sources,
    });

    // Create automation action to update existing cpu.
    await automationService.createAction({
      type: AutomationActionType.UpdateCpu,
      description: formatProductName(appliedCpu),
      data: { cpuId: appliedCpu.id } as UpdateCpuActionData,
    });

    // Update sources
    await handleSave();
  }, [appliedCpu, handleSave, currentSources]);

  const handleCreateCpu = useCallback(async () => {
    const sources = SUPPORTED_KEYS.map((key) => currentSources[key]).filter(
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
  }, [currentSources, handleSave, preferredName, preferredSlug]);

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
            {SUPPORTED_KEYS.map((supportedKey) => (
              <SourceInputField
                key={supportedKey}
                productType={ProductType.Cpu}
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
              />
            ))}
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
