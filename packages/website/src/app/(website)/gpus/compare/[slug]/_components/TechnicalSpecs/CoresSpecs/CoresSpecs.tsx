import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.streamProcessors) &&
    !hasProductFieldFormattedValue(gpu2.fields?.streamProcessors) &&
    !hasProductFieldFormattedValue(gpu1.fields?.shadingUnits) &&
    !hasProductFieldFormattedValue(gpu2.fields?.shadingUnits) &&
    !hasProductFieldFormattedValue(gpu1.fields?.cudaCores) &&
    !hasProductFieldFormattedValue(gpu2.fields?.cudaCores) &&
    !hasProductFieldFormattedValue(gpu1.fields?.computeUnits) &&
    !hasProductFieldFormattedValue(gpu2.fields?.computeUnits) &&
    !hasProductFieldFormattedValue(gpu1.fields?.executionUnits) &&
    !hasProductFieldFormattedValue(gpu2.fields?.executionUnits) &&
    !hasProductFieldFormattedValue(gpu1.fields?.streamMultiprocessors) &&
    !hasProductFieldFormattedValue(gpu2.fields?.streamMultiprocessors) &&
    !hasProductFieldFormattedValue(gpu1.fields?.tmus) &&
    !hasProductFieldFormattedValue(gpu2.fields?.tmus) &&
    !hasProductFieldFormattedValue(gpu1.fields?.rops) &&
    !hasProductFieldFormattedValue(gpu2.fields?.rops) &&
    !hasProductFieldFormattedValue(gpu1.fields?.tensorCores) &&
    !hasProductFieldFormattedValue(gpu2.fields?.tensorCores) &&
    !hasProductFieldFormattedValue(gpu1.fields?.rtCores) &&
    !hasProductFieldFormattedValue(gpu2.fields?.rtCores) &&
    !hasProductFieldFormattedValue(gpu1.fields?.gpuCoreBaseClock) &&
    !hasProductFieldFormattedValue(gpu2.fields?.gpuCoreBaseClock) &&
    !hasProductFieldFormattedValue(gpu1.fields?.gpuCoreBoostClock) &&
    !hasProductFieldFormattedValue(gpu2.fields?.gpuCoreBoostClock) &&
    !hasProductFieldFormattedValue(gpu1.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(gpu2.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(gpu1.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(gpu2.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(gpu1.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu2.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu1.fields?.fp64) &&
    !hasProductFieldFormattedValue(gpu2.fields?.fp64)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable comparison={comparison} />
    </section>
  );
};
