import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.streamProcessors) &&
    !hasProductFieldFormattedValue(gpu.fields?.shadingUnits) &&
    !hasProductFieldFormattedValue(gpu.fields?.cudaCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.computeUnits) &&
    !hasProductFieldFormattedValue(gpu.fields?.executionUnits) &&
    !hasProductFieldFormattedValue(gpu.fields?.streamMultiprocessors) &&
    !hasProductFieldFormattedValue(gpu.fields?.tmus) &&
    !hasProductFieldFormattedValue(gpu.fields?.rops) &&
    !hasProductFieldFormattedValue(gpu.fields?.aiAccelerators) &&
    !hasProductFieldFormattedValue(gpu.fields?.tensorCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.xeMatrixExtensions) &&
    !hasProductFieldFormattedValue(gpu.fields?.rayAccelerators) &&
    !hasProductFieldFormattedValue(gpu.fields?.rayTracingUnits) &&
    !hasProductFieldFormattedValue(gpu.fields?.rtCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.gpuCoreBaseClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.gpuCoreBoostClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.gpuCoreGameClock)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable gpu={gpu} />
    </section>
  );
};
