import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

interface RawDiffTabProps {
  dataUpdate: DataUpdate;
}

export const RawDiffTab: FunctionComponent<RawDiffTabProps> = (props) => {
  const { dataUpdate } = props;

  const json = useMemo(
    () => JSON.stringify(dataUpdate, undefined, 2),
    [dataUpdate],
  );

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <pre>{json}</pre>
    </div>
  );
};
