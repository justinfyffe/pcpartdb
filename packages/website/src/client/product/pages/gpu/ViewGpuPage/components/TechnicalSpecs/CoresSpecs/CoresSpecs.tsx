import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(gpu.fields?.gpuCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.computeUnits) &&
    !hasProductFieldFormattedValue(gpu.fields?.tmus) &&
    !hasProductFieldFormattedValue(gpu.fields?.rops) &&
    !hasProductFieldFormattedValue(gpu.fields?.tensorCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.rtCores) &&
    !hasProductFieldFormattedValue(gpu.fields?.gpuCoreBaseClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.gpuCoreBoostClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(gpu.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(gpu.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu.fields?.fp64)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable />
    </section>
  );
};
