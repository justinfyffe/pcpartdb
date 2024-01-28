import React, { FunctionComponent } from 'react';
import { ArchitectureSpecs } from './ArchitectureSpecs';
import { CacheSpecs } from './CacheSpecs';
import { CoresSpecs } from './CoresSpecs';
import { FeatureSpecs } from './FeatureSpecs';
import { PhysicalSpecs } from './PhysicalSpecs';
import { PowerSpecs } from './PowerSpecs';

export const TechnicalSpecs: FunctionComponent = () => {
  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Technical Specs</h2>

      <div className="flex flex-col gap-6">
        <PhysicalSpecs />
        <ArchitectureSpecs />
        <CoresSpecs />
        <CacheSpecs />
        <PowerSpecs />
        <FeatureSpecs />
      </div>
    </section>
  );
};
