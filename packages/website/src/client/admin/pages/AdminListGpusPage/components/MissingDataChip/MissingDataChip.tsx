import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { hasGpuFieldValue } from '../../../../../gpus';

enum MissingData {
  MarketSegment = 'MARKET_SEGMENT',
}

const LABELS = {
  [MissingData.MarketSegment]: 'Market Segment',
};

interface MissingDataChipProps {
  gpu: Gpu;
}

export const MissingDataChip: FunctionComponent<MissingDataChipProps> = (
  props,
) => {
  const { gpu } = props;

  const missingData = useMemo(() => checkMissingData(gpu), [gpu]);

  if (missingData.length === 0) {
    return <></>;
  }

  return (
    <>
      {missingData.map((data) => (
        <div
          key={data}
          className="bg-red-300 m-2 py-1 px-3 font-bold text-2xs rounded-full inline-block"
        >
          {LABELS[data]}
        </div>
      ))}
    </>
  );
};

function checkMissingData(gpu: Gpu): MissingData[] {
  const missingData: MissingData[] = [];

  if (!hasGpuFieldValue(gpu.marketSegment)) {
    missingData.push(MissingData.MarketSegment);
  }

  return missingData;
}
