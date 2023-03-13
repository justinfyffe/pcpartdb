import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

interface PreviewDialogProps {
  gpu: Gpu;
}

export const PreviewDialog: FunctionComponent<PreviewDialogProps> = (props) => {
  const { gpu } = props;
  const json = useMemo(() => JSON.stringify(gpu, undefined, 2), [gpu]);

  return (
    <div className="bg-white flex flex-col h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <pre>{json}</pre>
    </div>
  );
};
