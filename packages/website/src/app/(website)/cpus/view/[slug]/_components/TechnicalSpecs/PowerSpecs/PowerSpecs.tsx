import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { PowerIntro } from './PowerIntro';
import { PowerTable } from './PowerTable';

interface PowerSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const PowerSpecs: FunctionComponent<PowerSpecsProps> = (props) => {
  const { cpu, className } = props;

  if (
    !hasProductFieldFormattedValue(cpu.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu.fields?.ppt)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Power Consumption</h3>
      <PowerIntro />
      <PowerTable cpu={cpu} />
    </section>
  );
};
