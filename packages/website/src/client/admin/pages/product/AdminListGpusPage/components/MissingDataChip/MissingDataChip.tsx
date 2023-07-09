import { Gpu, GpuDataSourceKey, hasProductFieldValue } from '@pcpartdb/shared';
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
          className="bg-warning text-default py-1 px-3 font-bold text-xs rounded-full inline-block"
        >
          {LABELS[data]}
        </div>
      ))}
    </div>
  );
};

function checkMissingData(gpu: Gpu): MissingData[] {
  const missingData: MissingData[] = [];

  if (gpu.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp]?.url == null) {
    missingData.push(MissingData.TechPowerUp);
  }

  if (
    gpu.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks]?.url == null
  ) {
    missingData.push(MissingData.VideocardBenchmark);
  }

  if (gpu.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks]?.url == null) {
    missingData.push(MissingData.UlBenchmarks);
  }

  if (!hasProductFieldValue(gpu.marketSegment)) {
    missingData.push(MissingData.MarketSegment);
  }
  if (!hasProductFieldValue(gpu.releaseDate)) {
    missingData.push(MissingData.ReleaseDate);
  }
  if (!hasProductFieldValue(gpu.launchPrice)) {
    missingData.push(MissingData.LaunchPrice);
  }

  return missingData;
}
