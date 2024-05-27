import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ProcessorIntro } from './ProcessorIntro';
import { ProcessorTable } from './ProcessorTable';

interface ProcessorSpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const ProcessorSpecs: FunctionComponent<ProcessorSpecsProps> = (
  props,
) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Processor Details</h3>
      <ProcessorIntro />
      <ProcessorTable gpu={gpu} />
    </section>
  );
};
