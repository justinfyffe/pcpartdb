import React, { FunctionComponent } from 'react';
import { ApiSpecs } from './ApiSpecs';
import { CompatibilitySpecs } from './CompatibilitySpecs';
import { CoresSpecs } from './CoresSpecs';
import { MemorySpecs } from './MemorySpecs';
import { ProcessorSpecs } from './ProcessorSpecs';

export const TechnicalSpecs: FunctionComponent = () => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="mb-0 font-semibold">Technical Specs</h2>

      <ProcessorSpecs />

      <CompatibilitySpecs />
      <MemorySpecs />
      <CoresSpecs />
      <ApiSpecs />
    </section>
  );
};
