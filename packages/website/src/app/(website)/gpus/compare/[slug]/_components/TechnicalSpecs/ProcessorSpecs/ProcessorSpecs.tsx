import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProcessorIntro } from './ProcessorIntro';
import { ProcessorTable } from './ProcessorTable';

interface ProcessorSpecsProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const ProcessorSpecs: FunctionComponent<ProcessorSpecsProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu2.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu1.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu2.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu1.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu2.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu1.fields?.transistors) &&
    !hasProductFieldFormattedValue(gpu2.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Processor</h3>
      <ProcessorIntro />
      <ProcessorTable comparison={comparison} />
    </section>
  );
};
