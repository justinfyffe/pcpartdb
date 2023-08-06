import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
  AutomationActionType,
  CreateGpuActionData,
  GpuDataSourceKey,
  GpuProductSource,
  GpuProductSourceGroup,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services';
import { productSourceService } from 'packages/website/src/client/product';
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

interface GpuRetailModelSourceCardProps {
  sources: GpuProductSourceGroup;
}

export const GpuRetailModelSourceCard = (
  props: GpuRetailModelSourceCardProps,
) => {
  const { sources } = props;

  // States

  const [expanded, setExpanded] = useState(false);

  // Extract each individual source from the group
  const [techPowerUp, setTechPowerUp] = useState(() => {
    return (
      sources.filter(
        (source) => source.sourceKey === GpuDataSourceKey.TechPowerUp,
      )[0] || null
    );
  });

  const [archiveTechPowerUp, setArchiveTechPowerUp] = useState(!!techPowerUp);

  const [preferredName, setPreferredName] = useState(
    () => sources[0].sourceName,
  );

  const [groupKey] = useState(() => techPowerUp?.groupKey);

  const techPowerUpId = techPowerUp?.id;
  const techPowerUpArchived = techPowerUp?.archived;

  // Memos

  const subtitle = useMemo(
    () =>
      [techPowerUp ? 'TechPowerUp' : null]
        .filter((source) => source != null)
        .join(', '),
    [techPowerUp],
  );

  // Callbacks

  const setNameFromSource = useCallback((source: GpuProductSource) => {
    const name = source.sourceName;
    setPreferredName(name);
  }, []);

  const save = useCallback(async () => {
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
  }, [archiveTechPowerUp, techPowerUp]);

  const createGpu = useCallback(async () => {
    const sources = [techPowerUp].filter((source) => source != null);

    // Create automation action to create new GPU
    await automationService.createAction({
      type: AutomationActionType.CreateGpu,
      description: preferredName,
      data: {
        preferredName,
        sources,
        chipsetId: techPowerUp.gpuChipsetId,
      } as CreateGpuActionData,
    });

    // Update sources to archive them.
    await save();
  }, [save, preferredName, techPowerUp]);

  // Render

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {techPowerUpArchived && (
          <div className="absolute left-0 right-0 flex justify-center text-3xl text-dimmed">
            Archived
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <CardTitle>{preferredName}</CardTitle>
          <span className="text-xs">{subtitle}</span>
          <span className="text-xs">{groupKey}</span>
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
                <TextInput value={techPowerUp.sourceName} disabled />
                <TextInput value={techPowerUp.sourceUrl} disabled />
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
          </div>

          <div className="flex justify-end">
            <div className="flex gap-4">
              <GenericButton onClick={save}>Save</GenericButton>
              <GenericButton onClick={createGpu}>Create GPU</GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
