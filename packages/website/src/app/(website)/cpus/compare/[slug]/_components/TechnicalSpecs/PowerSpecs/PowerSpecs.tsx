import {
  CpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { PowerIntro } from './PowerIntro';
import { PowerTable } from './PowerTable';

interface PowerSpecsProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const PowerSpecs: FunctionComponent<PowerSpecsProps> = (props) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu2.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pciExpress) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pciExpress) &&
    !hasProductFieldFormattedValue(cpu1.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu1.fields?.ppt) &&
    !hasProductFieldFormattedValue(cpu2.fields?.ppt) &&
    !hasProductFieldFormattedValue(cpu1.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu1.fields?.tjMax) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tjMax)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Compatibility &amp; Power Consumption</h3>
      <PowerIntro />
      <PowerTable comparison={comparison} />
    </section>
  );
};
