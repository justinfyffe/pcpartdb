import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { hasGpuFieldValue } from '../../../../../gpus';

enum MissingData {
  MarketSegment = 'MARKET_SEGMENT',
  ReleaseDate = 'RELEASE_DATE',
  LaunchPrice = 'LAUNCH_PRICE',
}

const LABELS = {
  [MissingData.MarketSegment]: 'Market Segment',
  [MissingData.ReleaseDate]: 'Release Date',
  [MissingData.LaunchPrice]: 'Launch Price',
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
    <div className="flex justify-end gap-2 mx-2">
      {missingData.map((data) => (
        <div
          key={data}
          className="bg-red-300 py-1 px-3 font-bold text-2xs rounded-full inline-block"
        >
          {LABELS[data]}
        </div>
      ))}
    </div>
  );
};

function checkMissingData(gpu: Gpu): MissingData[] {
  const missingData: MissingData[] = [];

  if (!hasGpuFieldValue(gpu.marketSegment)) {
    missingData.push(MissingData.MarketSegment);
  }
  if (!hasGpuFieldValue(gpu.releaseDate)) {
    missingData.push(MissingData.ReleaseDate);
  }
  if (!hasGpuFieldValue(gpu.launchPrice)) {
    missingData.push(MissingData.LaunchPrice);
  }

  return missingData;
}
