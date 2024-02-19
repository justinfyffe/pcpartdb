import { GpuProductComparison } from '@pcpartdb/shared';
import React from 'react';
import { ApiSpecs } from './ApiSpecs/ApiSpecs';
import { CompatibilitySpecs } from './CompatibilitySpecs/CompatibilitySpecs';
import { CoresSpecs } from './CoresSpecs/CoresSpecs';
import { MemorySpecs } from './MemorySpecs/MemorySpecs';
import { ProcessorSpecs } from './ProcessorSpecs/ProcessorSpecs';

interface TechnicalSpecsProps {
  comparison: GpuProductComparison;
}

export function TechnicalSpecs(props: TechnicalSpecsProps) {
  const { comparison } = props;

  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Technical Specs</h2>

      <div className="flex flex-col gap-6">
        <ProcessorSpecs comparison={comparison} />
        <MemorySpecs comparison={comparison} />
        <CompatibilitySpecs comparison={comparison} />
        <CoresSpecs comparison={comparison} />
        <ApiSpecs comparison={comparison} />
      </div>
    </section>
  );
}
