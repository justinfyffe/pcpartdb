import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ArchitectureIntro } from './ArchitectureIntro';
import { ArchitectureTable } from './ArchitectureTable';

interface ArchitectureSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const ArchitectureSpecs: FunctionComponent<ArchitectureSpecsProps> = (
  props,
) => {
  const { cpu, className } = props;

  if (
    !hasProductFieldFormattedValue(cpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(cpu.fields?.codename) &&
    !hasProductFieldFormattedValue(cpu.fields?.generation) &&
    !hasProductFieldFormattedValue(cpu.fields?.memorySupport) &&
    !hasProductFieldFormattedValue(cpu.fields?.memoryChannels) &&
    !hasProductFieldFormattedValue(cpu.fields?.eccMemory) &&
    !hasProductFieldFormattedValue(cpu.fields?.pciExpress)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Architecture</h3>
      <ArchitectureIntro />
      <ArchitectureTable cpu={cpu} />
    </section>
  );
};
