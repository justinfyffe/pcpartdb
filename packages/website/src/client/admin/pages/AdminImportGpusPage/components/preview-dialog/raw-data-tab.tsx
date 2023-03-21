import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

interface RawDataTabProps {
  gpu: Gpu;
}

export const RawDataTab: FunctionComponent<RawDataTabProps> = (props) => {
  const { gpu } = props;

  const json = useMemo(() => JSON.stringify(gpu, undefined, 2), [gpu]);

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <pre>{json}</pre>
    </div>
  );
};
