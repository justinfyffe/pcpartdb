import {
  CpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { PhysicalIntro } from './PhysicalIntro';
import { PhysicalTable } from './PhysicalTable';

interface PhysicalSpecsProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const PhysicalSpecs: FunctionComponent<PhysicalSpecsProps> = (props) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  if (
    !cpu1.company &&
    !cpu2.company &&
    !hasProductFieldFormattedValue(cpu1.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu2.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu1.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu2.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu1.fields?.transistors) &&
    !hasProductFieldFormattedValue(cpu2.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Manufacturing Details</h3>
      <PhysicalIntro />
      <PhysicalTable comparison={comparison} />
    </section>
  );
};
