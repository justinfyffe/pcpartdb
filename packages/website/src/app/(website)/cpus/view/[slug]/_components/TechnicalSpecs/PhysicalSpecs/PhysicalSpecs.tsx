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
    !hasProductFieldFormattedValue(cpu.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu.fields?.transistors) &&
    !hasProductFieldFormattedValue(cpu.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu.fields?.tjMax)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Physical</h3>
      <PhysicalIntro />
      <PhysicalTable cpu={cpu} />
    </section>
  );
};
