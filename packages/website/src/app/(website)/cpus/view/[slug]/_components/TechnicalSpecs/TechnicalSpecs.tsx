import { CpuProduct } from '@pcpartdb/shared';
import React from 'react';
import { ArchitectureSpecs } from './ArchitectureSpecs/ArchitectureSpecs';
import { CacheSpecs } from './CacheSpecs/CacheSpecs';
import { CoresSpecs } from './CoresSpecs/CoresSpecs';
import { FeatureSpecs } from './FeatureSpecs/FeatureSpecs';
import { PhysicalSpecs } from './PhysicalSpecs/PhysicalSpecs';
import { PowerSpecs } from './PowerSpecs/PowerSpecs';

interface TechnicalSpecsProps {
  cpu: CpuProduct;
}

export function TechnicalSpecs(props: TechnicalSpecsProps) {
  const { cpu } = props;

  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Technical Specs</h2>

      <div className="flex flex-col gap-8">
        <PhysicalSpecs cpu={cpu} />
        <ArchitectureSpecs cpu={cpu} />
        <CoresSpecs cpu={cpu} />
        <CacheSpecs cpu={cpu} />
        <PowerSpecs cpu={cpu} />
        <FeatureSpecs cpu={cpu} />
      </div>
    </section>
  );
}
