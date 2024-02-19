import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { MemoryIntro } from './MemoryIntro';
import { MemoryTable } from './MemoryTable';

interface MemorySpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const MemorySpecs: FunctionComponent<MemorySpecsProps> = (props) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.memorySize) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryType) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryBandwidth) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryInterface)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Memory</h3>
      <MemoryIntro />
      <MemoryTable gpu={gpu} />
    </section>
  );
};
