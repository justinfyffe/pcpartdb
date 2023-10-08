import 'reflect-metadata';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { AutomationSource, formatAutomationSourceName } from '@pcpartdb/shared';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { Dialog } from 'packages/website/src/client/shared/components/Dialog/Dialog';
import { closeDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { useCallback, useMemo, useState } from 'react';

interface SourcePickerDialogProps {
  sources: AutomationSource[];
  currentSource?: AutomationSource;

  onSelected?: (selected: AutomationSource) => void;
}

export const SourcePickerDialog = (props: SourcePickerDialogProps) => {
  const { sources, currentSource, onSelected } = props;

  const [selected, setSelected] = useState(currentSource);

  // Memos

  const sourceList = useMemo(
    () => [...sources].sort((a, b) => a.sourceName.localeCompare(b.sourceName)),
    [sources],
  );

  const sourceKeyName = useMemo(
    () => formatAutomationSourceName(sources[0].sourceKey),
    [sources],
  );

  // Callbacks

  const handleApply = useCallback(() => {
    onSelected?.(selected);
    closeDialog();
  }, [onSelected, selected]);

  // Render

  return (
    <Dialog title={`Choose Source for ${sourceKeyName}`} showClose={true}>
      <div className="flex flex-col gap-2">
        {sourceList.map((source, _i) => (
          <div
            key={source.id}
            className={classNames(
              'border-px  flex p-2 items-center gap-4',
              selected?.id === source.id ? 'bg-primary text-default' : '',
            )}
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setSelected(source)}
            >
              <div className="font-semibold">{source.sourceName}</div>
              <div>{source.archived ? <>Archived</> : <>Not Archived</>}</div>
            </div>

            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noreferrer nofollow"
              className="text-inherit"
            >
              <ArrowTopRightOnSquareIcon className="w-6 inline mb-1" />
            </a>
          </div>
        ))}

        <PrimaryButton className="self-end" onClick={handleApply}>
          Apply
        </PrimaryButton>
      </div>
    </Dialog>
  );
};
