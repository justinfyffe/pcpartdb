import { GpuProduct } from '@pcpartdb/shared';
import React from 'react';
import { ApiSpecs } from './ApiSpecs';
import { CompatibilitySpecs } from './CompatibilitySpecs';
import { CoresSpecs } from './CoresSpecs';
import { MemorySpecs } from './MemorySpecs';
import { ProcessorSpecs } from './ProcessorSpecs';

interface TechnicalSpecsProps {
  gpu: GpuProduct;
}

export function TechnicalSpecs(props: TechnicalSpecsProps) {
  const { gpu } = props;

  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Technical Specs</h2>

      <div className="flex flex-col gap-6">
        <ProcessorSpecs gpu={gpu} />
        <CompatibilitySpecs gpu={gpu} />
        <MemorySpecs gpu={gpu} />
        <CoresSpecs gpu={gpu} />
        <ApiSpecs gpu={gpu} />
      </div>
    </section>
  );
}
