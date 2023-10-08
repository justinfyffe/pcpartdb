import {
  CpuProduct,
  hasProductFieldValue,
  hasProductSource,
  ProductSourceKey,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';

enum MissingData {
  TechPowerUp = 'TECHPOWERUP',
  PassMark = 'PASSMARK',
  GeekBench = 'GEEKBENCH',
  MarketSegment = 'MARKET_SEGMENT',
  ReleaseDate = 'RELEASE_DATE',
  LaunchPrice = 'LAUNCH_PRICE',
}

const LABELS = {
  [MissingData.TechPowerUp]: 'TechPowerUp',
  [MissingData.PassMark]: 'PassMark',
  [MissingData.GeekBench]: 'GeekBench',
  [MissingData.MarketSegment]: 'Market Segment',
  [MissingData.ReleaseDate]: 'Release Date',
  [MissingData.LaunchPrice]: 'Launch Price',
};

interface MissingCpuDataChipProps {
  cpu: CpuProduct;
}

export const MissingCpuDataChip: FunctionComponent<MissingCpuDataChipProps> = (
  props,
) => {
  const { cpu } = props;

  const missingData = useMemo(() => checkMissingCpuData(cpu), [cpu]);

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

function checkMissingCpuData(cpu: CpuProduct): MissingData[] {
  const missingData: MissingData[] = [];

  if (!hasProductSource(cpu, ProductSourceKey.TechPowerUp)) {
    missingData.push(MissingData.TechPowerUp);
  }

  if (!hasProductSource(cpu, ProductSourceKey.PassMark)) {
    missingData.push(MissingData.PassMark);
  }

  if (!hasProductSource(cpu, ProductSourceKey.GeekBench)) {
    missingData.push(MissingData.GeekBench);
  }

  if (!hasProductFieldValue(cpu.fields?.marketSegment)) {
    missingData.push(MissingData.MarketSegment);
  }
  if (!hasProductFieldValue(cpu.fields?.releaseDate)) {
    missingData.push(MissingData.ReleaseDate);
  }
  if (!hasProductFieldValue(cpu.fields?.msrp)) {
    missingData.push(MissingData.LaunchPrice);
  }

  return missingData;
}
