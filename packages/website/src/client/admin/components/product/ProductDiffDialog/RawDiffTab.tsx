import { ProductDiff } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

interface RawDiffTabProps {
  diff: ProductDiff;
}

export const RawDiffTab: FunctionComponent<RawDiffTabProps> = (props) => {
  const { diff } = props;

  const before = useMemo(
    () => JSON.stringify(diff.original, undefined, 2),
    [diff],
  );
  const after = useMemo(
    () => JSON.stringify(diff.updated, undefined, 2),
    [diff],
  );

  return (
    <div className="bg-white flex overflow-auto">
      <pre className="flex-1 max-w-[50%] whitespace-pre-wrap">{before}</pre>
      <pre className="flex-1 max-w-[50%] whitespace-pre-wrap">{after}</pre>
    </div>
  );
};
