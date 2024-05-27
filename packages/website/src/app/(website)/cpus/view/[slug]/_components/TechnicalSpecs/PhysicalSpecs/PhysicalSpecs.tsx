import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { PhysicalIntro } from './PhysicalIntro';
import { PhysicalTable } from './PhysicalTable';

interface PhysicalSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const PhysicalSpecs: FunctionComponent<PhysicalSpecsProps> = (props) => {
  const { cpu, className } = props;

  if (
    !cpu.company &&
    !hasProductFieldFormattedValue(cpu.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Manufacturing Details</h3>
      <PhysicalIntro />
      <PhysicalTable cpu={cpu} />
    </section>
  );
};
