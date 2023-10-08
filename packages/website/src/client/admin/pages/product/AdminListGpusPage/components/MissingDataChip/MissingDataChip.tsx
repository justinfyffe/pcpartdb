import {
  GpuProduct,
  hasProductFieldValue,
  hasProductSource,
  ProductSourceKey,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

enum MissingData {
  TechPowerUp = 'TECHPOWERUP',
  VideocardBenchmark = 'VIDEOCARDBENCHMARK',
  UlBenchmarks = 'UL_BENCHMARKS',
  MarketSegment = 'MARKET_SEGMENT',
  ReleaseDate = 'RELEASE_DATE',
  LaunchPrice = 'LAUNCH_PRICE',
}

const LABELS = {
  [MissingData.TechPowerUp]: 'TechPowerUp',
  [MissingData.VideocardBenchmark]: 'Videocard Benchmark',
  [MissingData.UlBenchmarks]: 'UL Benchmarks',
  [MissingData.MarketSegment]: 'Market Segment',
  [MissingData.ReleaseDate]: 'Release Date',
  [MissingData.LaunchPrice]: 'Launch Price',
};

interface MissingDataChipProps {
  gpu: GpuProduct;
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
          className="bg-warning text-default py-1 px-3 font-bold text-xs rounded-full inline-block"
        >
          {LABELS[data]}
        </div>
      ))}
    </div>
  );
};

function checkMissingData(gpu: GpuProduct): MissingData[] {
  const missingData: MissingData[] = [];

  if (!hasProductSource(gpu, ProductSourceKey.TechPowerUp)) {
    missingData.push(MissingData.TechPowerUp);
  }

  if (!hasProductSource(gpu, ProductSourceKey.PassMark)) {
    missingData.push(MissingData.VideocardBenchmark);
  }

  if (!hasProductSource(gpu, ProductSourceKey.UlBenchmarks)) {
    missingData.push(MissingData.UlBenchmarks);
  }

  if (!hasProductFieldValue(gpu.fields?.marketSegment)) {
    missingData.push(MissingData.MarketSegment);
  }
  if (!hasProductFieldValue(gpu.fields?.releaseDate)) {
    missingData.push(MissingData.ReleaseDate);
  }
  if (!hasProductFieldValue(gpu.fields?.msrp)) {
    missingData.push(MissingData.LaunchPrice);
  }

  return missingData;
}
