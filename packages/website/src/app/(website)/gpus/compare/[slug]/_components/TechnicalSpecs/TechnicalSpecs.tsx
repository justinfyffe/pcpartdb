import { GpuProductComparison } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';
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
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="tech-specs" menu={<Contents />}>
        Technical Specs
      </SectionHeader>

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
