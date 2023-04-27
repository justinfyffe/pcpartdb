import { GpuDiff } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { GpuDiffView } from '../../../../components';

enum Tab {
  Formatted,
  Raw,
}

interface PreviewDialogProps {
  diff: GpuDiff;
}

export const PreviewDialog: FunctionComponent<PreviewDialogProps> = (props) => {
  const { diff } = props;

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <GpuDiffView diff={diff} />
    </div>
  );
};
