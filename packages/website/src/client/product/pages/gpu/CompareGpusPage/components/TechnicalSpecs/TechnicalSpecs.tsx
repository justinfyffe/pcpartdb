import React, { FunctionComponent } from 'react';
import { ApiSpecs } from './ApiSpecs';
import { CompatibilitySpecs } from './CompatibilitySpecs';
import { CoresSpecs } from './CoresSpecs';
import { MemorySpecs } from './MemorySpecs';
import { ProcessorSpecs } from './ProcessorSpecs';

export const TechnicalSpecs: FunctionComponent = () => {
  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Technical Specs</h2>

      <div className="flex flex-col gap-6">
        <ProcessorSpecs />
        <MemorySpecs />
        <CompatibilitySpecs />
        <CoresSpecs />
        <ApiSpecs />
      </div>
    </section>
  );
};
