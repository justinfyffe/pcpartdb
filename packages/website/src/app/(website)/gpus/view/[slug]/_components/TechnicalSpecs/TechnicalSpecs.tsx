import { GpuProduct } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { ApiSpecs } from './ApiSpecs';
import { CompatibilitySpecs } from './CompatibilitySpecs';
import { CoresSpecs } from './CoresSpecs';
import { MemorySpecs } from './MemorySpecs';
import { ProcessorSpecs } from './ProcessorSpecs';
import { TheoreticalPerfSpecs } from './TheoreticalPerfSpecs';

interface TechnicalSpecsProps {
  gpu: GpuProduct;
}

export function TechnicalSpecs(props: TechnicalSpecsProps) {
  const { gpu } = props;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="tech-specs">Technical Specs</SectionHeader>

      <div className="flex flex-col gap-6">
        <ProcessorSpecs gpu={gpu} />
        <CompatibilitySpecs gpu={gpu} />
        <MemorySpecs gpu={gpu} />
        <CoresSpecs gpu={gpu} />
        <TheoreticalPerfSpecs gpu={gpu} />
        <ApiSpecs gpu={gpu} />
      </div>
    </section>
  );
}
