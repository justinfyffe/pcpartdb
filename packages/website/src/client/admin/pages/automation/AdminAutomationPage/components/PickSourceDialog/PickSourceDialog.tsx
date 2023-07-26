import 'reflect-metadata';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { formatProductSourceName, ProductSource } from '@pcpartdb/shared';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { Dialog } from 'packages/website/src/client/shared/components/Dialog/Dialog';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { useMemo } from 'react';

interface PickSourceDialogProps {
  sources: ProductSource[];
  currentSource?: ProductSource;
}

export const PickSourceDialogDialog = (props: PickSourceDialogProps) => {
  const { sources, currentSource } = props;

  // Memos

  const sourceKeyName = useMemo(
    () => formatProductSourceName(sources[0].sourceKey),
    [sources],
  );

  // Render

  return (
    <Dialog title={`Choose Source for ${sourceKeyName}`} showClose={true}>
      <div className="flex flex-col gap-2">
        {sources.map((source, _i) => (
          <div
            key={source.id}
            className={classNames(
              'border-px cursor-pointer flex p-2 items-center',
              currentSource?.id === source.id ? 'bg-neutral' : '',
            )}
          >
            <div className="flex-1 font-semibold">{source.sourceName}</div>

            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noreferrer nofollow"
            >
              <ArrowTopRightOnSquareIcon className="w-6 inline mb-1" />
            </a>
          </div>
        ))}

        <PrimaryButton className="self-end">Apply</PrimaryButton>
      </div>
    </Dialog>
  );
};
